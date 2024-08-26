import axios from "axios";
import { 
    SessionExpiredLogout, ACTION_PAGEMESSAGE, ACTION_UPDATECART, ACTION_PAGELOADER, 
    ACTION_UPDATEWISHLIST, ACTION_GROUPEDFROMWISHLISTTOCART, ACTION_GET_PRODUCTDATA,
    ACTION_ACTIONMESSAGE
} from '../../../Store/action';
import { customer, productUrl } from "../../../Utilities/Constant";

// Customer addgrouped products to cart
export const addCutomerGroupedCartItems = async (token, dispatch, sku, setShowRotate, groupedData, pageName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: 1,
                product_option: {
                    extension_attributes: {
                        grouped_options: groupedData
                    }
                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/items`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setShowRotate(false)
    }
}
// addGuestGroupedCart
export const addGuestGroupedCart = async (dispatch, guestCartToken, sku, setShowRotate, groupedData, pageName) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: 1,
                product_option: {
                    extension_attributes: {
                        grouped_options: groupedData
                    }
                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${guestCartToken}/items`,
            data
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setShowRotate(false)
    }
}
// wishlistAddToCartGrouped
export const wishlistAddToCartGrouped = async (token, dispatch, sku, groupedData, wishlist_id, setShowRotate, navigate, redirect, pageName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: "",
        multipleMessages: {}
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: 1,
                product_option: {
                    extension_attributes: {
                        grouped_options: groupedData
                    }
                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}wishlist/cart/mine/${wishlist_id}`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setShowRotate(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEWISHLIST(true))
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_GROUPEDFROMWISHLISTTOCART({
                id: "",
                sku: ""
            }))
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName,
                multipleMessages: {}
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName,
                multipleMessages: {}
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        dispatch(ACTION_PAGELOADER(false));
        setShowRotate(false)
        console.log("Error", err)
    }
}
// PDP API
export const productAPI = async (dispatch, urlKey, entityId, navigate, setPdpLoader) => {
    setPdpLoader(true)
    dispatch(ACTION_GET_PRODUCTDATA([]))
    try {
        const data = {
            data: {
                url_key: urlKey,
                category_id: entityId,
                same_category_id: entityId
            }
        }
        console.log("data pdp",data);
        const Response = await axios({
            method: "post",
            url: productUrl(),
            data
        });
        setPdpLoader(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_PRODUCTDATA(Response?.data))
        } else {
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Failed to load product",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
            dispatch(ACTION_GET_PRODUCTDATA([]))
        }
    } catch (err) {
        console.log("Error", err)
        setPdpLoader(false)
    }
}

// Customer add
export const customerBuyNowAddcart = async (token, dispatch, sku, qty, setShowRotate, navigate, url, pathName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: qty
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/items`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setShowRotate(false)
    }
}
// Customer addgrouped products to cart
export const customerBuyNowGroupedCartItems = async (token, dispatch, sku, setShowRotate, groupedData, navigate, url, pathName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: 1,
                product_option: {
                    extension_attributes: {
                        grouped_options: groupedData
                    }
                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/items`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setShowRotate(false)
    }
}

// guestBuyNow
export const guestBuyNowAddcart = async (dispatch, guestCartToken, sku, qty, setShowRotate, navigate, url, pathName) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                quote_id: guestCartToken,
                sku: sku,
                qty: qty
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${guestCartToken}/items`,
            data
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setShowRotate(false)
    }
}
// addGuestGroupedCart
export const guestBuyNowGroupedCart = async (dispatch, guestCartToken, sku, setShowRotate, groupedData, navigate, url, pathName) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: 1,
                product_option: {
                    extension_attributes: {
                        grouped_options: groupedData
                    }
                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${guestCartToken}/items`,
            data
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setShowRotate(false)
    }
}