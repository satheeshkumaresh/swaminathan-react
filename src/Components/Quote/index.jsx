import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Stack, Box,
  Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, Autocomplete
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./styles.scss";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CartDelete from "../../Assets/Cart/CartDelete.svg";
import CartDeleteHover from "../../Assets/Cart/CartDeleteHover.svg";
import LoopIcon from '@mui/icons-material/Loop';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FormControl from '@mui/material/FormControl';
import Table from "../Table";
import Model from "../Model";
import Pageloader from "../../Components/Loader/Pageloader";
import { Helmet } from "react-helmet-async";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import PhoneInput from 'react-phone-input-2';
import Eyepass from "../../Assets/Clienticons/swaminathan-icons-21.svg"
import EyeHide from "../../Assets/Clienticons/swaminathan-icons-20.svg"
// Store data
import { useSelector, useDispatch } from 'react-redux';
import {
  ACTION_ESTIMATESHIPPINGMETHOD,
  ACTION_CARTDATA_ADDRESS, ACTION_GUESTSHIPPING, ACTION_PAGEMESSAGE, ACTION_SHOWAUTHENTICATIONPOPUP
}
  from "../../Store/action";
import {
  cartSummary, guestCartSummary, GuestCartApplyCoupon,
  customerCartApplyCoupon, customerCartRemoveCoupon, guestCartRemoveCoupon,
  getGuestEstimateShipping, getEstimateShippingCart, deleteCutomerCartItems,
  deleteAllCartItems, updateCutomerCartItems, updateGuestCart,
  deleteGuestCart, deleteGuestAllCartItems, deleteGuestAllQuotetItems, deleteGuestQuote, updateGuestQuote, customerPlaceQuote
} from "./APIList";
import { isNumber, pressEnterCallFunction, isEmptyValue, formatCurrency, exceptThisSymbols, isValidCharacter, isValidEmail,isValidNumber } from '../../Utilities/Utilities';
import Tooltip from "../../Components/Tooltip"
import ClickAwayListener from '@mui/base/ClickAwayListener';
import CouponInvalid from '../../Assets/Checkout/CouponInvalid.svg';
import MarkIcon from '../../Assets/Checkout/markicon.svg';
import Samecategory from './Samecategory';
import EmptyCart from './Emptycart';
import QuoteForm from "./QuoteAddress"
import { isExitedEmail,Action_Checkout_Login,isExitedQuoteEmail, Action_Checkout_QuoteLogin } from '../Checkout/Guestcheckout/APIList';
import { customerPlaceOrder } from '../Checkout/Customercheckout/APIList';
// get window width & height
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const Index = () => {
  const [width, height] = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token, currency, miniCartDataItems, miniCartDetails, guestCartToken, pageMessages,
    countries, userdata, states, cartDataAddress,
    guestShippingAddress, actionmessage,miniQuotecartDetails,state,customerSameAsShipping,
    selectedPaymentMethod,myQuotecartDataempty,showAuthencationPopup
  } = useSelector(state => {
    return {
      token: state?.token,
      currency: state?.currency,
      miniCartDataItems: state?.miniCartDetails?.data,
      miniCartDetails: state?.miniCartDetails,
      guestCartToken: state?.guestCartToken,
      pageMessages: state?.pageMessages,
      countries: state?.countries,
      userdata: state?.loggedInUserData,
      states: state?.states,
      cartDataAddress: state?.cartDataAddress,
      guestShippingAddress: state?.guestShippingAddress,
      actionmessage: state?.actionmessage,
      miniQuotecartDetails:state?.miniQuotecartDetails[0]?.message?.map((item) => item.products) || [],
      myQuotecartDataempty:state?.miniQuotecartDetails,
      customerSameAsShipping: state?.customerSameAsShipping,
      state:state,
      selectedPaymentMethod: state?.selectedPaymentMethod,
      showAuthencationPopup: state?.showAuthencationPopup
     
    }
  })
// check for future use 
  console.log("quotestatre",state);
  console.log("isExist userdata",userdata);
  console.log("isExist  userdaat length ",userdata.length);
  console.log("emptyminiQuotecartDetails",miniQuotecartDetails);
  console.log("empty",myQuotecartDataempty);
  const [estimateShippingLoader, setEstimateShippingLoader] = useState(false);

  const [openMyAccount, setOpenMyaccount] = useState(false);

  const [isValidBillingAddress, setIsValidBillingAddress] = useState(false);
  const [isPlaceOrderClicked, setIsPlaceOrderClicked] = useState(false);
  const [isSelectedShippingMethod, setIsSelectedShippingMethod] = useState(false);
  const [isHavingPaymentMethod, setIsHavingPaymentMethod] = useState(false);
  const [isSelectedPaymentMethod, setIsSelectedPaymentMethod] = useState(false);
  const [updateShippingInformationById, setUpdateShippingInformationById] = useState(false);
  const [updateShippingMethod, setUpdateShippingMethod] = useState(false);
  const [allAddress, setAllAddress] = useState({});
  const focusStockStatus = useRef();
  const [isHavingOutofStock, setIsHavingOutofStock] = useState(false);
  const [focusOutofStock, setFocusOutofStock] = useState(false);
  const [updateFields, setUpdateFields] = useState(false);
  const [showMobileCount, setShowMobileCount] = useState(false);
  const [showlist, setShowlist] = useState(true);
  const [open, setOpen] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [quoteId, setQuoteId] = useState(null);
  const [openEstimateTax, setOpenEstimateTax] = useState(true);
  const [openApplyCoupon, setOpenApplyCoupon] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [rotateCoupon, setRotateCoupon] = useState(false);
  const [myCartData, setMycartData] = useState([]);
  const [myQuoteCartData, setQuoteMycartData] = useState([]);
  const [rotateSameId, setRotateSameId] = useState(null);
  const [couponData, setCouponData] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeError, setCouponCodeError] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isPostCodeChanged, setIsPostCodeChanged] = useState(false);
  const [quoteshowPassword, setquoteshowPassword] = useState(false)
  const [estimateShipping, setEstimateShipping] = useState({
    display_country: "",
    customer_id: "",
    address1: "",
    address2: "",
    city: "",
    region_id: null,
    region: "",
    regionValues: {
      label: "",
      value: ""
    },
    country_id: "",
    postcode: "",
    firstname: "",
    lastname: "",
    company: "",
    telephone: ""
  })

  const [getShippingBillingAddres, setGetShippingBillingAddres] = useState({});
  const [estimateShippingError, setEstimateShippingError] = useState({
    country_id: "",
    region: "",
    postcode: ""
  })
  const [cartSummaryData, setCartSummaryData] = useState({
    countryId: "",
    postcode: "",
    shipping_method: {},
    display_country: "",
    region_id: null,
    region: "",
  })
  // quote
  const [billingFormValues, setBillingFormValues] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    display_country: "",
    country: "",
    display_state: "",
    state: "",
    regionValues: {
      label: "",
      value: ""
    },
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
    DefaultShipping: "0",
    DefaultBilling: "1",
    saveInAddressBook: 0,
    customerAddressId: null,
    same_as_billing: "0"
  })

  const [formErrorBilling, setFormErrorBilling] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
  });

  const [formError, setFormError] = useState({
    username: "",
    password: ""
  });
  const [validatePassword, setValidatePassword] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "",
    password: ""
  });

  const [shippingFormError, setShippingFormError] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
    email: ""
  });

  const [createOrderInfo, setCreateOrderInfo] = useState({
    cartId: "",
    email: "",
    paymentMethod: {
      method: ""
    },
    billing_address: {
      region: "",
      region_id: "",
      region_code: "",
      country_id: "",
      street: [],
      postcode: "",
      city: "",
      firstname: "",
      lastname: "",
      email: "",
      telephone: ""
    }
  })

  const [guestShipping, setGuestShipping] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    country: "",
    display_country: "",
    display_state: "",
    state: "",
    regionValues: {
      label: "",
      value: ""
    },
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
    DefaultBilling: "0",
    DefaultShipping: "1",
    company: "",
    email: "",
    makeDefaultShipping: ""
  });
  const verifyEmail = () => {
    var isError = false;

    // Email
    if (!formValues?.username) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Required field."
      }))
      var isError = true;
      return isError 
    } else if (!isEmptyValue(formValues?.username)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Empty spaces are not allowed."
      }))
      var isError = true;
      return isError 

    } else if (!isValidEmail(formValues?.username)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Please enter valid email."
      }))
      var isError = true;
      return isError 

    }
    if (!isError) {
    
      if (validatePassword) {
        // Action_Checkout_Login(formValues, dispatch, setFormValues, setOpenMyaccount)
      } else {
        isExitedQuoteEmail(dispatch, formValues?.username, setFormValues, setFormError, setValidatePassword)
      }
      return isError;
    }
    else {
      return isError;
    
    }


  }
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  })

  const [loginFormDataError, setLoginFormDataError] = useState({
    username: "",
    password: ""
  })
  const loginHandler = () => {
    // var isQError = false;
    // // Password
    // if (!loginFormData?.password) {
    //   setLoginFormDataError((prevState) => ({
    //     ...prevState,
    //     password: "Required field."
    //   }))
    //   document.getElementById("password")?.focus();
    //   var isQError = true;
    // } else if (!isEmptyValue(loginFormData?.password)) {
    //   setLoginFormDataError((prevState) => ({
    //     ...prevState,
    //     password: "Empty spaces are not allowed."
    //   }))
    //   document.getElementById("password")?.focus();
    //   var isQError = true;
    // }
    // // Email
    // if (!loginFormData?.username) {
    //   setLoginFormDataError((prevState) => ({
    //     ...prevState,
    //     username: "Required field."
    //   }))
    //   document.getElementById("login_email")?.focus();
    //   var isQError = true;
    // } else if (!isEmptyValue(loginFormData?.username)) {
    //   setLoginFormDataError((prevState) => ({
    //     ...prevState,
    //     username: "Empty spaces are not allowed."
    //   }))
    //   document.getElementById("login_email")?.focus();
    //   var isQError = true;
    // } else if (!isValidEmail(loginFormData?.username)) {
    //   setLoginFormDataError((prevState) => ({
    //     ...prevState,
    //     username: "Please enter valid email."
    //   }))
    //   document.getElementById("login_email")?.focus();
    //   var isQError = true;
    // }
    // Final valiation
    // if (!isQError) {
      Action_Checkout_QuoteLogin(formValues, dispatch, setLoginFormDataError, setOpenMyaccount,setValidatePassword,showAuthencationPopup)
    // }
  }
  const addNewAddressHandlerShipping = (  setOpen, isEditShipping ) => {
    var isError = false;
    console.log("isExist",shippingFormValues);
    // first name
    if (shippingFormValues?.first_name == "") {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Required field."
      }))
      // document.getElementById("first_name")?.focus();
      var isError = true;
      console.log(shippingFormValues);
    } else if (!isEmptyValue(shippingFormValues?.first_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Empty spaces are not allowed."
      }))
      // document.getElementById("first_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(shippingFormValues?.first_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Name can only contain alphabets."
      }))
      // document.getElementById("first_name")?.focus();
      var isError = true;
    }
    // last name
    if (!shippingFormValues?.last_name) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Required field."
      }))
      // document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.last_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Empty spaces are not allowed."
      }))
      // document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(shippingFormValues?.last_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Name can only contain alphabets."
      }))
      // document.getElementById("last_name")?.focus();
      var isError = true;
    }


    // number
    if (!shippingFormValues?.number || !shippingFormValues?.mobile_valid ) { 
      setFormErrorShipping((prevState) => ({
        ...prevState,
        number: "Required field."
      }))
      // document.getElementById("number")?.focus();
      var isError = true; 
      return isError 
    }
    // future use
 const handlephoneChange = (e) => {
      console.log("440",e);
      let value = e;
      if (value.startsWith('+')) {
        // Split the string into two parts: the country code and the rest
        const parts = value.split(' ');
        if (parts.length > 1) {
          // Remove the space between the country code and the phone number
          value = parts[0] + parts.slice(1).join('');
        }
      }
      console.log("440 handle",value);
      console.log("440 handle",value.length);
  
      // return value
      // setPhoneNumber(value);
    };
    // Additional validation for phone number length
    let mobile = shippingFormValues?.mobile_valid;
if (
  mobile.length !== 10 
      && !(mobile.startsWith('+91') && mobile.length === 13) 
)
{
  console.log("4443",shippingFormValues?.mobile_valid.trim());
  setFormErrorShipping((prevState) => ({
      ...prevState,
      number: "Phone number must be 10 digits."
  }));
  // document.getElementById("number")?.focus();
  isError = true;
  return isError;
}
      return isError ;

    // Final valiation
   
  }


 
 

  // 

  const placeOrderHandler = () => {
    console.log("Shipping Form Values error:", shippingFormValues);

    var isError = false;

    if (isError == false) {
            console.log("Error: Billing address is not valid");
            setIsPlaceOrderClicked(false);
       var customvalidation =     addNewAddressHandlerShipping();
        var customverifymail = Object.keys(userdata).length?false:    verifyEmail();
        console.log("value console :" ,customvalidation , customverifymail  );
    }
    console.log("myQuoteCartDataaa",myQuoteCartData);
    var myqtyerr=myQuoteCartData?.map((item,index)=>item?.quatation_qty <= 9);
    console.log("myQuoteCartData",myqtyerr);

    if(myqtyerr.includes(true)){
      var myqtyerr=true;
      dispatch(ACTION_PAGEMESSAGE({
        show: true,
        isSuccess: false,
        isError: true,
        isWarning: false,
        message: `The quote option requires a minimum order of 10 units`,
        showFor: "myquote"
      }))
return;
    }


  
      if(customvalidation == false && customverifymail == false  ){
        customerPlaceQuote(guestCartToken, dispatch, estimateShipping, shippingFormValues,navigate,myQuoteCartData,setEstimateShippingData, cartId, setEstimateShippingLoader)
      }else{
        console.log("form submitted false");
      
      }
    

 
};

 // customerPlaceQuote(guestCartToken, dispatch, estimateShipping, shippingFormValues,navigate,myQuoteCartData,setEstimateShippingData, cartId, setEstimateShippingLoader)
 

  const [isShippingAddressChnaged, setIsShippingAddressChnaged] = useState(false);
  const [isValidShippingAddress, setIsValidShippingAddress] = useState(false);

  const [shippingFormValues, setShippingFormValues] = useState({
    first_name: "",
    last_name: "",
      number: "",
    mobile_valid: "",
 email:"",
 message:"",
  });


  const [formErrorShipping, setFormErrorShipping] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
  });


  // shipping information
  const [shippingInformtionData, setShippingInformtionData] = useState({
    shipping_address: {
      customerAddressId: null,
      countryId: "",
      regionId: null,
      regionCode: "",
      region: "",
      street: [],
      company: "",
      telephone: "",
      postcode: "",
      city: "",
      firstname: "",
      lastname: "",
      save_in_address_book: 1,
      same_as_billing: "0"
    },
    billing_address: {
      customerAddressId: null,
      countryId: "",
      regionId: null,
      regionCode: "",
      region: "",
      street: [],
      company: "",
      telephone: "",
      postcode: "",
      city: "",
      firstname: "",
      lastname: "",
      saveInAddressBook: null
    },
    address_from: null,
    shipping_method_code: "",
    shipping_carrier_code: "",
    extension_attributes: {}
  });



  // quote

// quote email

  const [updateTotalInfo, setUpdateTotalInfo] = useState(false)
  const [cartSummaryDetails, setCartSummaryDetails] = useState({})
  const [estimateShippingData, setEstimateShippingData] = useState([])
  const [shippingMedthos, setShippingMedthos] = useState({})
  // let prevQty = myQuoteCartData?.map((item, ind) => {
  //   // if (id === ind) {
  //     console.log("hap item",item.quatation_qty);
  //     return {

  //       qty: item.quatation_qty
  //     };

  // });

  const updateCart = (item) => {

console.log("incre item",item);

    const data = {
      data: {
        sku:item[0]?.sku,
        qty:item[0]?.quatation_qty

        // sku: item?.[4],
        // qty: item?.[7]
      }
    }


if(data.data.qty<10){

dispatch(ACTION_PAGEMESSAGE({
  show: true,
  isSuccess: false,
  isError: true,
  isWarning: false,
  message: `The quote option requires a minimum order of 10 units`,
  showFor: "myquote"
}))
}else{

  if (!isClickedDelete && !open) {

    if (token) {
      updateGuestQuote(dispatch, guestCartToken, item[0]?.entity_id, data, setRotate, setRotateSameId, 'quote')
      // updateCutomerCartItems(token, dispatch, item?.[8], data, setRotate, setRotateSameId, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
      updateGuestQuote(dispatch, guestCartToken, item[0]?.entity_id, data, setRotate, setRotateSameId, 'quote')
      // updateGuestCart(dispatch, guestCartToken, item?.[8], data, setRotate, setRotateSameId, 'cart')
    }
  }
}



  }

  const deleteCart = () => {
    setIsClickedDelete(true)
    if (token) {
      deleteGuestQuote(guestCartToken, dispatch, deleteItemId, setOpen,setCartItemLoader, 'quote')
      // deleteGuestQuote(guestCartToken, dispatch, deleteItemId, setOpen, 'quote')
      // deleteCutomerCartItems(token, dispatch, deleteItemId, setOpen, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
    deleteGuestQuote(guestCartToken, dispatch, deleteItemId, setOpen,setCartItemLoader, 'quote')
      // deleteGuestCart(guestCartToken, dispatch, deleteItemId, setOpen, 'quote')
    }
  }

  const deleteAllItems = () => {
    setIsClickedDelete(true)
    if (token) {
      deleteGuestAllQuotetItems(guestCartToken, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'quote')
      // deleteAllCartItems(token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
      deleteGuestAllQuotetItems(guestCartToken, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'quote')
    }
  }

  const applyCoupon = () => {
    if (token) {
      customerCartApplyCoupon(token, dispatch, cartId, couponCode, setRotateCoupon, setCouponData, setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
      GuestCartApplyCoupon(dispatch, guestCartToken, couponCode, setRotateCoupon, setCouponData, setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'cart')
    }
  }

  const removeCoupon = () => {
    if (token) {
      customerCartRemoveCoupon(
        token, dispatch, cartId, couponCode, setRotateCoupon, setCouponData,
        setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'cart', actionmessage?.isSesstionTimeOut
      )
    } else if (guestCartToken) {
      guestCartRemoveCoupon(
        dispatch, guestCartToken, cartId, couponCode, setRotateCoupon, setCouponData,
        setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'cart'
      )
    }
  }

  const increaMentCount = (qty, id) => {
    console.log("increment",qty,id);
    if (qty === 0) return
  let temp=  myQuoteCartData?.map((item, ind) => {
      if (id === ind) {
        return {
          ...item,
          quatation_qty: qty
        };
      } else {
        return item;
      }
    })
    setQuoteMycartData(temp
    
    );
    console.log("increment temp",temp);
    let tempo=temp.filter((item,ind)=>ind == id);
console.log("increment tempo",tempo);
    updateCart(tempo)
  }
  const handleSubmit = () => {
    var isError = false;
    if (!couponCode) {
      setCouponCodeError("Required field.")
      document.getElementById("coupon")?.focus();
      var isError = true;
    } else if (!isEmptyValue(couponCode)) {
      setCouponCodeError("Empty spaces are not allowed.")
      document.getElementById("coupon")?.focus();
      var isError = true;
    }
    // Final valiation
    if (!isError) {
      if (cartSummaryDetails?.total?.coupon_code) {
        removeCoupon();
      } else {
        applyCoupon();
      }
    }
  }
  const proceedtoCheckOutHandler = () => {
    var isError = false;
    if (cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.error_message) {
      dispatch(ACTION_PAGEMESSAGE({
        show: true,
        isSuccess: false,
        isError: true,
        isWarning: false,
        message: `${cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.error_message} ${cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.maximum_amount}.`,
        showFor: "cart"
      }))
      var isError = true;
    }
    // Final valiation
    if (!isError) {
      if (!isHavingOutofStock) {
        dispatch(ACTION_ESTIMATESHIPPINGMETHOD(estimateShipping))
        setTimeout(() => {
          navigate("")
        }, 100)
      } else {
        setFocusOutofStock(!focusOutofStock)
      }
    }
  }

  useEffect(() => {
    const delayFn = setTimeout(() => {
      if (isPostCodeChanged) {
        setEstimateShipping((prevState) => ({
          ...prevState,
          postcode: zipcode
        }))
      }
    }, 1000);
    return () => clearTimeout(delayFn);
  }, [zipcode, 350]);
  useEffect(() => {
    if (cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.error_message) {
      dispatch(ACTION_PAGEMESSAGE({
        show: true,
        isSuccess: false,
        isError: true,
        isWarning: false,
        message: `${cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.error_message} ${formatCurrency?.format(cartSummaryDetails?.total?.total_segments?.maximum_order_amount?.maximum_amount)}.`,
        showFor: "cart"
      }))
    }
  }, [cartSummaryDetails])
  useEffect(() => {
    setEstimateShippingError((prevState) => ({
      ...prevState,
      postcode: ""
    }))
  }, [location])

  useEffect(() => {
    setMycartData(miniCartDataItems)
    setQuoteMycartData(miniQuotecartDetails)
  }, [miniCartDataItems,myQuotecartDataempty])
  useEffect(() => {
    if (pageMessages?.showFor == "cart") {
      setUpdateFields(!updateFields)
    }
  }, [pageMessages?.show == true ? pageMessages?.show : ''])

  useEffect(() => {
    setCartId(myCartData?.[0]?.quote_id) 
    setQuoteId( myQuoteCartData?.id)
  }, [myCartData,myQuotecartDataempty])

  // quote login
  useEffect(() => {
    if (Object.keys(userdata).length) {
      setShippingFormValues(prevState => ({
        ...prevState,
        email: userdata?.email,
        
      }));
    }
  }, [userdata, setShippingFormValues]);
  useEffect(() => {
    if (
      cartDataAddress?.address?.countryId || cartDataAddress?.address?.display_country ||
      cartDataAddress?.address?.region || cartDataAddress?.address?.postcode ||
      cartDataAddress?.shippingMethod
    ) {
      setEstimateShipping((prevState) => ({
        ...prevState,
        country_id: cartDataAddress?.address?.countryId,
        display_country: cartDataAddress?.address?.display_country,
        display_country: cartDataAddress?.address?.display_country,
        region: cartDataAddress?.address?.region,
        region_id: cartDataAddress?.address?.region_id,
        postcode: cartDataAddress?.address?.postcode,
        regionValues: {
          label: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : "",
          value: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : '',
        },
      }))
      setZipcode(cartDataAddress?.address?.postcode)
      setCartSummaryData((prevState) => ({
        ...prevState,
        shipping_method: cartDataAddress?.shippingMethod,
        postcode: cartDataAddress?.address?.postcode,
      }))
    }
    if (!cartDataAddress?.address?.countryId || cartDataAddress?.address?.countryId == undefined) {
      const defaultCountry = countries?.filter((item) => item?.value == "IN");
      setEstimateShipping((prevState) => ({
        ...prevState,
        country_id: defaultCountry?.[0]?.value,
        display_country: defaultCountry?.[0]?.label,
      }))
      dispatch(ACTION_CARTDATA_ADDRESS({
        address: {
          countryId: defaultCountry?.[0]?.value,
          display_country: defaultCountry?.[0]?.label,
          postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
          region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
          region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
        },
        shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
      }))
    }
  }, [countries])

  useEffect(() => {
    setEstimateShipping((prevState) => ({
      ...prevState,
      customer_id: userdata?.id !== undefined ? userdata?.id : ''
    }))
  }, [userdata?.id])
  useEffect(() => {
    if (cartId !== null && cartId !== undefined && estimateShipping?.country_id) {
      if (token) {
        getEstimateShippingCart(token, dispatch, estimateShipping, setEstimateShippingData, cartId, setEstimateShippingLoader, actionmessage?.isSesstionTimeOut)
      } else if (guestCartToken) {
        getGuestEstimateShipping(guestCartToken, dispatch, estimateShipping, setEstimateShippingData, cartId, setEstimateShippingLoader)
      }
    }
  }, [estimateShipping, cartId]);
  useEffect(() => {
    if (token) {
      if (cartId !== null && cartId !== undefined && cartSummaryData?.countryId) {
        cartSummary(token, dispatch, cartId, cartSummaryData, setCartSummaryDetails, actionmessage?.isSesstionTimeOut)
      }
    } else if (guestCartToken) {
      if (cartId !== null && cartId !== undefined && cartSummaryData?.countryId) {
        guestCartSummary(dispatch, guestCartToken, cartSummaryData, setCartSummaryDetails)
      }
    }
  }, [cartId, cartSummaryData, updateTotalInfo, miniCartDataItems])
  useEffect(() => {
    setCartSummaryData((prevState) => ({
      ...prevState,
      countryId: estimateShipping?.country_id,
      display_country: estimateShipping?.display_country,
      postcode: estimateShipping?.postcode,
      region_id: estimateShipping?.region_id ? estimateShipping?.region_id : null,
      region: estimateShipping?.region,
    }))
  }, [
    estimateShipping?.country_id, estimateShipping?.postcode,
    estimateShipping?.region, estimateShipping?.region_id
  ])

  useEffect(() => {
    if (cartSummaryDetails?.total?.coupon_code) {
      setCouponCode(cartSummaryDetails?.total?.coupon_code)
    }
  }, [cartSummaryDetails?.total?.coupon_code])
  const [cartItemLoader, setCartItemLoader] = useState(false);
  useEffect(() => {
    if (width > 639) {
      setShowMobileCount(false)
    } else {
      setShowMobileCount(true)
    }
  }, [width])
  useEffect(() => {
    focusStockStatus.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }, [focusStockStatus.current, isHavingOutofStock, focusOutofStock]);

  useEffect(() => {
    myCartData?.map((item) => {
      if (!isHavingOutofStock) {
        if (item?.stock == "Out of Stock") {
          setIsHavingOutofStock(true)
        }
      } else {
        setIsHavingOutofStock(false)
      }
    })
  }, [myCartData])

  useEffect(() => {
    if (open) {
      setIsHavingOutofStock(false)
    }
  }, [open])

  const columns = [
    {
      name: "item",
      label: "Item",
      options: {
        customBodyRender: (value, data) => {
          console.log("customerbodydata",data);
          // debugger;
          let name = data?.rowData[2];
          let image = data?.rowData[3]?.image[0];
          let demo = data?.rowData[4];
          console.log("demo",demo);
          let weight = data?.rowData[5];
          let color = data?.rowData[6];
          let price = parseInt(data?.rowData[1]);
          let qty = parseInt(data?.rowData[7]);
          let demoo = (data?.rowData[7]);
          console.log("demoo-->",demoo);
          let qtyString = data?.rowData[7];
          let subTotal = (price * qty);
          let pdpUrl = data?.rowData?.[9];
          console.log("pdpurl",pdpUrl);
          let oldPrice = '₹900.00'
          let ind = data?.rowData?.[8].id;
          let index = data?.rowIndex;
          let stackStatus = data?.rowData[17];
          return (
            <Stack className="mycart_container">
              {
                image ?
                  <div className="product_item_info_img">
                    <div className="img_block">
                      {/* <Link to={`/${pdpUrl}`}> */}
                        <img src={image} alt="" />
                      {/* </Link> */}
                      {
                        data?.rowData?.[13] || data?.rowData?.[14] ?
                          <Box className='tag-section'>
                            {
                              data?.rowData?.[13] ?
                                <Typography className='tag-content'>{data?.rowData?.[13]}</Typography>
                                : ''
                            }
                            {
                              data?.rowData?.[14] ?
                                <Typography className='tag-content new-arrival'>{data?.rowData?.[14]}</Typography>
                                : ''
                            }
                          </Box>
                          : ''
                      }
                    </div>
                  </div>
                  : ''
              }
              {/* mobile view delete */}
              <div className="product_item_info_section">
                {
                  
                  name ?
                    <Stack className='productname-delete-section-mobile'>
                      <span className='product-name data-value'>
                        <span>{name}</span>
                        {/* <Link to={`/${pdpUrl}`}>{name}</Link> */}
                      </span>

                      <div className='cart-price-box-section edit-section-cart'>
                        <span className="mycart_product_delete_icon">
                          <ClickAwayListener onClickAway={() => {
                            setTimeout(() => {
                              if (isClickedDelete && !open) {
                                setIsClickedDelete(false)
                              }
                            }, 200);
                          }}>
                            <span
                              class="cart-edit-img cart-delete-img-section"
                              onClick={() => {
                                let ind = data?.rowData?.[8];
                                setIsClickedDelete(true)
                                setOpen(true)
                                setDeleteItemId(ind)
                              }}
                            >
                              <img className='delete-cart-img' src={CartDelete} alt="" />
                              <img className='delete-cart-hover' src={CartDeleteHover} alt="" />
                              <Box className='tool-display'><Tooltip value={"Remove this item"} /></Box>
                            </span>
                          </ClickAwayListener>
                        </span>
                      </div>
                    </Stack>
                    : ''
                }
                {
                  price ?
                    <span class="mobileprice-section">{formatCurrency?.format(price)}</span>
                    : ''
                }

                {
                  color ?
                    <span className='product-color data-value'>
                      <span className='data'>Color: </span>
                      <span className='value'>{color}</span>
                    </span>
                    : ''
                }
                {
                  weight ?
                    <span className='product-size data-value'>
                      <span className='data'>Weight (Kg): </span>
                      <span className='value'>{weight}</span>
                    </span>
                    : ''
                }
                {
                  price || qty ?
                    <div className='cart-input-box-section mobileview-qty-price'>

                      <div class="mobileprice-section">
                        {
                          data?.rowData?.[12] ?
                            <>
                              <span className='value price'>{formatCurrency?.format(data?.rowData?.[12])}</span>
                              <span className='data old-price'>{formatCurrency?.format(data?.rowData?.[11])}</span>
                            </>
                            :
                            <span className='value price'>{formatCurrency?.format(data?.rowData?.[11])}</span>
                        }
                      </div>
                      {
                        showMobileCount ?
                          <div className='qty-price-subtotal-section'>
                            <ClickAwayListener onClickAway={() => {
                              if (myQuoteCartData?.[index]?.qty !== qty && qtyString !== '' && qty != 0 && qty != '0' && qty != '' ) {
                              
                                // updateCart(data?.rowData)
                        
                                setRotateSameId(index)
                              }
                            }}>
                              <Stack
                                className='count_block'
                                sx={{
                                  pointerEvents: stackStatus !== "In Stock" && miniCartDataItems?.[index]?.available_qty == 0 ? "none" : "",
                                  opacity: stackStatus !== "In Stock" && miniCartDataItems?.[index]?.available_qty == 0 ? "0.50" : "",
                                }}
                              >
                                <Stack className='minus action'
                                  sx={{
                                    cursor: stackStatus !== "In Stock" && miniCartDataItems?.[index]?.available_qty == 0 ? "not-allowed" : ""
                                  }}
                                  onClick={() => {
                                    if (qty <= 0) {
                                      increaMentCount(qty, index)
                                    } else {
                                      if(qty > 10){
                                        increaMentCount(qty - 1, index)
                                      }
                                      
                                    }
                                  }}
                                >
                                  <RemoveIcon />
                                </Stack>
                                <Box className='input-block'>
                                <TextField
                                    className='input-text'
                                    type='number'
                                    value={qty}
                                    onChange={(e) => {
                                      if (e.target.value == '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                                        increaMentCount(e.target.value ? parseInt(e.target.value) : '', ind)
                                      } else {
                                        return false
                                      }
                                    }}
                                    onKeyDown={evt => {
                                      pressEnterCallFunction(evt, () => {
                                        if (miniQuotecartDetails?.[index]?.qty !== qty && qty !== '' && qty != 0 && qty != '0') {
                                          // updateCart(data?.rowData)
                                          setRotateSameId(index)
                                        }
                                      })
                                      if (evt.which === 8 || evt.which === 37 || evt.which == 39 || evt.which == 46) {
                                        return;
                                      }
                                      if (evt.which < 48 || evt.which > 57 || exceptThisSymbols.includes(evt.key) || !isValidNumber(evt.key)) {
                                        evt.preventDefault();
                                      }
                                    }}
                                  />
                                </Box>
                                <Stack
                                  className='plus action'
                                  onClick={() => increaMentCount(qty == '' ? 1 : qty + 1, index)}
                                >
                                  <AddIcon />
                                </Stack>
                              </Stack>
                            </ClickAwayListener>
                            <div class="mobileprice-section">
                              <span className='data'>Subtotal: </span>
                              <span className='value'>{formatCurrency?.format(data?.rowData[10])}</span>
                            </div>
                          </div>
                          : ''
                      }
                    </div>
                    : ''
                }
              </div>
              {/* {
                stackStatus !== "In Stock" ?
                  miniCartDataItems?.[index]?.available_qty == 0 ?
                    <Typography className='out_of_stock_message' ref={focusStockStatus}>
                      This product is currently out of stock. Remove this product to proceed to checkout
                    </Typography>
                    :
                    <Typography className='out_of_stock_message' ref={focusStockStatus}>
                      The requested product quantity is not available.
                    </Typography>
                  : ''
              } */}

            </Stack>
          );
        },
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        customBodyRender: (value, data) => {
          return (
            <>
              <Stack className='price-section'>
                {
                  data?.rowData?.[12] ?
                    <>
                      <Typography className="sub-total-desktop price">{formatCurrency?.format(data?.rowData?.[12])}</Typography>
                      <Typography className="sub-total-desktop old-price">{formatCurrency?.format(data?.rowData?.[11])}</Typography>
                    </>
                    :
                    <Typography className="sub-total-desktop price">{formatCurrency?.format(data?.rowData?.[11])}</Typography>
                }
              </Stack>
            </>

          );

        },
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        display: false
      }
    },
    {
      name: "media_gallery",
      label: "Image",
      options: {
        display:false
      }
    },
    {
      name: "sku",
      label: "sku",
      options: {
        display: false
      }
    },
    {
      name: "size_in_kg",
      label: "Weight_in_kg",
      options: {
        display: false
      }
    },
    {
      name: "color",
      label: "Color",
      options: {
        display: false
      }
    },
    {
      name: "quatation_qty",
      label: "Qty",
      options: {
        customBodyRender: (value, data) => {
          let ind = data?.rowIndex;
          let qty = parseInt(value);
          let qtyString = value;
          console.log("qtyString",qtyString);
          let stackStatus = data?.rowData[17];
          let index = data?.rowIndex;
          return (
            <div className='cart-input-box-section'>
              {
                !showMobileCount ?
                  <ClickAwayListener onClickAway={() => {
                    if (miniCartDataItems?.[ind]?.qty !== qty && qtyString !== '' && qty != 0 && qty != '0') {
                      // updateCart(data?.rowData)
                      setRotateSameId(ind)
                    }
                  }}>
                    <Stack
                      className='count_block'
                      sx={{
                        pointerEvents: stackStatus !== "In Stock" && miniCartDataItems?.[index]?.available_qty == 0 ? "none" : "",
                        opacity: stackStatus !== "In Stock" && miniCartDataItems?.[index]?.available_qty == 0 ? "0.50" : "",
                      }}
                    >
                      <Stack className='minus action'
                        onClick={() => {
                          console.log("qty",qty);
                         
                          if (qty <= 0) {
                            increaMentCount(qty, data?.rowIndex)
                          
                          } else {
               
                            if(qty >10){
                              increaMentCount(qty - 1, data?.rowIndex)
                            }
                            
                          }
                        }}
                      >
                        <RemoveIcon />
                      </Stack>
                      <Box className='input-block'>
                      <TextField
                                    className='input-text'
                                    type='number'
                                    value={qty}
                                    onChange={(e) => {
                                      if (e.target.value == '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                                        increaMentCount(e.target.value ? parseInt(e.target.value) : '', ind)
                                      } else {
                                        return false
                                      }
                                    }}
                                    onKeyDown={evt => {
                                      pressEnterCallFunction(evt, () => {
                                        if (myQuoteCartData?.[index]?.qty !== qty && qty !== '' && qty != 0 && qty != '0' ) {
                                          // updateCart(data?.rowData)
                                          setRotateSameId(index)
                                        }
                                      })
                                      if (evt.which === 8 || evt.which === 37 || evt.which == 39 || evt.which == 46) {
                                        return;
                                      }
                                      if (evt.which < 48 || evt.which > 57 || exceptThisSymbols.includes(evt.key) || !isValidNumber(evt.key)) {
                                        evt.preventDefault();
                                      }
                                    }}
                                  />
                      </Box>
                      <Stack
                        className='plus action'
                        onClick={() => increaMentCount(qty == '' ? 1 : qty + 1, data?.rowIndex)}
                      >
                        <AddIcon />
                      </Stack>
                    </Stack>
                  </ClickAwayListener>
                  : ''
              }
            </div>
          );
        },
      },
    },
    {
      name: "entity_id",
      label: "item_id",
      options: {
        display: false
      }
    },
    {
      name: "url_key",
      label: "product_url",
      options: {
        display: false
      }
    },
    {
      name: "total_price",
      label: "Subtotal",
      options: {
        customBodyRender: (value, data) => {
          return (
            <div className='cart-price-box-section'>
              <span className='price'>{formatCurrency?.format(data?.rowData[10])}</span>
              <span className="mycart_product_delete_icon">
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "price",
      label: "price",
      options: {
        display: false
      },
    },
    {
      name: "special_price",
      label: "special_price",
      options: {
        display: false
      },
    },
    {
      name: "arrival_tag",
      label: "arrival_tag",
      options: {
        display: false
      },
    },
    {
      name: "offer_tag",
      label: "offer_tag",
      options: {
        display: false
      },
    },
    {
      name: "row_total",
      label: "row_total",
      options: {
        display: false
      },
    },
    // {
    //   name: "",
    //   label: false,
    //   options: {
    //     customBodyRender: (value, data) => {
    //       let ind = data?.rowData?.[8];
    //       console.log("ind",ind);
    //       console.log("inddata",data);
    //       return (
    //         <div className='cart-price-box-section edit-section-cart'>
    //           <span className="mycart_product_delete_icon">

    //             {/* <ClickAwayListener onClickAway={() => {
    //               setTimeout(() => {
    //                 if (isClickedDelete && !open) {
    //                   setIsClickedDelete(false)
    //                 }
    //               }, 200);
    //             }}>
    //               <span
    //                 class="cart-edit-img cart-delete-img-section"
    //                 onClick={() => {
    //                   setIsClickedDelete(true)
    //                   setOpen(true)
    //                   setDeleteItemId(ind)
    //                 }}
    //               >
    //                 <img className='delete-cart-img' src={CartDelete} alt="" />
    //                 <img className='delete-cart-hover' src={CartDeleteHover} alt="" />
    //                 <Box className='tool-display'><Tooltip value={"Remove this item"} /></Box>
    //               </span>
    //             </ClickAwayListener> */}
    //           </span>
    //         </div>
    //       );
    //     },
    //   },
    // },
    {
      name: "",
      label: false,
      options: {
        customBodyRender: (value, data) => {
          let ind = data?.rowData?.[8];
          console.log("ind",ind);
          console.log("inddata",data);
          return (
            <div className='cart-price-box-section edit-section-cart'>
              <span className="mycart_product_delete_icon">
                <ClickAwayListener onClickAway={() => {
                  setTimeout(() => {
                    if (isClickedDelete && !open) {
                      setIsClickedDelete(false)
                    }
                  }, 200);
                }}>
                  <span
                    class="cart-edit-img cart-delete-img-section"
                    onClick={() => {
                      setIsClickedDelete(true)
                      setOpen(true)
                      setDeleteItemId(ind)
                    }}
                  >
                    <img className='delete-cart-img' src={CartDelete} alt="" />
                    <img className='delete-cart-hover' src={CartDeleteHover} alt="" />
                    <Box className='tool-display'><Tooltip value={"Remove this item"} /></Box>
                  </span>
                </ClickAwayListener>
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "stock",
      label: "stock",
      options: {
        display: false
      },
    },
  ];

  const options = {
    filter: false,
    filterType: "textField",
    responsive: "vertical",
    pagination: false,
    selectableRows: false,
    download: false,
    print: false,
    sort: false,
    viewColumns: false,
    search: false,
  };
console.log("myQU",myQuoteCartData);
console.log("myQU cart",myCartData);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sri Swaminathan & Co Kumbakonam | Cart</title>
        <meta
          name="description"
          content="Every block of stone has a statue inside it and it is the task of the sculptor to discover it"
          data-react-helmet="true"
        />
      </Helmet>
      <Stack className='mycart-page'>
        {
          myQuoteCartData?.length ?
            <>
              <Stack className="mycart_container">
                <Stack className="mycart_section">
                  <Stack className="Quote_block">
                    <Stack className="cart_item_block">
                      <Stack className='cart-header-block'>
                        <Typography variant='h2'>Quote Cart</Typography>
                      </Stack>
                      <Table
                        columns={columns}
                        data={myQuoteCartData}
                        options={options}
                      />
                      <Stack className="cart_actionable_buttons common_button_block"
                        sx={{
                          pointerEvents: !myQuoteCartData?.length ? 'none' : ''
                        }}
                      >
                        <Box className="continue_action_block">
                          <Link
                            to={`/`}
                            className='cart_continue_btn_section'
                            onClick={() => {
                              setIsClickedDelete(true)
                            }}
                          > <ArrowBackIosIcon />Continue Shopping</Link>
                        </Box>
                        <Box className="continue_action_block clear-cart">
                          <Button className='common-btn-section outlined_default_btn'
                            onClick={() => {
                              setIsClickedDelete(true)
                              setOpen(true)
                              setIsDeleteAll(true)
                              // deleteAllItems()
                            }}
                          >Clear Shopping Quote</Button>
                        </Box>

                      </Stack>
                    </Stack>
                    {/* Total Cart */}
                    <Stack className={`cart_total_container
                              ${!miniCartDetails?.cross_sell_products?.length && "remove-same-category"}
                              `}
                    >
                      <Stack className="cart_total_block">
                      {
                          openEstimateTax ?
                            <Stack className='estimate-box-section'>
                              <Stack >

                              </Stack>
                              <Stack >

                              </Stack>


                              <Stack>

                              </Stack>
                              <Stack>


                              </Stack>
                            </Stack>
                            : ""
                        }

{
!validatePassword || Object.keys(userdata).length ?
                        <QuoteForm
                          shippingFormValues={shippingFormValues}
                          userdata={userdata}
                          setShippingFormValues={setShippingFormValues}
                          formErrorShipping={formErrorShipping}
                          setFormErrorShipping={setFormErrorShipping}
                          addNewAddressHandlerShipping={addNewAddressHandlerShipping}
                          allAddress={allAddress}
                          getShippingBillingAddres={getShippingBillingAddres}
                          setEstimateShippingData={setEstimateShippingData}
                          setEstimateShippingLoader={setEstimateShippingLoader}
                          setShippingInformtionData={setShippingInformtionData}
                          shippingInformtionData={shippingInformtionData}
                          setUpdateShippingInformationById={setUpdateShippingInformationById}
                          updateShippingInformationById={updateShippingInformationById}
                          // update shipping
                          setUpdateShippingMethod={setUpdateShippingMethod}
                          updateShippingMethod={updateShippingMethod}
                          setEstimateShipping={setEstimateShipping}
                          // validation
                          setIsValidShippingAddress={setIsValidShippingAddress}
                          setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                        />
                        :""
        }

                        <Stack>
                          <Box className='input-block'>
                            <Typography className="input_label" style={{ textAlign: 'left', marginTop: '10px' }}>Email<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section' style={{ marginTop: '10px', marginBottom: '20px' }}>
                              <TextField className='input-text'
                                name='guestemail'
                                id='guestemail'
                                disabled={Object.keys(userdata).length ?true:false}
                                value={Object.keys(userdata).length?userdata.email:shippingFormValues?.email}
                                error={formError?.email ? true : false}
                                onChange={(e) => {
                                  setIsShippingAddressChnaged(true)
                                  setShippingFormValues((prevState) => ({
                                    ...prevState,
                                    email: e.target.value
                                  }))
                                  dispatch(ACTION_GUESTSHIPPING({
                                    ...guestShippingAddress,
                                    email: e.target.value
                                  }))
                                  setShippingFormError((prevState) => ({
                                    ...prevState,
                                    email: ""
                                  }))
                                  setFormValues((prevState) => ({
                                    ...prevState,
                                    username: e.target.value
                                  }))
                                  setFormError((prevState) => ({
                                    ...prevState,
                                    email: ""
                                  }))
                                }}
                                onKeyDown={(e) => {
                                  pressEnterCallFunction(e, verifyEmail)
                                }}
                                onBlur={() => {
                                  if (validatePassword) {
                                    isExitedQuoteEmail(dispatch, shippingFormValues?.email, setFormValues, setFormError, setValidatePassword)
                                  } else {
                                    verifyEmail()
                                  }
                                }}
                              />
                              {
                                shippingFormError?.email ?
                                  shippingFormError?.email && <Typography className='form-error-lable field-error' style={{ marginTop: '5px', position: 'static', textAlign: 'left' }}>{shippingFormError?.email}</Typography>
                                  :
                                  formError?.email && <Typography className='form-error-lable field-error' style={{ marginTop: '5px', position: 'static', textAlign: 'left' }}>{formError?.email}</Typography>
                              }
                            </Stack>
                          </Box>
                        </Stack>
                        {
          validatePassword   ?
            <>
              <Box className='input-block1 password-section'>
                <Typography className="input_label" style={{textAlign:"left"}}>Password<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section' style={{ marginTop: '10px', marginBottom: '20px' }}>
                  <Stack className='input-icon-section'>
                    <TextField className='input-text'
                      name='password'
                      id='password'
                      type={quoteshowPassword ? 'text' : 'password'}
                      error={formError?.password ? true : false}
                      value={formValues?.password}
                      onChange={(e) => {
                        setFormValues((prevState) => ({
                          ...prevState,
                          password: e.target.value
                        }))
                        setFormError((prevState) => ({
                          ...prevState,
                          password: ""
                        }))
                      }}
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                      onKeyDown={(e) => pressEnterCallFunction(e, verifyEmail)}
                    />
                    <div className='icon-section'>
                      <img src={quoteshowPassword ? Eyepass : EyeHide} alt=""
                        onClick={() => setquoteshowPassword(!quoteshowPassword)}
                      />
                    </div>
                    {
                      shippingFormError?.password && <Typography className='form-error-lable field-error'>{shippingFormError?.password}</Typography>
                    }



                  </Stack>

                </Stack>
              </Box>
              <Box className='checkout-signin-btn'>
               
               <Typography
                   variant='span'
                   className='forgot-password'
                   onClick={() => {
                     dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                       loginReg: false,
                       forgotPas: true,
                       resetPass: false
                     }))
                   }}
                 >
                   Forgot Password?
                 </Typography> 
               </Box> 
              <Typography className='quoteaccount-with-us'>You already have an account with us. </Typography>
             
           
            </>
            : ''
        }
        {
 
        }
     
     {
  !validatePassword && (
    <Stack className="text-block-section">
      <Box className="input-block">
        <Typography className="input_label">Remarks</Typography>
        <TextareaAutosize
          className={`input-text message ${formError?.message ? 'show_error' : ''}`}
          name="message"
          id="message"
          value={userdata.message || shippingFormValues?.message || ""}
          error={formError?.message ? true : false}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log("isExist", newValue);
            setShippingFormValues((prevState) => ({
              ...prevState,
              message: newValue,
            }));
            setFormValues((prevState) => ({
              ...prevState,
              message: newValue,
            }));
            setFormError((prevState) => ({
              ...prevState,
              message: "",
            }));
          }}
        />
        {formError?.message && (
          <Typography className="form-error-lable field-error">
            {formError?.message}
          </Typography>
        )}
      </Box>
    </Stack>
  )
}
                      
                        <Stack className='proceed-to-checkout common_button_block'>
                          <Button
                            className='primary_default_btn proceed-checkout'
                            onClick={
                           !validatePassword ?   placeOrderHandler:loginHandler
                            
                            }
                         
                          > {!validatePassword ?"Submit Quote":"Sign In" }</Button>
                         
                        </Stack>


                        {/* <Stack className='proceed-to-checkout common_button_block'>
                          <Button
                            className='primary_default_btn proceed-checkout'
                            onClick={() => proceedtoCheckOutHandler()}
                            sx={{
                              pointerEvents: !miniCartDataItems?.length ? 'none' : ''
                            }}
                          >Proceed To Quote</Button>
                        </Stack> */}
                      </Stack>
                      {
                        miniCartDetails?.cross_sell_products?.length ?
                          <Stack className='cart-same-category-section'>
                            <Samecategory
                              cross_sell_data={miniCartDetails?.cross_sell_products}
                              currency={currency}
                            />
                          </Stack>
                          : ''
                      }
                    </Stack>

                  </Stack>
                </Stack>
              </Stack>
              {
                open && <Model
                  name="minicart_alert"
                  closePpup={() => {
                    setIsClickedDelete(true)
                    setOpen(false)
                  }}
                  action={() => isDeleteAll == true ? deleteAllItems() : deleteCart()}
                  hideCloseIcon={true}
                  enableAlert={true}
                  alertMessage="Are you sure you want to remove this item from the Quote?"
                />
              }
            </>
            :
            ""
        }
        {
          !miniQuotecartDetails.length
          
          ?
           <EmptyCart /> : ''
        }
      </Stack>
      {
        rotate ? <Pageloader /> : ''
      }
    </>
  )
}

export default Index;