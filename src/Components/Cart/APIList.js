import axios from "axios";
import {
    SessionExpiredLogout, ACTION_PAGELOADER, ACTION_PAGEMESSAGE,
    ACTION_UPDATECART, ACTION_ACTIONMESSAGE
} from '../../Store/action';
import { customer, baseUrl } from "../../Utilities/Constant";

// customer Cart summary
export const cartSummary = async (token, dispatch, quote_id, cartSummaryData, setCartSummaryDetails, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            addressInformation: {
                address: {
                    countryId: cartSummaryData?.countryId,
                    postcode: cartSummaryData?.postcode,
                    region: cartSummaryData?.region,
                    regionId: cartSummaryData?.region_id ? cartSummaryData?.region_id : null,
                },
                shipping_method_code: cartSummaryData?.shipping_method?.method_code,
                shipping_carrier_code: cartSummaryData?.shipping_method?.carrier_code
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/${quote_id}/totals-information`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setCartSummaryDetails(Response?.data[0]?.data)
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        dispatch(ACTION_PAGELOADER(false));
        console.log("Error", err)
    }
}
// guest Cart summary
export const guestCartSummary = async (dispatch, token, cartSummaryData, setCartSummaryDetails) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            addressInformation: {
                address: {
                    countryId: cartSummaryData?.countryId,
                    postcode: cartSummaryData?.postcode,
                    region: cartSummaryData?.region,
                    regionId: cartSummaryData?.region_id ? cartSummaryData?.region_id : null,
                },
                shipping_method_code: cartSummaryData?.shipping_method?.method_code,
                shipping_carrier_code: cartSummaryData?.shipping_method?.carrier_code
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${token}/totals-information`,
            data
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setCartSummaryDetails(Response?.data[0]?.data)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// Coupon api's
// Guest cartApply Coupon
export const GuestCartApplyCoupon = async (dispatch, cartId, couponCode, setRotateCoupon, setCouponData, setCouponCode,
    setUpdateCartSummary, updateCartSummary, pageName) => {
    setRotateCoupon(true)
    try {
        const Response = await axios.put(`${baseUrl()}guest-carts/${cartId}/coupons/${couponCode}`);
        setRotateCoupon(false)
        if (Response?.data[0]?.code === 200) {
            setCouponCode("")
            setCouponData(Response?.data[0]?.data)
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateCartSummary(!updateCartSummary)
        } else {
            setCouponData(Response?.data[0])
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
        setRotateCoupon(false)
        console.log("Error", err)
    }
}
// customer remove Coupon
export const guestCartRemoveCoupon = async (dispatch, token, cartId, couponCode, setRotateCoupon,
    setCouponData, setCouponCode, setUpdateCartSummary, updateCartSummary, pageName) => {
    setRotateCoupon(true)
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
            url: `${baseUrl()}guest-carts/${token}/coupons`
        });
        setRotateCoupon(false)
        if (Response?.data[0]?.code === 200) {
            setCouponCode("")
            setCouponData(Response?.data[0]?.data)
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateCartSummary(!updateCartSummary)
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
        setRotateCoupon(false)
        console.log("Error", err)
    }
}
// customer cartApply Coupon
export const customerCartApplyCoupon = async (token, dispatch, cartId, couponCode, setRotateCoupon,
    setCouponData, setCouponCode, setUpdateCartSummary, updateCartSummary, pageName, isSesstionTimeOut) => {
    setRotateCoupon(true)
    try {
        const Response = await axios({
            method: "put",
            url: `${customer()}carts/${cartId}/coupons/${couponCode}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setRotateCoupon(false)
        if (Response?.data[0]?.code === 200) {
            setCouponCode("")
            setCouponData(Response?.data[0]?.data)
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateCartSummary(!updateCartSummary)
        } else {
            setCouponData(Response?.data[0])
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
        setRotateCoupon(false)
        console.log("Error", err)
    }
}
// customer remove Coupon
export const customerCartRemoveCoupon = async (token, dispatch, cartId, couponCode, setRotateCoupon,
    setCouponData, setCouponCode, setUpdateCartSummary, updateCartSummary, pageName, isSesstionTimeOut) => {
    setRotateCoupon(true)
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
            url: `${customer()}carts/${cartId}/coupons`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setRotateCoupon(false)
        if (Response?.data[0]?.code === 200) {
            setCouponCode("")
            setCouponData(Response?.data[0]?.data)
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
            setUpdateCartSummary(!updateCartSummary)
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
        setRotateCoupon(false)
        console.log("Error", err)
    }
}
// guest estimateShipping
export const getGuestEstimateShipping = async (token, dispatch, data, setEstimateShippingData, cartId, setEstimateShippingLoader) => {
    if (data?.country_id) {
        setEstimateShippingLoader(true)
        try {
            const params = {
                address: {
                    street: [data?.address1 ? data?.address1 : "", data?.address2 ? data?.address2 : ""],
                    city: data?.city,
                    region_id: data?.region_id ? data?.region_id : null,
                    region: data?.region,
                    country_id: data?.country_id,
                    postcode: data?.postcode,
                    firstname: data?.firstname,
                    lastname: data?.lastname,
                    company: data?.company,
                    telephone: data?.telephone
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}guest-carts/${token}/estimate-shipping-methods`,
                params
            });
            setEstimateShippingLoader(false)
            if (Response?.data[0]?.code === 200) {
                setEstimateShippingData(Response?.data[0]?.data)
            }
        } catch (err) {
            console.log("Error", err)
            setEstimateShippingLoader(false)
        }
    }
}
// get estimateShipping
export const getEstimateShippingCart = async (token, dispatch, data, setEstimateShippingData, cartId, setEstimateShippingLoader, isSesstionTimeOut) => {
    if (data?.country_id && data?.customer_id) {
        setEstimateShippingLoader(true)
        const shippingData = {
            address: {
                customer_id: data?.customer_id,
                street: [data?.address1 ? data?.address1 : "", data?.address2 ? data?.address2 : ""],
                city: data?.city,
                region_id: data?.region_id ? data?.region_id : null,
                region: data?.region,
                country_id: data?.country_id,
                postcode: data?.postcode,
                firstname: data?.firstname,
                lastname: data?.lastname,
                company: data?.company,
                telephone: data?.telephone
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(shippingData)
        };
        fetch(`${customer()}carts/mine/estimate-shipping-methods?cart_id=${cartId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setEstimateShippingLoader(false)
                setEstimateShippingData(data?.[0]?.data)
            })
            .catch((err) => {
                if (err?.response?.status == 401 && !isSesstionTimeOut) {
                    SessionExpiredLogout(dispatch)
                }
                console.log(err)
                setEstimateShippingLoader(false)
            })
    }
}
// Customer delete
export const deleteCutomerCartItems = async (token, dispatch, item_id, setOpen, pageName, isSesstionTimeOut) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}carts/mine/items/${item_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        setOpen(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
        } else {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
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
        setOpen(false)
    }
}
// customer delete all cartitems
export const deleteAllCartItems = async (token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, pageName, isSesstionTimeOut) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}deleteallcart/${cartId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_UPDATECART());
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
// Customer update
export const updateCutomerCartItems = async (token, dispatch, item_id, data, setRotate, setRotateSameId, pageName, isSesstionTimeOut) => {
    setRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const Response = await axios.put(`${customer()}carts/mine/items/${item_id}`, data, {
            headers: headers
        });
        setRotate(false)
        setRotateSameId(null)
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
            dispatch(ACTION_UPDATECART())
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
        setRotate(false)
    }
}
// updateGuestCart
export const updateGuestCart = async (dispatch, guestCartToken, item_id, data, setRotate, setRotateSameId, pageName) => {
    setRotate(true)
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
            method: "put",
            url: `${customer()}guest-carts/${guestCartToken}/items/${item_id}`,
            data
        });
        setRotate(false)
        setRotateSameId(null)
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
            dispatch(ACTION_UPDATECART())
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
        setRotate(false)
    }
}
// deleteGuestCart
export const deleteGuestCart = async (guestCartToken, dispatch, item_id, setOpen, pageName) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios.delete(`${customer()}guest-carts/${guestCartToken}/items/${item_id}`);
        setOpen(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
        } else {
            dispatch(ACTION_UPDATECART())
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
        dispatch(ACTION_PAGELOADER(false));
        setOpen(false)
    }
}
// guest delete all cartitems
export const deleteGuestAllCartItems = async (token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, pageName) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}guest-carts/deleteallcart/${token}`,
        });
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isWarning: false,
                isError: false,
                title: "Mycart",
                message: Response?.data[0]?.message,
                showPopup: true,
                redirect: ""
            }))
        } else {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Mycart",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
    }
}