import axios from "axios";
// Store data
import {
    TOKEN, LOADER, MAINTENANCE, GETHOMEPAGEDATA, PAGELOADER,
    USERDATA, ISLOGGEDUSER, ACTIONMESSAGE, PRODUCTDATA,
    PRODUCTLISTDATA, FILTERDATA, PRICEFILTER, QUICKVIEW, QUICKVIEWDATA,
    CARTCOUNT, MINICARTDATA, GUESTCARTTOKEN, UPDATECART, MYACCOUNTCURRENTPAGE,
    ISLOADING, SCROLLTOTOP, NOTIFYMEPOPUP, PAGEMESSAGE, PLPFILTERPARAMS,
    UPDATEFILTER, WISHLISTDATA, UPDATEWISHLIST, COUNTRYLIST, ISCOUNTRYSELECTED, STATESLIST,
    COUNTRYCODE, WPAGESIZE, WCURRENTPAGE, GUESTSHIPPING, GUESTVALIDSHIPPING, GUESTBILLING,
    SHIPPINGMETHODDETAILS, LOGGEDINUSERDATA, UPDATEACCOUTUSERDATA, CREATECARTID, CURRENCY,
    ESTIMATESHIPPINGMETHOD, ISGUESTCARTDATA, WISHLISTPRODUCTID, SHOWAUTHENTICATIONPOPUP,
    SEARCHFILTERPARAMS, GROUPEDFROMWISHLISTTOCART, RECENTSEARCH, PREVIOUSURL, GUESTSAMEASSHIPPINGBILLING,
    GUESTSAVEDBILLINGADDRESS, SEARCHEDTEXT, ISSEARCHRESULT, CARTDATA_ADDRESS, CUSTOMERSAMEASSHIPPING,
    HOMEAPILOADER, SELECTED_PAYMENTMETHOD, IS_ORDER_COMPLETE, UPDATEQUOTE,MINIQUOTEDATA
} from "./action-type";
// API LINKS
import {
    homePage, baseUrl, customer
} from "../Utilities/Constant";

export const ACTION_TOKEN = (token) => {
    return {
        type: TOKEN,
        payload: token
    }
}
export const ACTION_LOADER = (bool, data) => {
    return {
        type: LOADER,
        payload: bool,
        data: data
    }
}
export const ACTION_ACTIONMESSAGE = (data) => {
    return {
        type: ACTIONMESSAGE,
        payload: data,
    }
}
export const ACTION_PAGELOADER = (bool) => {
    return {
        type: PAGELOADER,
        payload: bool,
    }
}
export const ACTION_GET_HOMEPAGEDATA = (data) => {
    return {
        type: GETHOMEPAGEDATA,
        payload: data
    }
}
export const ACTION_MAINTENANCE = () => {
    return {
        type: MAINTENANCE
    }
}
export const ACTION_ISLOGGEDUSER = (bool) => {
    return {
        type: ISLOGGEDUSER,
        payload: bool,
    }
}
export const ACTION_QUICKVIEW = (bool) => {
    return {
        type: QUICKVIEW,
        payload: bool
    }
}
export const ACTION_QUICKVIEWDATA = (data) => {
    return {
        type: QUICKVIEWDATA,
        payload: data
    }
}
export const ACTION_USERDATA = (data) => {
    return {
        type: USERDATA,
        payload: data
    }
}
export const ACTION_GET_PRODUCTDATA = (data) => {
    return {
        type: PRODUCTDATA,
        payload: data
    }
}
export const ACTION_GET_PRODUCLISTTDATA = (data) => {
    return {
        type: PRODUCTLISTDATA,
        payload: data
    }
}
export const ACTION_FILTERDATA = (data) => {
    return {
        type: FILTERDATA,
        payload: data
    }
}
export const ACTION_PRICEFILTER = (data) => {
    return {
        type: PRICEFILTER,
        payload: data
    }
}
export const ACTION_CARTCOUNT = (count) => {
    return {
        type: CARTCOUNT,
        payload: count
    }
}
export const ACTION_GET_MINICARTDATA = (data) => {
    return {
        type: MINICARTDATA,
        payload: data
    }
}
export const ACTION_GET_MINIQUOTEDATA = (data) => {
    return {
        type: MINIQUOTEDATA,
        payload: data
    }
}
export const ACTION_GUESTCARTTOKEN = (data) => {
    return {
        type: GUESTCARTTOKEN,
        payload: data
    }
}
export const ACTION_UPDATECART = (bool) => {
    return {
        type: UPDATECART,
        payload: bool
    }
}
export const ACTION_UPDATEQUOTE = (bool) => {
    return {
        type: UPDATEQUOTE,
        payload: bool
    }
}

export const ACTION_ISLOADING = (bool) => {
    return {
        type: ISLOADING,
        payload: bool
    }
}
export const ACTION_SCROLLTOTOP = (bool) => {
    return {
        type: SCROLLTOTOP,
        payload: bool,
    }
}
export const ACTION_NOTIFYMEPOPUP = (data) => {
    return {
        type: NOTIFYMEPOPUP,
        payload: data
    }
}
export const ACTION_PAGEMESSAGE = (data) => {
    return {
        type: PAGEMESSAGE,
        payload: data
    }
}
export const ACTION_PLPFILTERPARAMS = (data) => {
    return {
        type: PLPFILTERPARAMS,
        payload: data
    }
}
export const ACTION_SEARCHFILTERPARAMS = (data) => {
    return {
        type: SEARCHFILTERPARAMS,
        payload: data
    }
}
export const ACTION_UPDATEFILTER = (data) => {
    return {
        type: UPDATEFILTER,
        payload: data
    }
}
export const ACTION_GET_WISHLISTDATA = (data) => {
    return {
        type: WISHLISTDATA,
        payload: data
    }
}
export const ACTION_UPDATEWISHLIST = (bool) => {
    return {
        type: UPDATEWISHLIST,
        payload: bool
    }
}
export const ACTION_COUNTRYLIST = (data) => {
    return {
        type: COUNTRYLIST,
        payload: data
    }
}
export const ACTION_STATESLIST = (data) => {
    return {
        type: STATESLIST,
        payload: data
    }
}
export const ACTION_ISCOUNTRYSELECTED = (bool) => {
    return {
        type: ISCOUNTRYSELECTED,
        payload: bool
    }
}
export const ACTION_COUNTRYCODE = (data) => {
    return {
        type: COUNTRYCODE,
        payload: data
    }
}
export const ACTION_WPAGESIZE = (data) => {
    return {
        type: WPAGESIZE,
        payload: data
    }
}
export const ACTION_WCURRENTPAGE = (data) => {
    return {
        type: WCURRENTPAGE,
        payload: data
    }
}
export const ACTION_GUESTSHIPPING = (data) => {
    return {
        type: GUESTSHIPPING,
        payload: data
    }
}
export const ACTION_GUESTVALIDSHIPPING = (bool) => {
    return {
        type: GUESTVALIDSHIPPING,
        payload: bool
    }
}
export const ACTION_GUESTBILLING = (data) => {
    return {
        type: GUESTBILLING,
        payload: data
    }
}
export const ACTION_SHIPPINGMETHODDETAILS = (data) => {
    return {
        type: SHIPPINGMETHODDETAILS,
        payload: data
    }
}
export const ACTION_LOGGEDINUSERDATA = (data) => {
    return {
        type: LOGGEDINUSERDATA,
        payload: data
    }
}
export const ACTION_UPDATEACCOUTUSERDATA = (bool) => {
    return {
        type: UPDATEACCOUTUSERDATA,
        payload: bool
    }
}
export const ACTION_CREATECARTID = (data) => {
    return {
        type: CREATECARTID,
        payload: data
    }
}
export const ACTION_CURRENCY = (data) => {
    return {
        type: CURRENCY,
        payload: data
    }
}
export const ACTION_ESTIMATESHIPPINGMETHOD = (data) => {
    return {
        type: ESTIMATESHIPPINGMETHOD,
        payload: data
    }
}
export const ACTION_ISGUESTCARTDATA = (data) => {
    return {
        type: ISGUESTCARTDATA,
        payload: data
    }
}
export const ACTION_WISHLISTPRODUCTID = (data) => {
    return {
        type: WISHLISTPRODUCTID,
        payload: data
    }
}
export const ACTION_SHOWAUTHENTICATIONPOPUP = (data) => {
    return {
        type: SHOWAUTHENTICATIONPOPUP,
        payload: data
    }
}
export const ACTION_GROUPEDFROMWISHLISTTOCART = (data) => {
    return {
        type: GROUPEDFROMWISHLISTTOCART,
        payload: data
    }
}
export const ACTION_RECENTSEARCH = (data) => {
    return {
        type: RECENTSEARCH,
        payload: data
    }
}
export const ACTION_PREVIOUSURL = (data) => {
    return {
        type: PREVIOUSURL,
        payload: data
    }
}
export const ACTION_GUESTSAMEASSHIPPINGBILLING = (data) => {
    return {
        type: GUESTSAMEASSHIPPINGBILLING,
        payload: data
    }
}
export const ACTION_CUSTOMERSAMEASSHIPPING = (data) => {
    return {
        type: CUSTOMERSAMEASSHIPPING,
        payload: data
    }
}
export const ACTION_GUESTSAVEDBILLINGADDRESS = (data) => {
    return {
        type: GUESTSAVEDBILLINGADDRESS,
        payload: data
    }
}
export const ACTION_SEARCHEDTEXT = (data) => {
    return {
        type: SEARCHEDTEXT,
        payload: data
    }
}
export const ACTION_ISSEARCHRESULT = (data) => {
    return {
        type: ISSEARCHRESULT,
        payload: data
    }
}
export const ACTION_CARTDATA_ADDRESS = (data) => {
    return {
        type: CARTDATA_ADDRESS,
        payload: data
    }
}
export const ACTION_HOMEAPILOADER = (data) => {
    return {
        type: HOMEAPILOADER,
        payload: data
    }
}
export const ACTION_SELECTED_PAYMENTMETHOD = (data) => {
    return {
        type: SELECTED_PAYMENTMETHOD,
        payload: data
    }
}
export const ACTION_IS_ORDER_COMPLETE = (data) => {
    return {
        type: IS_ORDER_COMPLETE,
        payload: data
    }
}

// Finaly call
export const finalCall = (dispatch) => {
    dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: false,
        isError: false,
        title: "",
        message: "",
        showPopup: false,
        redirect: ""
    }))
}

// SessionExpiredLogout
export const SessionExpiredLogout = (dispatch) => {
    dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: true,
        isError: false,
        isWarning: false,
        title: "Logout",
        message: "Due to Session expiry, Logging out.",
        showPopup: true,
        redirect: "/",
        refreshPage: false,
        isSesstionTimeOut: true
    }))
    setTimeout(() => {
        window.location.assign("/");
        localStorage.clear();
    }, 5000);
};

export const Action_Logout = (dispatch, navigate) => {
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
        navigate("/logout");
        setTimeout(() => {
            localStorage.clear();
            window.location.reload();
        }, 100)
    }
    dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: true,
        isError: false,
        title: "Logout",
        message: "Are you sure want to logout?",
        showPopup: true,
        action: signOut,
        close: () => dispatch(ACTION_ACTIONMESSAGE({ showPopup: false }))
    }))
}

// getAccountInfo
export const getAccountInfo = async (token, dispatch, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}myaccount`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_LOGGEDINUSERDATA(Response?.data[0]?.data?.[0]))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false))
    }
}

// NEW DESIGN FORMAT

// 1. GET HEADER & FOOTER
export const getHeaderFooter = async (dispatch, setGetHeaderFooterData, setHeaderLoader) => {
    setHeaderLoader(true)
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}getheaderfooter`
        });
        setHeaderLoader(false)
        setGetHeaderFooterData(Response?.data?.[0])
        dispatch(ACTION_CURRENCY(Response?.data?.[0]?.currency))
    } catch (err) {
        console.log("Error", err)
        setHeaderLoader(false)
    }
}

// Home page API
export const homePageAPI = async (dispatch, setHomeLoader) => {
    setHomeLoader(true)
    dispatch(ACTION_HOMEAPILOADER(true))
    try {
        const Response = await axios({
            method: "get",
            url: homePage()
        });
        setHomeLoader(false)
        dispatch(ACTION_HOMEAPILOADER(false))
        if (Response?.status === 200) {
            dispatch(ACTION_GET_HOMEPAGEDATA(Response?.data))
        }
    } catch (err) {
        console.log("Error", err)
        setHomeLoader(false)
        dispatch(ACTION_HOMEAPILOADER(false))
    }
}
// Guest News Letter
export const searchSuggestion = async (dispatch, keyword, setSuggestionsData, setShowSuggestion) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const data = {
            data: {
                keyword: keyword,
                category_id: "",
                page_size: ""
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}searchSuggestion`,
            data
        });
        dispatch(ACTION_PAGELOADER(false));
        setSuggestionsData(Response?.data[0]);
        if (Response?.data[0]?.data?.products?.length) {
            setShowSuggestion(true)
        } else {
            setShowSuggestion(false)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// notify_Me API
export const notify_Me = async (token, dispatch, data, pageName, isSesstionTimeOut) => {
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
            data,
            url: `${baseUrl()}swaminathan/productalertstockadd`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
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
    }
}
// homenotify_Me API
export const homeNotify_Me = async (token, dispatch, data, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "post",
            data,
            url: `${baseUrl()}swaminathan/productalertstockadd`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isWarning: false,
                isError: false,
                title: "Notify product",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
        } else {
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Notify product",
                message: Response?.data[0]?.message,
                showPopup: true
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

// Cart API

// Customer get
export const getCutomerCartItems = async (token, dispatch, setCartItemLoader, isSesstionTimeOut) => {
    dispatch(ACTION_ISLOADING(true))
    setCartItemLoader(true);
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}cartlist`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_ISLOADING(false))
        setCartItemLoader(false);
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_MINICARTDATA(Response?.data?.[0]))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
        setCartItemLoader(false);
    }
}
// Customer add
export const addCutomerCartItems = async (token, dispatch, sku, qty, setShowRotate, pageName, isSesstionTimeOut) => {
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
            dispatch(ACTION_UPDATECART())
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: true,
                    isWarning: false,
                    isError: false,
                    title: "Cart",
                    message: Response?.data[0]?.message,
                    showPopup: true
                }))
            } else {
                dispatch(ACTION_PAGEMESSAGE({
                    show: true,
                    isSuccess: true,
                    isError: false,
                    isWarning: false,
                    message: Response?.data[0]?.message,
                    showFor: pageName
                }))
            }
        } else {
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: true,
                    title: "Cart",
                    message: Response?.data[0]?.message,
                    showPopup: true
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
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// customer create quote id
export const getCustomerQuoteId = async (dispatch, token, updateCart) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        dispatch(ACTION_CREATECARTID(Response?.data));
        if (updateCart) {
            dispatch(ACTION_UPDATECART())

        }
    } catch (err) {
        if (err?.response?.status == 401) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// customer merge cart
export const customerMergeCart = async (token, dispatch, guestToken, customerId, isSesstionTimeOut) => {
    if (guestToken && customerId) {
        try {
            const data = {
                param: {
                    guestCartId: guestToken,
                    customerId: customerId
                }
            }
            const Response = await axios({
                method: "post",
                url: `${customer()}merge-carts`,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (Response?.data[0]?.code === 200) {
                dispatch(ACTION_UPDATECART())
                dispatch(ACTION_ISGUESTCARTDATA(false))
                dispatch(ACTION_GUESTCARTTOKEN(""))
            }
        } catch (err) {
            if (err?.response?.status == 401 && !isSesstionTimeOut) {
                SessionExpiredLogout(dispatch)
            }
            console.log("Error", err)
        }
    }
}

// Guest cart
// getToken
export const getGuestCartToken = async (dispatch, updateCart) => {
    try {
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}guest-carts`
        });
        if (Response?.data) {
            dispatch(ACTION_GUESTCARTTOKEN(Response?.data))
            if (updateCart) {
                dispatch(ACTION_UPDATECART())
            }
        }
    } catch (err) {
        console.log("Error", err)
    }
}
// / Guest Quote
// getToken
export const getGuestQuoteToken = async (dispatch, updateCart) => {
    try {
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}guest-carts`
        });
        if (Response?.data) {
            dispatch(ACTION_GUESTCARTTOKEN(Response?.data))
            if (updateCart) {
                dispatch(ACTION_UPDATEQUOTE())
                dispatch(ACTION_UPDATECART())
            }
        }
    } catch (err) {
        console.log("Error", err)
    }
}
// getGuestCart
export const getGuestCart = async (dispatch, guestCartToken, setCartItemLoader) => {
    dispatch(ACTION_ISLOADING(true))
    setCartItemLoader(true)
  
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}guest-carts/${guestCartToken}`
        });
        dispatch(ACTION_ISLOADING(false))
        setCartItemLoader(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_MINICARTDATA(Response?.data?.[0]))
            if (Response?.data?.[0]?.data) {
                dispatch(ACTION_ISGUESTCARTDATA(true))
            } else {
                dispatch(ACTION_ISGUESTCARTDATA(false))
            }
        } else if (Response?.data[0]?.code === 400) {
            dispatch(ACTION_GET_MINICARTDATA([]))
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_ISLOADING(false))
        setCartItemLoader(false)
    }
}
// addGuestCart
export const addGuestCart = async (dispatch, guestCartToken, sku, qty, setShowRotate, pageName) => {

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
        console.log("cart response",Response);
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: true,
                    isWarning: false,
                    isError: false,
                    title: "Cart",
                    message: Response?.data[0]?.message,
                    showPopup: true
                }))
            } else {
                dispatch(ACTION_PAGEMESSAGE({
                    show: true,
                    isSuccess: true,
                    isError: false,
                    isWarning: false,
                    message: Response?.data[0]?.message,
                    showFor: pageName
                }))
            }
        } else {
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: true,
                    title: "Cart",
                    message: Response?.data[0]?.message,
                    showPopup: true
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
        }
    } catch (err) {
        console.log("Error", err)
        setShowRotate(false)
    }
}
// getGuestQuote
export const getGuestQuote = async (dispatch, guestCartToken, setCartItemLoader) => {
    dispatch(ACTION_ISLOADING(true))
    setCartItemLoader(false)
 var persiststore=JSON.parse(localStorage.getItem("persist:root"));
 var guesttoken=JSON.parse(persiststore.guestCartToken);
 console.log("guesttoken",guesttoken);
    // debugger;
    console.log("guest",JSON.parse(localStorage.getItem("persist:root")));
    try {
        const Response = await axios({
            method: "get",
            url: `${customer()}quatation/getAll/${guesttoken}`
        });
        dispatch(ACTION_ISLOADING(false))
        setCartItemLoader(false)
        console.log("resposne",Response);
        if (Response?.data[0]?.code === 200) {
            console.log("resposne",Response);
            dispatch(ACTION_GET_MINIQUOTEDATA(Response?.data))
            if (Response?.data) {
                // dispatch(ACTION_ISGUESTCARTDATA(true))
            } else {
                // dispatch(ACTION_ISGUESTCARTDATA(false))
            }
        } else if (Response?.data[0]?.code === 400) {
            // dispatch(ACTION_GET_MINICARTDATA([]))
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_ISLOADING(false))
        setCartItemLoader(false)
    }
}

// addguestQuote
export const addGuestQuote = async (dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, pageName) => {
    setQuoteShowRotate(true)
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
            customer_id: customer_id,
            quote_id: guestCartToken,
            productid: productId,
            productname: productName,
            sku: sku,
            qty: qty,
            price: price,
          },
        };
        console.log("Data",data);
        const Response = await axios({
            method: "post",
            url:`${customer()}quatation/add`,
            data
        });
        console.log("qute add resposne",Response);
        setQuoteShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEQUOTE())
            // dispatch(ACTION_UPDATECART())
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: true,
                    isWarning: false,
                    isError: false,
                    title: "Quote",
                    message: Response?.data[0]?.message,
                    showPopup: true
                }))
            } else {
                dispatch(ACTION_PAGEMESSAGE({
                    show: true,
                    isSuccess: true,
                    isError: false,
                    isWarning: false,
                    message: Response?.data[0]?.message,
                    showFor: pageName
                }))
            }
        } else {
            if (pageName == "home") {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: true,
                    title: "Quote",
                    message: Response?.data[0]?.message,
                    showPopup: true
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
        }
    } catch (err) {
        console.log("Error", err)
        setQuoteShowRotate(false)
    }
}




// add wishList api
export const addWishList = async (token, dispatch, id, popup, pageName, isSesstionTimeOut) => {
    dispatch(ACTION_PAGELOADER(true));
    if (!popup) {
        dispatch(ACTION_PAGEMESSAGE({
            show: false,
            isSuccess: false,
            isError: false,
            isWarning: false,
            message: "",
            showFor: ""
        }))
    }
    try {
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}wishlist/add/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATEWISHLIST(true))
            dispatch(ACTION_WISHLISTPRODUCTID(""))
            if (popup !== null) {
                if (popup) {
                    dispatch(ACTION_ACTIONMESSAGE({
                        isSuccess: true,
                        isWarning: false,
                        isError: false,
                        title: "Wishlist",
                        message: Response?.data[0]?.message,
                        showPopup: true,
                        redirect: ""
                    }))
                } else {
                    dispatch(ACTION_PAGEMESSAGE({
                        show: true,
                        isSuccess: true,
                        isError: false,
                        isWarning: false,
                        message: Response?.data[0]?.message,
                        showFor: pageName
                    }))
                }
            }
        } else {
            dispatch(ACTION_WISHLISTPRODUCTID(""))
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
// get wishList api
export const getWishList = async (token, dispatch, wPageSize, wCurrentPage, setWishlistLoader, isSesstionTimeOut) => {
    setWishlistLoader(true)
    dispatch(ACTION_SCROLLTOTOP())
    try {
        const data = {
            pageSize: wPageSize,
            currPage: wCurrentPage
        }
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}swaminathan/wishlist`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_SCROLLTOTOP())
        setWishlistLoader(false);
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_WISHLISTDATA(Response?.data[0]))
            dispatch(ACTION_UPDATEWISHLIST(false))
        } else if (Response?.data[0]?.code === 400) {
            dispatch(ACTION_GET_WISHLISTDATA([]))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        setWishlistLoader(false);
        console.log("Error", err)
    }
}

// State & Countries
// Country
export const getCountry = async (dispatch, setCountry) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "get",
            url: `${baseUrl()}swaminathan/country`
        });
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_COUNTRYLIST(Response?.data[0]?.Country_code))
            setCountry(Response?.data[0]?.Country_code)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// State
export const getStates = async (dispatch, countryCode, setStates) => {
    try {
        const Response = await axios({
            method: "get",
            url: `${baseUrl()}swaminathan/state/${countryCode}`
        });
        if (Response?.data) {
            dispatch(ACTION_STATESLIST(Response?.data))
        }
    } catch (err) {
        console.log("Error", err)
    }
}

// isvalid transaction id
export const isValidTransactionNumber = async (dispatch, transaction_id, setIsTransactionError) => {
    try {
        const data = {
            transaction_id: transaction_id
        }
        const Response = await axios({
            method: "post",
            url: `${baseUrl()}swaminathan/check-transaction-id`,
            data
        });
        if (Response?.data?.[0]?.status === 400) {
            setIsTransactionError(true);
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data?.[0]?.message,
                showFor: ""
            }))
        } else {
            setIsTransactionError(false);
        }
    } catch (err) {
        console.log("Error", err)
        setIsTransactionError(true);
    }
}