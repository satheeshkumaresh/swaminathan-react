import {
    TOKEN, LOADER, MAINTENANCE, GETHOMEPAGEDATA,
    PAGELOADER, USERDATA, ISLOGGEDUSER, ACTIONMESSAGE,
    PRODUCTDATA, PRODUCTLISTDATA, FILTERDATA, PRICEFILTER,
    QUICKVIEW, QUICKVIEWDATA, CARTCOUNT, MINICARTDATA, GUESTCARTTOKEN,
    UPDATECART, MYACCOUNTCURRENTPAGE, ISLOADING, SCROLLTOTOP, NOTIFYMEPOPUP,
    PAGEMESSAGE, PLPFILTERPARAMS, UPDATEFILTER, WISHLISTDATA, UPDATEWISHLIST,
    COUNTRYLIST, ISCOUNTRYSELECTED, COUNTRYCODE, STATESLIST, WPAGESIZE, WCURRENTPAGE,
    GUESTSHIPPING, GUESTVALIDSHIPPING, GUESTBILLING, SHIPPINGMETHODDETAILS, LOGGEDINUSERDATA,
    UPDATEACCOUTUSERDATA, CREATECARTID, CURRENCY, ESTIMATESHIPPINGMETHOD, ISGUESTCARTDATA,
    WISHLISTPRODUCTID, SHOWAUTHENTICATIONPOPUP, SEARCHFILTERPARAMS, GROUPEDFROMWISHLISTTOCART,
    RECENTSEARCH, PREVIOUSURL, GUESTSAMEASSHIPPINGBILLING, GUESTSAVEDBILLINGADDRESS, SEARCHEDTEXT,
    ISSEARCHRESULT, CARTDATA_ADDRESS, CUSTOMERSAMEASSHIPPING, HOMEAPILOADER, SELECTED_PAYMENTMETHOD,
    IS_ORDER_COMPLETE,MINIQUOTEDATA, UPDATEQUOTE
} from "./action-type";

const initailState = {
    token: "",
    loader: {
        show_loader: false,
        data: ""
    },
    isMaintenance: false,
    homepage: [],
    pageloader: false,
    isloggeduser: false,
    userdata: {},
    actionmessage: {
        isSuccess: false,
        title: "",
        message: "",
        showPopup: false
    },
    productData: [],
    productListData: [],
    filteredData: {
        updateFilter: false,
        category: "",
        selectedPrice: {
            min_price: null,
            max_price: null
        },
        priceValues: {
            min_price: null,
            max_price: null
        },
        size: "",
        pagination: 0
    },
    priceFilteredData: [],
    quickView: false,
    quickViewData: {},
    cartCount: 0,
    miniQuotecartDetails:{},
    quoteCount:0,
    miniCartDetails: {},
    guestCartToken: "",
    updateCart: false,
    updateQuote: false,
    accountCurrentPage: "",
    isLoading: false,
    scrollToTopCustom: false,
    notifymePopup: {
        show: false,
        id: "",
        token: ""
    },
    pageMessages: {
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    },
    plpFilterParams: {
        url_key: "",
        min_price: "",
        max_price: "",
        sort_order: "",
        page: 0,
        size: 0,
        show_page: 15,
        filterable_category_id: "",
        tag_filter: ""
    },
    searchfilterparams: {
        keyword: "",
        min_price: "",
        max_price: "",
        sort_order: "",
        page: 0,
        size: 0,
        show_page: 15,
        filterable_category_id: "",
        tag_filter: ""
    },
    updatefilter: false,
    updateWishlist: false,
    wishlistData: {},
    countries: [],
    states: [],
    isCountrySelected: false,
    countryCode: "",
    wPageSize: 15,
    wCurrentPage: 1,
    guestShippingAddress: {},
    guestIsValidShipping: false,
    guestBillingAddress: {},
    shippingMethodDetails: [],
    loggedInUserData: {},
    updateUserData: false,
    createCartId: null,
    currency: "",
    localEstimateShippingData: {
        country_id: "IN",
        display_country: "",
        customer_id: "",
        region: "",
        region_id: "",
        postcode: "",
        shipping_method: []
    },
    isGuestCartData: false,
    wilistProductId: "",
    wishListItemIdGrouped: {
        id: "",
        sku: ""
    },
    showAuthencationPopup: {
        loginReg: false,
        forgotPas: false,
        resetPass: false
    },
    recentSearchData: [],
    previousUrl: [],
    guestSameAsShipping: false,
    guestSavedBillingAddress: {},
    searchedText: "",
    isSearchResult: false,
    cartDataAddress: {
        address: {
            countryId: "",
            display_country: "",
            postcode: "",
            region: "",
            region_id: ""
        },
        shippingMethod: {}
    },
    customerSameAsShipping: false,
    homeApiLoader: true,
    selectedPaymentMethod: "",
    isOrderComplete: {
        orderId: "",
        isCancel: false
    }
}

const reducer = (state = initailState, action) => {
    switch (action?.type) {
        case TOKEN: return {
            ...state,
            token: action?.payload
        }
        case LOADER: return {
            ...state,
            loader: {
                show_loader: action?.payload,
                data: action?.data
            }
        }
        case PAGELOADER: return {
            ...state,
            pageloader: action?.payload
        }
        case MAINTENANCE: return {
            ...state,
            isMaintenance: true
        }
        case QUICKVIEW: return {
            ...state,
            quickView: !state?.quickView
        }
        case QUICKVIEWDATA: return {
            ...state,
            quickViewData: action?.payload
        }
        case ACTIONMESSAGE: return {
            ...state,
            actionmessage: action?.payload
        }
        case GETHOMEPAGEDATA: return {
            ...state,
            homepage: action?.payload
        }
        case USERDATA: return {
            ...state,
            userdata: action?.payload
        }
        case ISLOGGEDUSER: return {
            ...state,
            isloggeduser: action?.payload
        }
        case PRODUCTDATA: return {
            ...state,
            productData: action?.payload
        }
        case PRODUCTLISTDATA: return {
            ...state,
            productListData: action?.payload
        }
        case FILTERDATA: return {
            ...state,
            filteredData: action?.payload
        }
        case PRICEFILTER: return {
            ...state,
            priceFilteredData: action?.payload
        }
        case CARTCOUNT: return {
            ...state,
            cartCount: action?.payload
        }
        case MINICARTDATA: return {
            ...state,
            miniCartDetails: action?.payload
        }
        case MINIQUOTEDATA: return {
            ...state,
            miniQuotecartDetails: action?.payload
        }
        case GUESTCARTTOKEN: return {
            ...state,
            guestCartToken: action?.payload
        }
        case UPDATECART: return {
            ...state,
            updateCart: !state?.updateCart
        }
        case UPDATEQUOTE: return {
            ...state,
            updateCart: !state?.updateCart
        }
        case MYACCOUNTCURRENTPAGE: return {
            ...state,
            accountCurrentPage: action?.payload
        }
        case ISLOADING: return {
            ...state,
            isLoading: action?.payload
        }
        case SCROLLTOTOP: return {
            ...state,
            scrollToTopCustom: !state?.scrollToTopCustom
        }
        case NOTIFYMEPOPUP: return {
            ...state,
            notifymePopup: action?.payload
        }
        case PAGEMESSAGE: return {
            ...state,
            pageMessages: action?.payload
        }
        case PLPFILTERPARAMS: return {
            ...state,
            plpFilterParams: action?.payload
        }
        case SEARCHFILTERPARAMS: return {
            ...state,
            searchfilterparams: action?.payload
        }
        case UPDATEFILTER: return {
            ...state,
            updatefilter: !state?.updatefilter
        }
        case WISHLISTDATA: return {
            ...state,
            wishlistData: action?.payload
        }
        case UPDATEWISHLIST: return {
            ...state,
            updateWishlist: action?.payload
        }
        case COUNTRYLIST: return {
            ...state,
            countries: action?.payload
        }
        case ISCOUNTRYSELECTED: return {
            ...state,
            isCountrySelected: !state?.isCountrySelected
        }
        case STATESLIST: return {
            ...state,
            states: action?.payload
        }
        case COUNTRYCODE: return {
            ...state,
            countryCode: action?.payload
        }
        case WPAGESIZE: return {
            ...state,
            wPageSize: action?.payload
        }
        case WCURRENTPAGE: return {
            ...state,
            wCurrentPage: action?.payload
        }
        case GUESTSHIPPING: return {
            ...state,
            guestShippingAddress: action?.payload
        }
        case GUESTVALIDSHIPPING: return {
            ...state,
            guestIsValidShipping: true
        }
        case GUESTBILLING: return {
            ...state,
            guestBillingAddress: action?.payload
        }
        case SHIPPINGMETHODDETAILS: return {
            ...state,
            shippingMethodDetails: action?.payload
        }
        case LOGGEDINUSERDATA: return {
            ...state,
            loggedInUserData: action?.payload
        }
        case UPDATEACCOUTUSERDATA: return {
            ...state,
            updateUserData: !state?.updateUserData
        }
        case CREATECARTID: return {
            ...state,
            createCartId: action?.payload
        }
        case CURRENCY: return {
            ...state,
            currency: action?.payload
        }
        case ESTIMATESHIPPINGMETHOD: return {
            ...state,
            localEstimateShippingData: action?.payload
        }
        case ISGUESTCARTDATA: return {
            ...state,
            isGuestCartData: action?.payload
        }
        case WISHLISTPRODUCTID: return {
            ...state,
            wilistProductId: action?.payload
        }
        case SHOWAUTHENTICATIONPOPUP: return {
            ...state,
            showAuthencationPopup: action?.payload
        }
        case GROUPEDFROMWISHLISTTOCART: return {
            ...state,
            wishListItemIdGrouped: action?.payload
        }
        case RECENTSEARCH: return {
            ...state,
            recentSearchData: action?.payload
        }
        case PREVIOUSURL: return {
            ...state,
            previousUrl: action?.payload
        }
        case GUESTSAMEASSHIPPINGBILLING: return {
            ...state,
            guestSameAsShipping: action?.payload
        }
        case GUESTSAVEDBILLINGADDRESS: return {
            ...state,
            guestSavedBillingAddress: action?.payload
        }
        case SEARCHEDTEXT: return {
            ...state,
            searchedText: action?.payload
        }
        case ISSEARCHRESULT: return {
            ...state,
            isSearchResult: action?.payload
        }
        case CARTDATA_ADDRESS: return {
            ...state,
            cartDataAddress: action?.payload
        }
        case CUSTOMERSAMEASSHIPPING: return {
            ...state,
            customerSameAsShipping: action?.payload
        }
        case HOMEAPILOADER: return {
            ...state,
            homeApiLoader: action?.payload
        }
        case SELECTED_PAYMENTMETHOD: return {
            ...state,
            selectedPaymentMethod: action?.payload
        }
        case IS_ORDER_COMPLETE: return {
            ...state,
            isOrderComplete: action?.payload
        }
        default: return state;
    }
}

export default reducer;