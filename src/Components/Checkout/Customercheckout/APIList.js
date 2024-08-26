import axios from "axios";
import { 
    SessionExpiredLogout, ACTION_PAGEMESSAGE, ACTION_UPDATECART, ACTION_PAGELOADER, 
    ACTION_CUSTOMERSAMEASSHIPPING, ACTION_CARTDATA_ADDRESS, getCustomerQuoteId, ACTION_IS_ORDER_COMPLETE
} from '../../../Store/action';
import { customer, baseUrl } from "../../../Utilities/Constant";

// checkout customer total cart
export const customerTotalCartCheckout = async (dispatch, token, setCartSummaryDetails, setTotalLoader, isSesstionTimeOut) => {
    setTotalLoader(true)
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}carts/mine/totals`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setTotalLoader(false)
        if (Response?.data[0]?.code === 200) {
            setCartSummaryDetails(Response?.data[0])
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setTotalLoader(false)
    }
}

// customer Set payment information
export const customerSetPaymentInformation = async (dispatch, token, paymentMethod, cartId, updateTotalInfo, setUpdateTotalInfo, setSetPaymentInformationLoader, isSesstionTimeOut) => {
    setSetPaymentInformationLoader(true)
    try {
        const data = {
            cartId: cartId,
            paymentMethod: {
                method: paymentMethod
            }
        }

        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/set-payment-information`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setSetPaymentInformationLoader(false)
        if (Response?.data[0]?.code === 200) {
            setUpdateTotalInfo(!updateTotalInfo)
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setSetPaymentInformationLoader(false)
    }
}

// customer Get Shipping and billing address
export const customerGetShippingBillingAddres = async (
    dispatch, token, setGetShippingBillingAddres, setEstimateShipping, setetBillingShippingAddressLoader,
    setIsGetShippBillLoaded, isGetShippBillLoaded, isSesstionTimeOut
) => {
    setetBillingShippingAddressLoader(true)
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}carts/mine/billing-address`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setetBillingShippingAddressLoader(false)
        if (Response?.data[0]?.code === 200) {
            if (!isGetShippBillLoaded) {
                setIsGetShippBillLoaded(true)
            }
            setGetShippingBillingAddres(Response?.data?.[0]);
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setetBillingShippingAddressLoader(false)
    }
}

// customer add billing address
export const customerAddBillingAddressAPI = async (dispatch, token, billingFormValues, cartId, setUpdatePaymentInformation, updatePaymentInformation, setBillingAddressHandlerLoader, isSesstionTimeOut) => {
    setBillingAddressHandlerLoader(true)
    try {
        const data = {
            cartId: cartId,
            address: {
                customerAddressId: billingFormValues?.customerAddressId,
                countryId: billingFormValues?.country,
                regionId: billingFormValues?.state ? billingFormValues?.state : null,
                regionCode: billingFormValues?.state ? billingFormValues?.state : null,
                region: billingFormValues?.display_state ? billingFormValues?.display_state : null,
                street: [
                    billingFormValues?.address1,
                    billingFormValues?.address2 ? billingFormValues?.address2 : ''
                ],
                company: billingFormValues?.company,
                telephone: billingFormValues?.number,
                postcode: billingFormValues?.zip_code,
                city: billingFormValues?.city,
                firstname: billingFormValues?.first_name,
                lastname: billingFormValues?.last_name,
                saveInAddressBook: billingFormValues?.saveInAddressBook ? billingFormValues?.saveInAddressBook : 0,
                same_as_billing: billingFormValues?.same_as_billing
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/billing-address`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setBillingAddressHandlerLoader(false)
        if (Response?.data[0]?.code === 200) {
            setUpdatePaymentInformation(!updatePaymentInformation)
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setBillingAddressHandlerLoader(false)
    }
}

// customer estimateShipping by address id
export const customerEstimateShippingById = async (
    dispatch, token, addressId, setEstimateShippingData, setEstimateShippingLoader,
    setUpdateShippingInformationById, updateShippingInformationById, isSesstionTimeOut
) => {
    setEstimateShippingLoader(true)
    try {
        const data = {
            addressId: addressId
        }

        const Response = await axios({
            method: "post",
            url: `${baseUrl()}carts/mine/estimate-shipping-methods-by-address-id`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setEstimateShippingLoader(false)
        if (Response?.data[0]?.code === 200) {
            setEstimateShippingData(Response?.data?.[0]?.data)
            setUpdateShippingInformationById(!updateShippingInformationById)
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setEstimateShippingLoader(false)
    }
}

// guest placeOrder all api
export const customerPlaceOrder = async (token, dispatch, params, selectPaymentMethod, setIsShippingAddressChnaged, handlePayment, setGetShippingBillingAddres, setGetNewAddresses, setCreateOrderInfo, customerSameAsShipping, cartId, shippingFormValues, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        if (
            params?.shipping_carrier_code && params?.shipping_method_code &&
            params?.shipping_address?.countryId
        ) {
            const data = {
                addressInformation: {
                    shipping_address: {
                        customerAddressId: params?.shipping_address?.customerAddressId,
                        countryId: params?.shipping_address?.countryId,
                        regionId: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        regionCode: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        region: params?.shipping_address?.region ? params?.shipping_address?.region : null,
                        street: [
                            params?.shipping_address?.street?.[0] ? params?.shipping_address?.street?.[0] : '',
                            params?.shipping_address?.street?.[1] ? params?.shipping_address?.street?.[1] : '',
                        ],
                        company: params?.shipping_address?.company,
                        telephone: params?.shipping_address?.telephone,
                        postcode: params?.shipping_address?.postcode,
                        city: params?.shipping_address?.city,
                        firstname: params?.shipping_address?.firstname,
                        lastname: params?.shipping_address?.lastname,
                        saveInAddressBook: params?.shipping_address?.save_in_address_book,
                        same_as_billing: params?.shipping_address?.same_as_billing
                    },
                    billing_address: {
                        customerAddressId: params?.billing_address?.customerAddressId,
                        countryId: params?.billing_address?.countryId,
                        regionId: params?.billing_address?.regionId ? params?.billing_address?.regionId : null,
                        regionCode: params?.billing_address?.regionId ? params?.billing_address?.regionId : null,
                        region: params?.billing_address?.region ? params?.billing_address?.region : null,
                        street: [
                            params?.billing_address?.street?.[0] ? params?.billing_address?.street?.[0] : '',
                            params?.billing_address?.street?.[1] ? params?.billing_address?.street?.[1] : '',
                        ],
                        company: params?.billing_address?.company,
                        telephone: params?.billing_address?.telephone,
                        postcode: params?.billing_address?.postcode,
                        city: params?.billing_address?.city,
                        firstname: params?.billing_address?.firstname,
                        lastname: params?.billing_address?.lastname,
                        saveInAddressBook: params?.billing_address?.saveInAddressBook
                    },
                    address_from: params?.address_from,
                    shipping_method_code: params?.shipping_method_code,
                    shipping_carrier_code: params?.shipping_carrier_code,
                    extension_attributes: {}
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}carts/mine/shipping-information`,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setGetNewAddresses(true)
            setIsShippingAddressChnaged(false)
            if (Response?.data?.[0]?.code == 200) {
                const addResponse = await axios({
                    method: "get",
                    url: `${customer()}carts/mine/billing-address`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                let newCreateOrderInfo = {};
                if (customerSameAsShipping) {
                    newCreateOrderInfo = {
                        cartId: cartId,
                        email: addResponse?.data?.[0]?.data?.shipping_address?.email,
                        paymentMethod: {
                            method: selectPaymentMethod
                        },
                        billing_address: {
                            region: addResponse?.data?.[0]?.data?.shipping_address?.region ? addResponse?.data?.[0]?.data?.shipping_address?.region : shippingFormValues?.display_state,
                            region_id: addResponse?.data?.[0]?.data?.shipping_address?.region_id ? addResponse?.data?.[0]?.data?.shipping_address?.region_id : shippingFormValues?.state,
                            region_code: "",
                            country_id: addResponse?.data?.[0]?.data?.shipping_address?.country_id ? addResponse?.data?.[0]?.data?.shipping_address?.country_id : shippingFormValues?.country,
                            street: [
                                addResponse?.data?.[0]?.data?.shipping_address?.street?.[0] ? addResponse?.data?.[0]?.data?.shipping_address?.street?.[0] : shippingFormValues?.address1,
                                addResponse?.data?.[0]?.data?.shipping_address?.street?.[1] ? addResponse?.data?.[0]?.data?.shipping_address?.street?.[1] : shippingFormValues?.address2
                            ],
                            postcode: addResponse?.data?.[0]?.data?.shipping_address?.postcode ? addResponse?.data?.[0]?.data?.shipping_address?.postcode : shippingFormValues?.zip_code,
                            city: addResponse?.data?.[0]?.data?.shipping_address?.city ? addResponse?.data?.[0]?.data?.shipping_address?.city : shippingFormValues?.city,
                            firstname: addResponse?.data?.[0]?.data?.shipping_address?.firstname ? addResponse?.data?.[0]?.data?.shipping_address?.firstname : shippingFormValues?.first_name,
                            lastname: addResponse?.data?.[0]?.data?.shipping_address?.lastname ? addResponse?.data?.[0]?.data?.shipping_address?.lastname : shippingFormValues?.last_name,
                            email: addResponse?.data?.[0]?.data?.shipping_address?.email,
                            telephone: addResponse?.data?.[0]?.data?.shipping_address?.telephone ? addResponse?.data?.[0]?.data?.shipping_address?.telephone : shippingFormValues?.number,
                            saveInAddressBook: 0
                        }
                    }
                } else {
                    newCreateOrderInfo = {
                        cartId: cartId,
                        email: addResponse?.data?.[0]?.data?.shipping_address?.email,
                        paymentMethod: {
                            method: selectPaymentMethod
                        },
                        billing_address: {
                            region: addResponse?.data?.[0]?.data?.billing_address?.region,
                            region_id: addResponse?.data?.[0]?.data?.billing_address?.region_id,
                            region_code: "",
                            country_id: addResponse?.data?.[0]?.data?.billing_address?.country_id,
                            street: [
                                addResponse?.data?.[0]?.data?.billing_address?.street?.[0],
                                addResponse?.data?.[0]?.data?.billing_address?.street?.[1] ? addResponse?.data?.[0]?.data?.billing_address?.street?.[1] : ""
                            ],
                            postcode: addResponse?.data?.[0]?.data?.billing_address?.postcode,
                            city: addResponse?.data?.[0]?.data?.billing_address?.city,
                            firstname: addResponse?.data?.[0]?.data?.billing_address?.firstname,
                            lastname: addResponse?.data?.[0]?.data?.billing_address?.lastname,
                            email: addResponse?.data?.[0]?.data?.billing_address?.email,
                            telephone: addResponse?.data?.[0]?.data?.billing_address?.telephone,
                            saveInAddressBook: addResponse?.data?.[0]?.data?.billing_address?.save_in_address_book
                        }
                    }
                }
                if (addResponse?.data[0]?.code === 200) {
                    setGetShippingBillingAddres(addResponse?.data?.[0]);
                    handlePayment(addResponse?.data?.[0], newCreateOrderInfo)
                }
            }
        }

    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
    }
}

// reset cart
export const customerResetCart = async (token, dispatch, order_id, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            order_id: order_id
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/resetcart`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
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
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}

// shipping information
export const shippingInformation = async (token, dispatch, params, setPaymentInfoData, setShippingInforLoader, isSesstionTimeOut) => {
    if (params?.shipping_carrier_code && params?.shipping_method_code) {
        setShippingInforLoader(true)
        try {
            const data = {
                addressInformation: {
                    shipping_address: {
                        customerAddressId: params?.shipping_address?.customerAddressId,
                        countryId: params?.shipping_address?.countryId,
                        regionId: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        regionCode: params?.shipping_address?.regionId ? params?.shipping_address?.regionId : null,
                        region: params?.shipping_address?.region ? params?.shipping_address?.region : null,
                        street: [
                            params?.shipping_address?.street?.[0] ? params?.shipping_address?.street?.[0] : '',
                            params?.shipping_address?.street?.[1] ? params?.shipping_address?.street?.[1] : '',
                        ],
                        company: params?.shipping_address?.company,
                        telephone: params?.shipping_address?.telephone,
                        postcode: params?.shipping_address?.postcode,
                        city: params?.shipping_address?.city,
                        firstname: params?.shipping_address?.firstname,
                        lastname: params?.shipping_address?.lastname,
                        saveInAddressBook: params?.shipping_address?.save_in_address_book,
                        same_as_billing: params?.shipping_address?.same_as_billing
                    },
                    billing_address: {
                        customerAddressId: params?.billing_address?.customerAddressId,
                        countryId: params?.billing_address?.countryId,
                        regionId: params?.billing_address?.regionId ? params?.billing_address?.regionId : null,
                        regionCode: params?.billing_address?.regionId ? params?.billing_address?.regionId : null,
                        region: params?.billing_address?.region ? params?.billing_address?.region : null,
                        street: [
                            params?.billing_address?.street?.[0] ? params?.billing_address?.street?.[0] : '',
                            params?.billing_address?.street?.[1] ? params?.billing_address?.street?.[1] : '',
                        ],
                        company: params?.billing_address?.company,
                        telephone: params?.billing_address?.telephone,
                        postcode: params?.billing_address?.postcode,
                        city: params?.billing_address?.city,
                        firstname: params?.billing_address?.firstname,
                        lastname: params?.billing_address?.lastname,
                        saveInAddressBook: params?.billing_address?.saveInAddressBook
                    },
                    address_from: params?.address_from,
                    shipping_method_code: params?.shipping_method_code,
                    shipping_carrier_code: params?.shipping_carrier_code,
                    extension_attributes: {}
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}carts/mine/shipping-information`,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setShippingInforLoader(false);
            setPaymentInfoData(Response?.data)
        } catch (err) {
            if (err?.response?.status == 401 && !isSesstionTimeOut) {
                SessionExpiredLogout(dispatch)
            }
            console.log("Error", err)
            setShippingInforLoader(false);
        }
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
// customer estimateShipping
export const getEstimateShipping = async (token, dispatch, data, setEstimateShippingData, cartId, setEstimateShippingLoader, isSesstionTimeOut) => {
    setEstimateShippingLoader(true);
    const shippingData = {
        address: {
            street: [data?.address1, data?.address2 ? data?.address2 : ""],
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
            dispatch(ACTION_PAGELOADER(false));
        })
        .catch((err) => {
            if (err?.response?.status == 401 && !isSesstionTimeOut) {
                SessionExpiredLogout(dispatch)
            }
            console.log(err)
            setEstimateShippingLoader(false);
        });
}
// razorpay paymentDetails
export const razorpayPaymentDetails = async (token, dispatch, magOrderId, orderDetails, getShippingBillingAddres, navigate, isSesstionTimeOut,cartSummaryDetails) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            shipping_address: {
                countryId: getShippingBillingAddres?.data?.shipping_address?.country_id,
                regionId: getShippingBillingAddres?.data?.shipping_address?.region_id,
                regionCode: getShippingBillingAddres?.data?.shipping_address?.region_id,
                region: getShippingBillingAddres?.data?.shipping_address?.region,
                street: [
                    getShippingBillingAddres?.data?.shipping_address?.street?.[0],
                    getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : ''
                ],
                company: getShippingBillingAddres?.data?.shipping_address?.company ? getShippingBillingAddres?.data?.shipping_address?.company : '',
                telephone: getShippingBillingAddres?.data?.shipping_address?.telephone,
                postcode: getShippingBillingAddres?.data?.shipping_address?.postcode,
                city: getShippingBillingAddres?.data?.shipping_address?.city,
                firstname: getShippingBillingAddres?.data?.shipping_address?.firstname,
                lastname: getShippingBillingAddres?.data?.shipping_address?.lastname,
                saveInAddressBook: getShippingBillingAddres?.data?.shipping_address?.save_in_address_book
            },
            billing_address: {
                countryId: getShippingBillingAddres?.data?.billing_address?.country_id,
                regionId: getShippingBillingAddres?.data?.billing_address?.region_id,
                regionCode: getShippingBillingAddres?.data?.billing_address?.region_id,
                region: getShippingBillingAddres?.data?.billing_address?.region,
                street: [
                    getShippingBillingAddres?.data?.billing_address?.street?.[0],
                    getShippingBillingAddres?.data?.billing_address?.street?.[1] ? getShippingBillingAddres?.data?.billing_address?.street?.[1] : ''
                ],
                company: getShippingBillingAddres?.data?.billing_address?.company ? getShippingBillingAddres?.data?.billing_address?.company : '',
                telephone: getShippingBillingAddres?.data?.billing_address?.telephone,
                postcode: getShippingBillingAddres?.data?.billing_address?.postcode,
                city: getShippingBillingAddres?.data?.billing_address?.city,
                firstname: getShippingBillingAddres?.data?.billing_address?.firstname,
                lastname: getShippingBillingAddres?.data?.billing_address?.lastname,
                saveInAddressBook: getShippingBillingAddres?.data?.billing_address?.save_in_address_book,
                email:getShippingBillingAddres?.data?.billing_address?.email,
            },
            data: {
                order_id: magOrderId,
                rzp_payment_id: orderDetails?.razorpay_payment_id,
                rzp_signature: orderDetails?.razorpay_signature
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/rzp-payment-details`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_CUSTOMERSAMEASSHIPPING(false))
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
            if (!isSesstionTimeOut) {
                getCustomerQuoteId(dispatch, token, false)
            }
            navigate('/ordersuccess', {
                state: {
                    orderid: Response?.data[0]?.order_id,
                    productDetails:cartSummaryDetails,
                    userDetails:data.billing_address,
                    info: "order"
                }
            })
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// razorpay orderId
export const createRazorpayOrderId = async (token, dispatch, orderid, isSesstionTimeOut) => {
    if (orderid !== "failed") {
        dispatch(ACTION_PAGELOADER(true));
        try {
            const data = {
                data: {
                    order_id: orderid
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}carts/placerazorpayorder`,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(ACTION_PAGELOADER(false));
            return Response?.data?.[0]?.message
        } catch (err) {
            if (err?.response?.status == 401 && !isSesstionTimeOut) {
                SessionExpiredLogout(dispatch)
            }
            console.log("Error", err)
            dispatch(ACTION_PAGELOADER(false));
        }
    }
}
// createOrder
export const createOrder = async (token, dispatch, params, setgetOrderInfoData, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/payment-information`,
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        setgetOrderInfoData(Response?.data?.[0])
        // purposely commented
        // if (!isSesstionTimeOut) {
        //     getCustomerQuoteId(dispatch, token, true)
        // }
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
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
    }
}