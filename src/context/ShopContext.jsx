import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatPrice, getEffectivePrice } from "../utils/format";

export const ShopContext = createContext();

const readLocalArray = (key) => {
    try {
        const parsed = JSON.parse(localStorage.getItem(key));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Decodes a JWT's exp claim (base64, no dependency) and checks expiry.
// Returns true for missing/malformed/expired tokens. Mirrors admin/src/lib/api.js.
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
}

const ShopContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    // Default to true so the wall doesn't flash on legitimate users while
    // we're still loading. We'll flip to false if /me confirms unverified.
    const [isVerified, setIsVerified] = useState(true);
    // Becomes true once the initial token-restore effect has run. Route guards
    // wait on this so a refresh on a protected page doesn't redirect a
    // logged-in user before their token is read back from localStorage.
    const [authChecked, setAuthChecked] = useState(false);
    // Wishlist lives in localStorage for guests; once logged in the local
    // list is merged into the account and the server becomes source of truth.
    const [wishlist, setWishlist] = useState(() => readLocalArray('wishlist'));
    const [recentlyViewed, setRecentlyViewed] = useState(() => readLocalArray('recentlyViewed'));
    const navigate = useNavigate();

    // Helpers for composite key "Color|Size"
    const makeKey = (color, size) => `${color}|${size}`
    const parseKey = (key) => {
        const [color, size] = key.split('|')
        return { color, size }
    }

    const getErrorMessage = (error) => {
        return error?.response?.data?.message || error?.message || 'Something went wrong';
    }

    // Clears the session everywhere: token (state + storage), cart, and verified
    // flag, then sends the user to login. `expired: true` shows the "session
    // expired" toast (used by the 401 interceptor); a manual logout stays quiet.
    const logout = ({ redirect = true, expired = false } = {}) => {
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
        setIsVerified(true);
        if (expired) {
            toast.info('Session expired. Please log in again.', { toastId: 'session-expired' });
        }
        if (redirect) {
            navigate('/login');
        }
    }

    // Look up stock for a specific product+color+size variant
    const getAvailableStock = (productId, color, size) => {
        const product = products.find(p => p._id === productId);
        if (!product) return 0;
        const variant = product.variants?.find(v => v.color === color && v.size === size);
        return variant?.stock ?? 0;
    }

    // How many of a specific variant are in the cart right now
    const getCurrentCartQty = (productId, color, size) => {
        const key = makeKey(color, size)
        return cartItems?.[productId]?.[key] ?? 0;
    }

    // addToCart takes (productId, color, size, qty)
    const addToCart = async (itemId, color, size, qty = 1) => {

        if (!color) {
            toast.error("Select Color")
            return
        }
        if (!size) {
            toast.error("Select Size");
            return;
        }

        const quantity = Math.max(1, Number(qty) || 1);
        const available = getAvailableStock(itemId, color, size);
        const inCart = getCurrentCartQty(itemId, color, size);

        if (inCart + quantity > available) {
            toast.error(
                available === 0
                    ? 'Out of stock'
                    : `Only ${available} available. You already have ${inCart} in cart.`
            );
            return;
        }

        const key = makeKey(color, size)
        const newQty = inCart + quantity;
        const cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId][key] = newQty;
        } else {
            cartData[itemId] = { [key]: newQty };
        }

        setCartItems(cartData);

        if (token) {
            try {
                if (quantity === 1) {
                    await axios.post(backendUrl + '/api/cart/add', { itemId, color, size }, { headers: { token } });
                } else {
                    // /cart/update sets the absolute quantity and creates the
                    // entry when missing — one call regardless of qty.
                    await axios.post(backendUrl + '/api/cart/update', { itemId, color, size, quantity: newQty }, { headers: { token } });
                }
            } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));
            }
        }
    }

    // ---------- Wishlist ----------

    const isInWishlist = (productId) => wishlist.includes(productId);

    const getWishlistCount = () => wishlist.length;

    const toggleWishlist = async (productId) => {
        const previous = wishlist;
        const optimistic = previous.includes(productId)
            ? previous.filter(id => id !== productId)
            : [...previous, productId];
        setWishlist(optimistic);

        if (token) {
            try {
                const response = await axios.post(backendUrl + '/api/wishlist/toggle', { productId }, { headers: { token } });
                if (response.data.success) {
                    setWishlist(response.data.wishlist);
                }
            } catch (error) {
                console.log(error);
                setWishlist(previous);
                toast.error(getErrorMessage(error));
            }
        }
    }

    // On login: merge the guest wishlist into the account, then adopt the
    // server list. $addToSet on the server means nothing is ever removed.
    const syncWishlist = async (userToken) => {
        try {
            const localIds = readLocalArray('wishlist');
            const endpoint = localIds.length ? '/api/wishlist/merge' : '/api/wishlist/get';
            const response = await axios.post(backendUrl + endpoint, { productIds: localIds }, { headers: { token: userToken } });
            if (response.data.success) {
                setWishlist(response.data.wishlist);
            }
        } catch (error) {
            console.log(error);
            // Keep the local list on failure — nothing is lost.
        }
    }

    // ---------- Recently viewed (localStorage only) ----------

    const addRecentlyViewed = (productId) => {
        setRecentlyViewed(prev => {
            const next = [productId, ...prev.filter(id => id !== productId)].slice(0, 8);
            return next;
        });
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const productId in cartItems) {
            for (const key in cartItems[productId]) {
                if (cartItems[productId][key] > 0) {
                    totalCount += cartItems[productId][key];
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, color, size, quantity) => {
        if (quantity > 0) {
            const available = getAvailableStock(itemId, color, size);
            if (quantity > available) {
                toast.error(`Only ${available} available`);
                return;
            }
        }

        const key = makeKey(color, size)
        const cartData = structuredClone(cartItems);
        if (!cartData[itemId]) cartData[itemId] = {}
        cartData[itemId][key] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, color, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const productId in cartItems) {
            const productInfo = products.find((product) => product._id === productId);
            if (!productInfo) continue
            const unit = getEffectivePrice(productInfo).price;
            for (const key in cartItems[productId]) {
                if (cartItems[productId][key] > 0) {
                    totalAmount += unit * cartItems[productId][key];
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(getErrorMessage(error));
        }
    }

    const getUserCart = async (userToken) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(getErrorMessage(error));
        }
    }

    // Fetch the current user's verified status from /me.
    // Called on token load and whenever token changes.
    const getUserVerifiedStatus = async (userToken) => {
        try {
            const response = await axios.get(backendUrl + '/api/user/me', {
                headers: { token: userToken }
            })
            if (response.data.success) {
                setIsVerified(response.data.user.isVerified ?? true)
            }
        } catch (error) {
            console.log(error)
            // On error, leave isVerified as-is. Don't block users due to a network blip.
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    // Restore a saved session on load — but only if the token is still valid.
    // Expired tokens are dropped up front so the UI never looks logged in with
    // a dead token. `authChecked` flips true once this has run, so route guards
    // can wait for it instead of redirecting logged-in users on a refresh.
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && !isTokenExpired(savedToken)) {
            setToken(savedToken);
            getUserCart(savedToken);
            getUserVerifiedStatus(savedToken);
        } else if (savedToken) {
            localStorage.removeItem('token');
        }
        setAuthChecked(true);
    }, []);

    // Global 401 handler. auth.js returns 401 for any missing/invalid/expired
    // token, so a 401 while we hold a token means the session is dead — clear it
    // and bounce to login. 403 is deliberately NOT handled here: the only 403 a
    // logged-in user hits is the "verify your email" checkout gate, which must
    // not log them out.
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401 && localStorage.getItem('token')) {
                    logout({ expired: true });
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptorId);
    }, []);

    // Persist wishlist + recently viewed (also acts as a guest cache while
    // logged in — harmless, and survives logout).
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    // Merge guest wishlist into the account whenever a token appears
    useEffect(() => {
        if (token) {
            syncWishlist(token);
        }
    }, [token]);

    // Re-check verified status whenever the token changes
    // (covers fresh login, register, and tab inheriting from localStorage)
    useEffect(() => {
        if (token) {
            getUserVerifiedStatus(token)
        }
    }, [token])

    const value = {
        products, currency, delivery_fee, formatPrice,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken, logout, authChecked,
        getAvailableStock,
        parseKey,
        isVerified, setIsVerified,
        getUserVerifiedStatus,
        wishlist, toggleWishlist, isInWishlist, getWishlistCount,
        recentlyViewed, addRecentlyViewed,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider