import axios from "axios";
import {
    ACTION_PAGEMESSAGE, ACTION_UPDATECART, ACTION_PAGELOADER,
    ACTION_ACTIONMESSAGE, ACTION_CARTDATA_ADDRESS, ACTION_GUESTBILLING,
    ACTION_GUESTSAMEASSHIPPINGBILLING, getGuestCartToken, ACTION_GUESTSHIPPING,
    ACTION_TOKEN, ACTION_USERDATA, ACTION_ISLOGGEDUSER, getCustomerQuoteId,
    ACTION_IS_ORDER_COMPLETE,
    ACTION_SHOWAUTHENTICATIONPOPUP
} from '../../../Store/action';
import { customer, baseUrl } from "../../../Utilities/Constant";

// checkout guest total cart
export const guestTotalCartCheckout = async (dispatch, guestToken, cartSummaryDetails, setTotalLoader) => {
     // For continous loading-->Future use
    // setTotalLoader(true)
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}guest-carts/${guestToken}/totals`
        });
        setTotalLoader(false)
        if (Response?.data[0]?.code === 200) {
            cartSummaryDetails(Response?.data[0])
        }
    } catch (err) {
        console.log("Error", err)
        setTotalLoader(false)
    }
}

// guest Set payment information
export const guestSetPaymentInformation = async (dispatch, token, paymentMethod, email, updateTotalInfo, setUpdateTotalInfo, setSetPaymentInformationLoader) => {
    setSetPaymentInformationLoader(true)
    try {
        const data = {
            cartId: token,
            paymentMethod: {
                method: paymentMethod
            },
            email: email ? email?.trim() : ""
        }

        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${token}/set-payment-information`,
            data
        });
        setSetPaymentInformationLoader(false)
        if (Response?.data[0]?.code === 200) {
            setUpdateTotalInfo(!updateTotalInfo)
        }
    } catch (err) {
        console.log("Error", err)
        setSetPaymentInformationLoader(false)
    }
}

// guest placeOrder all api
export const guestPlaceOrder = async (guestCartToken, dispatch, shippData, selectPaymentMethod, setIsShippingAddressChnaged, handlePayment) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        if (
            shippData?.shipping_carrier_code && shippData?.shipping_method_code &&
            shippData?.shipping_address?.countryId
        ) {
            const data = {
                addressInformation: {
                    shipping_address: {
                        countryId: shippData?.shipping_address?.countryId,
                        regionId: shippData?.shipping_address?.regionId ? shippData?.shipping_address?.regionId : null,
                        regionCode: shippData?.shipping_address?.regionId ? shippData?.shipping_address?.regionId : null,
                        region: shippData?.shipping_address?.region ? shippData?.shipping_address?.region : null,
                        street: [
                            shippData?.shipping_address?.street?.[0] ? shippData?.shipping_address?.street?.[0] : null,
                            shippData?.shipping_address?.street?.[1] ? shippData?.shipping_address?.street?.[1] : null,
                        ],
                        company: shippData?.shipping_address?.company,
                        telephone: shippData?.shipping_address?.telephone,
                        postcode: shippData?.shipping_address?.postcode,
                        city: shippData?.shipping_address?.city,
                        firstname: shippData?.shipping_address?.firstname,
                        lastname: shippData?.shipping_address?.lastname,
                        email: shippData?.shipping_address?.email?.trim(),
                        same_as_billing: shippData?.shipping_address?.same_as_billing
                    },
                    billing_address: {
                        countryId: shippData?.billing_address?.countryId,
                        regionId: shippData?.billing_address?.regionId ? shippData?.billing_address.regionId : null,
                        regionCode: shippData?.billing_address?.regionId ? shippData?.billing_address?.regionId : null,
                        region: shippData?.billing_address?.region ? shippData?.billing_address?.region : null,
                        street: [
                            shippData?.billing_address?.street?.[0] ? shippData?.billing_address?.street?.[0] : null,
                            shippData?.billing_address?.street?.[1] ? shippData?.billing_address?.street?.[1] : null,
                        ],
                        company: shippData?.billing_address?.company,
                        telephone: shippData?.billing_address?.telephone,
                        postcode: shippData?.billing_address?.postcode,
                        city: shippData?.billing_address?.city,
                        firstname: shippData?.billing_address?.firstname,
                        lastname: shippData?.billing_address?.lastname,
                        saveInAddressBook: null
                    },
                    shipping_method_code: shippData?.shipping_method_code,
                    shipping_carrier_code: shippData?.shipping_carrier_code,
                    extension_attributes: {}
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}guest-carts/${guestCartToken}/shipping-information`,
                data
            });
            setIsShippingAddressChnaged(false)
            if (Response?.data?.[0]?.code == 200) {
                handlePayment()
            }
        }

    } catch (err) {
        console.log("Error", err)
    }
}

// Guest reset cart
export const guestResetCart = async (dispatch, order_id) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            order_id: order_id
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/resetcart`,
            data
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setTimeout(() => {
                dispatch(ACTION_UPDATECART());
            }, 700);
            dispatch(ACTION_IS_ORDER_COMPLETE({
                orderId: "",
                isCancel: false
            }));
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}

// shipping information
export const guestShippingInformation = async (token, dispatch, params, setPaymentInfoData, setShippingInforLoader) => {
    if (
        params?.shipping_carrier_code && params?.shipping_method_code &&
        params?.shipping_address?.countryId && params?.billing_address?.countryId
    ) {
        // For continous loading-->Future use
        // setShippingInforLoader(true)
        try {
            const data = {
                addressInformation: {
                    shipping_address: {
                        countryId: params?.shipping_address?.countryId,
                        regionId: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        regionCode: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        region: params?.shipping_address?.region ? params?.shipping_address?.region : null,
                        street: [
                            params?.shipping_address?.street?.[0] ? params?.shipping_address?.street?.[0] : null,
                            params?.shipping_address?.street?.[1] ? params?.shipping_address?.street?.[1] : null,
                        ],
                        company: params?.shipping_address?.company,
                        telephone: params?.shipping_address?.telephone,
                        postcode: params?.shipping_address?.postcode,
                        city: params?.shipping_address?.city,
                        firstname: params?.shipping_address?.firstname,
                        lastname: params?.shipping_address?.lastname,
                        email: params?.shipping_address?.email?.trim(),
                        same_as_billing: params?.shipping_address?.same_as_billing
                    },
                    billing_address: {
                        countryId: params?.billing_address?.countryId,
                        regionId: params?.billing_address?.regionId ? params?.billing_address.regionId : null,
                        regionCode: params?.billing_address?.regionId ? params?.billing_address?.regionId : null,
                        region: params?.billing_address?.region ? params?.billing_address?.region : null,
                        street: [
                            params?.billing_address?.street?.[0] ? params?.billing_address?.street?.[0] : null,
                            params?.billing_address?.street?.[1] ? params?.billing_address?.street?.[1] : null,
                        ],
                        company: params?.billing_address?.company,
                        telephone: params?.billing_address?.telephone,
                        postcode: params?.billing_address?.postcode,
                        city: params?.billing_address?.city,
                        firstname: params?.billing_address?.firstname,
                        lastname: params?.billing_address?.lastname,
                        saveInAddressBook: null
                    },
                    shipping_method_code: params?.shipping_method_code,
                    shipping_carrier_code: params?.shipping_carrier_code,
                    extension_attributes: {}
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}guest-carts/${token}/shipping-information`,
                data
            });
            setShippingInforLoader(false)
            setPaymentInfoData(Response?.data)
        } catch (err) {
            console.log("Error", err)
            setShippingInforLoader(false)
        }
    }
}

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
// guest estimateShipping
export const getGuestEstimateShipping = async (token, dispatch, data, setEstimateShippingData, cartId, setEstimateShippingLoader) => {
    if (data?.country_id) {
         // For continous loading-->Future use
        // setEstimateShippingLoader(true)
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
// razorpay paymentDetails
export const guestRazorpayPaymentDetails = async (token, dispatch, magOrderId, orderDetails, email, navigate,guestShipping,cartSummaryDetails) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            data: {
                email: email,
                order_id: magOrderId,
                rzp_payment_id: orderDetails?.razorpay_payment_id,
                rzp_signature: orderDetails?.razorpay_signature
            },
            userDetails:{
                billing_address:{
                    firstname:guestShipping?.first_name,
                    lastname:guestShipping?.last_name,
                    email:guestShipping?.email,
                    telephone:guestShipping?.number,
                    city:guestShipping?.city,
                    street:[guestShipping?.address1,guestShipping?.address2]

                }
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/rzp-payment-details`,
            data
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_CARTDATA_ADDRESS({
                address: {
                    countryId: "",
                    display_country: "",
                    postcode: "",
                    region: "",
                    region_id: ""
                },
                shippingMethod: {}
            }))
            dispatch(ACTION_GUESTSHIPPING({}))
            dispatch(ACTION_GUESTBILLING({}))
            dispatch(ACTION_GUESTBILLING({}))
            dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
            getGuestCartToken(dispatch, false)
            navigate('/ordersuccess', {
                state: {
                    orderid: Response?.data[0]?.order_id,
                
                    productDetails:cartSummaryDetails,
                    userDetails:data.userDetails,
                    info: "order"
                }
            })
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// razorpay orderId
export const guestCreateRazorpayOrderId = async (token, dispatch, orderid, gemail) => {
    if (orderid !== "failed") {
        dispatch(ACTION_PAGELOADER(true));
        try {
            const data = {
                data: {
                    email: gemail,
                    order_id: orderid
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}guest-carts/placerazorpayorder`,
                data
            });
            dispatch(ACTION_PAGELOADER(false));
            return Response?.data?.[0]?.message
        } catch (err) {
            console.log("Error", err)
            dispatch(ACTION_PAGELOADER(false));
        }
    }
}
// createOrder
export const guestCreateOrder = async (token, dispatch, params, setgetOrderInfoData) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${token}/payment-information`,
            params
        });
        dispatch(ACTION_PAGELOADER(false));
        setgetOrderInfoData(Response?.data?.[0]);
        // purposely commented
        // dispatch(ACTION_UPDATECART())
        if (Response?.data?.[0]?.code == 200) {
            return Response?.data?.[0]?.order_increment_id
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: "checkout"
            }))
            return "failed";
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// existed email
export const isExitedEmail = async (dispatch, email, setFormValues, setFormError, setValidatePassword) => {
    console.log("isExistmail api");
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            customerEmail: email
        }
        const Response = await axios.post(`${customer()}isemailavailable`, data);
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setValidatePassword(true)
            setFormError(() => ({
                email: "",
                password: ""
            }))
        } else {
            setValidatePassword(false)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false))
    }
}
// existed quote email
export const isExitedQuoteEmail = async (dispatch, email, setFormValues, setFormError, setValidatePassword) => {
    console.log("isExistmail api");
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            customerEmail: email
        }
        const Response = await axios.post(`${customer()}isemailavailable`, data);
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setValidatePassword(true)
            setFormError(() => ({
                email: "",
                password: ""
            }))
        } else {
            setValidatePassword(false)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false))
    }
}
// quote login API
export const Action_Checkout_QuoteLogin = async (formValues, dispatch, setFormValues, setOpenMyaccount,setValidatePassword,showAuthencationPopup) => {
    console.log("isExist login",formValues);
    dispatch(ACTION_PAGELOADER(true))
    
    setOpenMyaccount(false)
    try {
        const Response = await axios.post(`${customer()}logincustomer`, formValues);
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setFormValues((prevState) => ({
                ...prevState,
                username: "",
                password: ""
            }))
            dispatch(ACTION_IS_ORDER_COMPLETE({
                orderId: "",
                isCancel: false
            }));
            dispatch(ACTION_TOKEN(Response?.data[0]?.token))
            dispatch(ACTION_USERDATA(Response?.data[0]?.customer_data))
            dispatch(ACTION_ISLOGGEDUSER(true))
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isWarning: false,
                isError: false,
                title: "Login",
                message: Response?.data[0]?.message,
                showPopup: true,
                redirect: ""
            }))
            dispatch(ACTION_CARTDATA_ADDRESS({
                address: {
                    countryId: "",
                    display_country: "",
                    postcode: "",
                    region: "",
                    region_id: ""
                },
                shippingMethod: {}
            }))
            setValidatePassword(false)
            getCustomerQuoteId(dispatch, Response?.data[0]?.token, true)
        } else {
            setValidatePassword(true)
            dispatch(ACTION_PAGELOADER(false))
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Login failed",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
            // dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
            //     loginReg: showAuthencationPopup?.loginReg,
            //     forgotPas: false,
            //     resetPass: false
            // }))
        }
    } catch (err) {
        dispatch(ACTION_PAGELOADER(false))
        console.log(err)
    }
}
// Login API
export const Action_Checkout_Login = async (formValues, dispatch, setFormValues, setOpenMyaccount) => {
    dispatch(ACTION_PAGELOADER(true))
    setOpenMyaccount(false)
    try {
        const Response = await axios.post(`${customer()}logincustomer`, formValues);
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            setFormValues((prevState) => ({
                ...prevState,
                username: "",
                password: ""
            }))
            dispatch(ACTION_IS_ORDER_COMPLETE({
                orderId: "",
                isCancel: false
            }));
            dispatch(ACTION_TOKEN(Response?.data[0]?.token))
            dispatch(ACTION_USERDATA(Response?.data[0]?.customer_data))
            dispatch(ACTION_ISLOGGEDUSER(true))
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isWarning: false,
                isError: false,
                title: "Login",
                message: Response?.data[0]?.message,
                showPopup: true,
                redirect: ""
            }))
            dispatch(ACTION_CARTDATA_ADDRESS({
                address: {
                    countryId: "",
                    display_country: "",
                    postcode: "",
                    region: "",
                    region_id: ""
                },
                shippingMethod: {}
            }))
            getCustomerQuoteId(dispatch, Response?.data[0]?.token, true)
        } else {
            dispatch(ACTION_PAGELOADER(false))
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Login failed",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
        }
    } catch (err) {
        dispatch(ACTION_PAGELOADER(false))
        console.log(err)
    }
}