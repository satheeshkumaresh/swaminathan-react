import axios from "axios";
import { 
    ACTION_PAGELOADER, ACTION_SCROLLTOTOP, SessionExpiredLogout, ACTION_ACTIONMESSAGE, ACTION_PAGEMESSAGE, 
    ACTION_UPDATEACCOUTUSERDATA, ACTION_UPDATEWISHLIST, ACTION_UPDATECART, ACTION_GROUPEDFROMWISHLISTTOCART
} from '../../../Store/action';
import { customer, baseUrl } from "../../../Utilities/Constant";
import {MYACCOUNTCURRENTPAGE} from "../../../Store/action-type";

// actions
export const ACTION_MYACCOUNTCURRENTPAGE = (page) => {
    return {
        type: MYACCOUNTCURRENTPAGE,
        payload: page
    }
}
// get address api
export const getAddress = async (token, dispatch, postPage, show, allAddress, setAllAddress, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_SCROLLTOTOP())
    try {
        const data = {
            pageSize: show ? show : 15,
            currPage: postPage ? postPage : 1,
            allAddress: allAddress
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}alladdress`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_SCROLLTOTOP())
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setAllAddress(Response?.data[0])
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false))
    }
}
// get my recent orders
export const getMyRecentOrders = async (token, dispatch, setMyRecentOrderData, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}recentorder`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setMyRecentOrderData(Response?.data?.[0]?.orderdata)
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        dispatch(ACTION_PAGELOADER(false));
        console.log("Error", err)
    }
}

// addAccountInfo
export const addAccountInfo = async (token, dispatch, formValues, setUpdateInfo, setFormValues, navigate, pageName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
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
            data: {
                firstname: formValues?.firstname,
                lastname: formValues?.lastname,
                mobile: formValues?.countryCode?.length ? formValues?.mobile?.length == formValues?.countryCode?.length + 1 ? "" : formValues?.mobile : formValues?.mobile,
                email: formValues?.email,
                current_password: formValues?.current_password,
                new_password: formValues?.new_password,
                confirm_password: formValues?.confirm_password
            }
        }
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}swaminathan/myaccount`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const signOut = () => {
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isError: false,
                isWarning: false,
                title: "Logout",
                message: "You have successfully logged out.",
                showPopup: false,
                redirect: "/logout",
                refreshPage: true
            }))
            navigate("/logout")
            setTimeout(() => {
                localStorage.clear();
                window.location.reload();
            }, 300)
        }
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            if (Response?.data[0]?.isLogout) {
                setTimeout(() => {
                    signOut()
                }, 2000);
            } else {
                navigate('/account/dashboard')
            }
            setUpdateInfo(true)
            setFormValues((prevState) => ({
                ...prevState,
                current_password: "",
                new_password: "",
                confirm_password: ""
            }))
            dispatch(ACTION_UPDATEACCOUTUSERDATA());
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
        dispatch(ACTION_PAGELOADER(false))
    }
}

// deleteAddress
export const deleteAddress = async (token, dispatch, id, setUpdateAddress, updateAddress, setOpen, pageName, isSesstionTimeOut) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const Response = await axios({
            method: "delete",
            url: `${baseUrl()}swaminathan/address/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setUpdateAddress(!updateAddress)
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
        dispatch(ACTION_PAGELOADER(false))
    }
}

// accountAddAddressBook
export const accountAddAddressBook = async (
    token, dispatch, formValues, setUpdateAddress, updateAddress, setShowAddressForm, setFormValues,
    navigate, toRedirect, pageName, isSesstionTimeOut
) => {
    dispatch(ACTION_PAGELOADER(true));
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
            customer: {
                firstname: formValues?.firstname,
                lastname: formValues?.lastname,
                company: formValues?.company,
                streetaddress: [
                    formValues?.streetaddress1 ? formValues?.streetaddress1 : '',
                    formValues?.streetaddress2 ? formValues?.streetaddress2 : ''
                ],
                country_id: formValues?.country,
                region_id: formValues?.state,
                city: formValues?.city,
                zip_code: formValues?.zip_code,
                phonenumber: formValues?.phonenumber,
                DefaultBilling: formValues?.DefaultBilling,
                DefaultShipping: formValues?.DefaultShipping,
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}address`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            navigate(toRedirect)
            setShowAddressForm(false)
            setFormValues((prevState) => ({
                ...prevState,
                firstname: "",
                lastname: "",
                phonenumber: "",
                company: "",
                streetaddress1: "",
                streetaddress2: "",
                city: "",
                zip_code: "",
                country: "",
                display_country: "",
                state: "",
                display_state: "",
                DefaultBilling: "",
                DefaultShipping: ""
            }))
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateAddress(!updateAddress)
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
        dispatch(ACTION_PAGELOADER(false))
    }
}

// accountUpdateAddressBook
export const accountUpdateAddressBook = async (
    token, dispatch, addressId, formValues, setUpdateAddress, updateAddress,
    setShowAddressForm, setFormValues, navigate, toRedirect, pageName, isSesstionTimeOut
) => {
    dispatch(ACTION_PAGELOADER(true));
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
            addressId: addressId,
            customer: {
                firstname: formValues?.firstname,
                lastname: formValues?.lastname,
                company: formValues?.company,
                streetaddress: [
                    formValues?.streetaddress1 ? formValues?.streetaddress1 : "",
                    formValues?.streetaddress2 ? formValues?.streetaddress2 : ""
                ],
                country_id: formValues?.country,
                region_id: formValues?.state,
                city: formValues?.city,
                zip_code: formValues?.zip_code,
                phonenumber: formValues?.phonenumber,
                DefaultBilling: formValues?.DefaultBilling,
                DefaultShipping: formValues?.DefaultShipping,
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}updateaddress`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            navigate(toRedirect)
            setShowAddressForm(false)
            setFormValues((prevState) => ({
                ...prevState,
                firstname: "",
                lastname: "",
                phonenumber: "",
                company: "",
                streetaddress1: "",
                streetaddress2: "",
                city: "",
                zip_code: "",
                country: "",
                display_country: "",
                state: "",
                display_state: "",
                DefaultBilling: "",
                DefaultShipping: ""
            }))
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateAddress(!updateAddress)
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
        dispatch(ACTION_PAGELOADER(false))
    }
}

// customer News Letter
export const customerNewsLetter = async (token, id, dispatch, setSubscribe, subscriberState, navigate, pageName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
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
            isSubscriberStatus: subscriberState
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}newsletter/${id}`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEACCOUTUSERDATA())
            navigate("/account/dashboard")
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
        dispatch(ACTION_PAGELOADER(false));
    }
}

// delete wishlist
export const deleteWishList = async (token, dispatch, item_id, setOpen, pageName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    setOpen(false)
    try {
        const Response = await axios({
            method: "delete",
            url: `${baseUrl()}wishlist/${item_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEWISHLIST(true))
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
        dispatch(ACTION_PAGELOADER(false));
        console.log("Error", err)
    }
}

// add all to cart wishlist
export const addAllToCart = async (token, dispatch, pageName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const Response = await axios({
            method: "post",
            url: `${customer()}addalltocart`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEWISHLIST(true))
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: false,
                isWarning: false,
                message: "",
                showFor: pageName,
                multipleMessages: Response?.data[0]?.message
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: "Error while adding to cart.",
                showFor: pageName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        dispatch(ACTION_PAGELOADER(false));
        console.log("Error", err)
    }
}

// add to cart wishlist
export const wishlistAddToCart = async (token, dispatch, sku, qty, wishlist_id, setShowRotate, pageName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGELOADER(true));
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: "",

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
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
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

// get myorders
export const getMyOrders = async (token, dispatch, currentPage, show, setMyOrderData, setMyOrderLoader, isSesstionTimeOut) => {
    setMyOrderLoader(true)
    dispatch(ACTION_SCROLLTOTOP())
    try {
        const data = {
            pageSize: show ? show : 15,
            currPage: currentPage ? currentPage : 1
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}myorder`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_SCROLLTOTOP())
        setMyOrderLoader(false)
        if (Response?.data[0]?.code === 200) {
            setMyOrderData(Response?.data[0])
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        setMyOrderLoader(false)
        console.log("Error", err)
    }
}

// viewOrder
export const viewOrder = async (token, dispatch, order_id, setViewOrderData, setViewOrderLoader, isSesstionTimeOut) => {
    setViewOrderLoader(true)
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}vieworder/${order_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setViewOrderLoader(false)
        if (Response?.data[0]?.code === 200) {
            setViewOrderData(Response?.data[0]?.data?.[0])
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        setViewOrderLoader(false)
        console.log("Error", err)
    }
}

// viewOrder
export const reOrder = async (token, dispatch, order_id, navigate, pathName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "post",
            url: `${customer()}reorder/${order_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            navigate("/mycart")
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: false,
                isWarning: false,
                message: "",
                showFor: pathName,
                multipleMessages: Response?.data[0]?.message
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: "",
                showFor: pathName,
                multipleMessages: Response?.data[0]?.message
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        dispatch(ACTION_PAGELOADER(false));
        console.log("Error", err)
    }
}