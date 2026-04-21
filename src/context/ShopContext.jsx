import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // 🆕 Helpers for composite key "Color|Size"
    const makeKey = (color, size) => `${color}|${size}`
    const parseKey = (key) => {
        const [color, size] = key.split('|')
        return { color, size }
    }

    const getErrorMessage = (error) => {
        return error?.response?.data?.message || error?.message || 'Something went wrong';
    }

    // 🆕 Look up stock for a specific product+color+size variant
    const getAvailableStock = (productId, color, size) => {
        const product = products.find(p => p._id === productId);
        if (!product) return 0;
        const variant = product.variants?.find(v => v.color === color && v.size === size);
        return variant?.stock ?? 0;
    }

    // 🆕 How many of a specific variant are in the cart right now
    const getCurrentCartQty = (productId, color, size) => {
        const key = makeKey(color, size)
        return cartItems?.[productId]?.[key] ?? 0;
    }

    // 🆕 addToCart now takes (productId, color, size)
    const addToCart = async (itemId, color, size) => {

        if (!color) {
            toast.error("Select Color")
            return
        }
        if (!size) {
            toast.error("Select Size");
            return;
        }

        const available = getAvailableStock(itemId, color, size);
        const inCart = getCurrentCartQty(itemId, color, size);

        if (inCart + 1 > available) {
            toast.error(
                available === 0
                    ? 'Out of stock'
                    : `Only ${available} available. You already have ${inCart} in cart.`
            );
            return;
        }

        const key = makeKey(color, size)
        const cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId][key] = (cartData[itemId][key] || 0) + 1;
        } else {
            cartData[itemId] = { [key]: 1 };
        }

        setCartItems(cartData);

        if (token) {
            try {
                // 🆕 backend now receives color and size
                await axios.post(backendUrl + '/api/cart/add', { itemId, color, size }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));
            }
        }
    }

    // 🆕 Count works the same — composite keys are still just string keys
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

    // 🆕 updateQuantity now takes (productId, color, size, quantity)
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

    // 🆕 getCartAmount — unchanged signature, but internally we don't care about key content
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const productId in cartItems) {
            const productInfo = products.find((product) => product._id === productId);
            if (!productInfo) continue
            for (const key in cartItems[productId]) {
                if (cartItems[productId][key] > 0) {
                    totalAmount += productInfo.price * cartItems[productId][key];
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

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            const savedToken = localStorage.getItem('token');
            setToken(savedToken);
            getUserCart(savedToken);
        }
    }, []);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl,
        token, setToken,
        getAvailableStock,
        parseKey,       // 🆕 exposed so Cart.jsx can split "Color|Size"
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider