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

    // 🆕 Helper: get a friendly error message from an axios error
    // Backend sends { success: false, message: "..." } inside error.response.data
    const getErrorMessage = (error) => {
        return error?.response?.data?.message || error?.message || 'Something went wrong';
    }

    // 🆕 Helper: look up how much stock is available for a given product + size
    const getAvailableStock = (productId, size) => {
        const product = products.find(p => p._id === productId);
        if (!product) return 0;
        const sizeEntry = product.sizes.find(s => s.size === size);
        return sizeEntry?.stock ?? 0;
    }

    // 🆕 Helper: how many of this product+size are already in the cart
    const getCurrentCartQty = (productId, size) => {
        return cartItems?.[productId]?.[size] ?? 0;
    }

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        // 🆕 Stock check BEFORE adding
        const available = getAvailableStock(itemId, size);
        const inCart = getCurrentCartQty(itemId, size);

        if (inCart + 1 > available) {
            toast.error(
                available === 0
                    ? 'Out of stock'
                    : `Only ${available} available. You already have ${inCart} in cart.`
            );
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));   // 🆕 use helper
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) { }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        // 🆕 Stock check — but only for increases, and only when quantity > 0
        // (quantity 0 means "remove from cart" which is always OK)
        if (quantity > 0) {
            const available = getAvailableStock(itemId, size);
            if (quantity > available) {
                toast.error(`Only ${available} available`);
                return;
            }
        }

        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(getErrorMessage(error));   // 🆕 use helper
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) { }
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
            toast.error(getErrorMessage(error));   // 🆕 use helper
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
            toast.error(getErrorMessage(error));   // 🆕 use helper
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
        getAvailableStock,   // 🆕 expose to Cart.jsx so it can use it for max attribute
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider