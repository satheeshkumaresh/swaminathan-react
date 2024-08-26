import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';
import './styles.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import Eyepass from "../../../Assets/Clienticons/swaminathan-icons-21.svg";
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Guest from './Guest';
import ShippingAddress from './ShippingAddress';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import Summary from './Summary';
import {
  ACTION_GUESTSHIPPING, ACTION_GUESTBILLING,
  ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_CARTDATA_ADDRESS,
  ACTION_GUESTSAMEASSHIPPINGBILLING
} from "../../../Store/action";
import { 
  guestTotalCartCheckout, guestSetPaymentInformation, guestShippingInformation,
  getGuestEstimateShipping, Action_Checkout_Login
 } from "./APIList";
import { useSelector, useDispatch } from 'react-redux';
import { isEmptyValue, isValidEmail, pressEnterCallFunction, isValidCharacter } from "../../../Utilities/Utilities";
import EyeHide from "../../../Assets/Checkout/EyehideIcon.svg";
import Pageloader from "../../Loader/Pageloader";

const Index = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMyAccount, setOpenMyaccount] = useState(false);
  const {
    guestCartToken, miniCartDataItems, miniCartData, guestShippingAddress,
    guestBillingAddress, cartDataAddress, countries,
    guestSameAsShipping, isLoading
  } = useSelector(state => {
    return {
      isLoading: state?.isLoading,
      guestCartToken: state?.guestCartToken,
      miniCartDataItems: state?.miniCartDetails?.data,
      miniCartData: state?.miniCartDetails,
      guestShippingAddress: state?.guestShippingAddress,
      guestBillingAddress: state?.guestBillingAddress,
      cartDataAddress: state?.cartDataAddress,
      countries: state?.countries,
      guestSameAsShipping: state?.guestSameAsShipping
    }
  })
  // stock status
  const [isHavingOutofStock, setIsHavingOutofStock] = useState(false);
  // loaders
  const [shippingInforLoader, setShippingInforLoader] = useState(false);
  const [estimateShippingLoader, setEstimateShippingLoader] = useState(false);
  const [getBillingShippingAddressLoader, setetBillingShippingAddressLoader] = useState(false);
  const [shippingAddressHandlerLoader, setShippingAddressHandlerLoader] = useState(false);
  const [billingAddressHandlerLoader, setBillingAddressHandlerLoader] = useState(false);
  const [totalLoader, setTotalLoader] = useState(false);
  const [setPaymentInformationLoader, setSetPaymentInformationLoader] = useState(false);

  const [cartId, setCartId] = useState(null);
  const [updateTotalInfo, setUpdateTotalInfo] = useState(false);
  // guest Get Shipping and billing address
  const [getShippingBillingAddres, setGetShippingBillingAddres] = useState({});
  // placeOrder
  const [isPlaceOrderClicked, setIsPlaceOrderClicked] = useState(false);

  // estimate shipping
  const [updateShippingMethod, setUpdateShippingMethod] = useState(false);
  const [updateEstimateShipping, setUpdateEstimateShipping] = useState(false);
  const [estimateShippingData, setEstimateShippingData] = useState([])
  const [estimateShipping, setEstimateShipping] = useState({
    display_country: "",
    customer_id: "",
    address1: "",
    address2: "",
    city: "",
    region_id: null,
    region: "",
    country_id: "",
    postcode: "",
    firstname: "",
    lastname: "",
    company: "",
    telephone: ""
  })
  // cart summary
  const [cartSummaryDetails, setCartSummaryDetails] = useState([]);
  // billing address
  const [guestBilling, setGuestBilling] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    display_country: "",
    display_state: "",
    regionValues: {
      label: "",
      value: ""
    },
    city: "",
    zip_code: "",
    number: "",
    mobile_valid: "",
    DefaultBilling: "1",
    DefaultShipping: "0",
    company: "",
    email: ""
  });
  const [billingFormError, setBillingFormError] = useState({
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
  // shipping address
  const [isShippingAddressChnaged, setIsShippingAddressChnaged] = useState(false);
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
  // login data
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  })
  const [loginFormDataError, setLoginFormDataError] = useState({
    username: "",
    password: ""
  })
  const [showPassword, setshowPassword] = useState(false);
  // shipping information
  const [shippingInformtionData, setShippingInformtionData] = useState({
    shipping_address: {
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
      email: "",
      same_as_billing: 1
    },
    billing_address: {
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
    shipping_method_code: "",
    shipping_carrier_code: "",
    extension_attributes: {}
  })
  // payment method data
  const [isClickedUpdate, setIsClickedUpdate] = useState(false);
  const [paymentInfoData, setPaymentInfoData] = useState({});
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
  const [sameAsBillingShipping, setSameAsBillingShipping] = useState(false);
  // payment information
  const [updatePaymentInformation, setUpdatePaymentInformation] = useState("");
  // shipping method
  const [selectedShippingMethod, setSelectedShippingMethod] = useState({
    amount: "",
    carrier_code: "",
    carrier_title: "",
    method_code: "",
    method_title: "",
  });
  // placeorder validations
  const [isValidShippingAddress, setIsValidShippingAddress] = useState(false);
  const [isValidBillingAddress, setIsValidBillingAddress] = useState(false);
  const [isSelectedShippingMethod, setIsSelectedShippingMethod] = useState(false);
  const [isSelectedPaymentMethod, setIsSelectedPaymentMethod] = useState(false);
  const [isHavingPaymentMethod, setIsHavingPaymentMethod] = useState(false);
  // create order
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
  // disable placeorder
  const [disablePlaceOrder, setDisablePlaceOrder] = useState(false);
  // shipping address validation
  const addGuestNewAddressHandlerShipping = () => {
    var isError = false;
    if (!guestShipping?.email) {
      setShippingFormError((prevState) => ({
        ...prevState,
        email: "Required field."
      }))
      document.getElementById("guestemail")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.email)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        email: "Empty spaces are not allowed."
      }))
      document.getElementById("guestemail")?.focus();
      var isError = true;
    } else if (!isValidEmail(guestShipping?.email)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        email: "Please enter valid email."
      }))
      document.getElementById("guestemail")?.focus();
      var isError = true;
    }
    // first name
    if (!guestShipping?.first_name) {
      setShippingFormError((prevState) => ({
        ...prevState,
        first_name: "Required field."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.first_name)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        first_name: "Empty spaces are not allowed."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestShipping?.first_name)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        first_name: "Name can only contain alphabets."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    }
    // last name
    if (!guestShipping?.last_name) {
      setShippingFormError((prevState) => ({
        ...prevState,
        last_name: "Required field."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.last_name)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        last_name: "Empty spaces are not allowed."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestShipping?.last_name)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        last_name: "Name can only contain alphabets."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    }
    // address1
    if (!guestShipping?.address1) {
      setShippingFormError((prevState) => ({
        ...prevState,
        address1: "Required field."
      }))
      document.getElementById("address1")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.address1)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        address1: "Empty spaces are not allowed."
      }))
      document.getElementById("address1")?.focus();
      var isError = true;
    }
    // zip_code
    if (!guestShipping?.zip_code) {
      setShippingFormError((prevState) => ({
        ...prevState,
        zip_code: "Required field."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.zip_code)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        zip_code: "Empty spaces are not allowed."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    }

    // number
    if (!guestShipping?.number || !guestShipping?.mobile_valid?.length) {
      setShippingFormError((prevState) => ({
        ...prevState,
        number: "Required field."
      }))
      document.getElementById("number")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.number)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        number: "Empty spaces are not allowed."
      }))
      document.getElementById("number")?.focus();
      var isError = true;
    }

    // country
    if (!guestShipping?.country) {
      setShippingFormError((prevState) => ({
        ...prevState,
        country: "Required field."
      }))
      document.getElementById("country")?.focus();
      var isError = true;
    }
    // state
    if (!guestShipping?.state) {
      setShippingFormError((prevState) => ({
        ...prevState,
        state: "Required field."
      }))
      document.getElementById("state")?.focus();
      var isError = true;
    }
    // city
    if (!guestShipping?.city) {
      setShippingFormError((prevState) => ({
        ...prevState,
        city: "Required field."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestShipping?.city)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        city: "Empty spaces are not allowed."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestShipping?.city)) {
      setShippingFormError((prevState) => ({
        ...prevState,
        city: "Name can only contain alphabets."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      setEstimateShipping(() => ({
        display_country: guestShipping?.display_country,
        address1: guestShipping?.address1,
        address2: guestShipping?.address2 ? guestShipping?.address2 : '',
        city: guestShipping?.city,
        region_id: guestShipping?.state ? guestShipping?.state : null,
        region: guestShipping?.display_state,
        country_id: guestShipping?.country,
        postcode: guestShipping?.zip_code,
        firstname: guestShipping?.first_name,
        lastname: guestShipping?.last_name,
        company: guestShipping?.company,
        telephone: guestShipping?.number,
      }))
      setTimeout(() => {
        setUpdateEstimateShipping(!updateEstimateShipping)
      }, 200);
      setShippingInformtionData((prevState) => ({
        ...prevState,
        shipping_address: {
          ...prevState.shipping_address,
          countryId: guestShipping?.country,
          regionId: guestShipping?.state ? guestShipping?.state : null,
          regionCode: guestShipping?.state ? guestShipping?.state : null,
          region: guestShipping?.display_state,
          street: [
            guestShipping?.address1,
            guestShipping?.address2 ? guestShipping?.address2 : '',
          ],
          company: guestShipping?.company,
          telephone: guestShipping?.number,
          postcode: guestShipping?.zip_code,
          city: guestShipping?.city,
          firstname: guestShipping?.first_name,
          lastname: guestShipping?.last_name,
          email: guestShipping?.email,
        }
      }))
    }
  }
  // billing address validation
  const addGuestNewBillingAddressHandler = () => {
    var isError = false;
    // first name
    if (!guestBilling?.first_name) {
      setBillingFormError((prevState) => ({
        ...prevState,
        first_name: "Required field."
      }))
      document.getElementById("b_first_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.first_name)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        first_name: "Empty spaces are not allowed."
      }))
      document.getElementById("b_first_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestBilling?.first_name)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        first_name: "Name can only contain alphabets."
      }))
      document.getElementById("b_first_name")?.focus();
      var isError = true;
    }
    // last name
    if (!guestBilling?.last_name) {
      setBillingFormError((prevState) => ({
        ...prevState,
        last_name: "Required field."
      }))
      document.getElementById("b_last_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.last_name)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        last_name: "Empty spaces are not allowed."
      }))
      document.getElementById("b_last_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestBilling?.last_name)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        last_name: "Name can only contain alphabets."
      }))
      document.getElementById("b_last_name")?.focus();
      var isError = true;
    }
    // address1
    if (!guestBilling?.address1) {
      setBillingFormError((prevState) => ({
        ...prevState,
        address1: "Required field."
      }))
      document.getElementById("b_address1")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.address1)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        address1: "Empty spaces are not allowed."
      }))
      document.getElementById("b_address1")?.focus();
      var isError = true;
    }
    // zip_code
    if (!guestBilling?.zip_code) {
      setBillingFormError((prevState) => ({
        ...prevState,
        zip_code: "Required field."
      }))
      document.getElementById("b_zip_code")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.zip_code)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        zip_code: "Empty spaces are not allowed."
      }))
      document.getElementById("b_zip_code")?.focus();
      var isError = true;
    }
    // number
    if (!guestBilling?.number || !guestBilling?.mobile_valid?.length) {
      setBillingFormError((prevState) => ({
        ...prevState,
        number: "Required field."
      }))
      document.getElementById("b_number")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.number)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        number: "Empty spaces are not allowed."
      }))
      document.getElementById("b_number")?.focus();
      var isError = true;
    }
    // country
    if (!guestBilling?.country) {
      setBillingFormError((prevState) => ({
        ...prevState,
        country: "Required field."
      }))
      document.getElementById("b_country")?.focus();
      var isError = true;
    }
    // state
    if (!guestBilling?.state) {
      setBillingFormError((prevState) => ({
        ...prevState,
        state: "Required field."
      }))
      document.getElementById("b_state")?.focus();
      var isError = true;
    }
    // city
    if (!guestBilling?.city) {
      setBillingFormError((prevState) => ({
        ...prevState,
        city: "Required field."
      }))
      document.getElementById("b_city")?.focus();
      var isError = true;
    } else if (!isEmptyValue(guestBilling?.city)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        city: "Empty spaces are not allowed."
      }))
      document.getElementById("b_city")?.focus();
      var isError = true;
    } else if (!isValidCharacter(guestBilling?.city)) {
      setBillingFormError((prevState) => ({
        ...prevState,
        city: "Name can only contain alphabets."
      }))
      document.getElementById("b_city")?.focus();
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      dispatch(ACTION_GUESTBILLING(guestBilling))
      setIsClickedUpdate(true)
    }
  }
  // login handler
  const loginHandler = () => {
    var isError = false;
    // Password
    if (!loginFormData?.password) {
      setLoginFormDataError((prevState) => ({
        ...prevState,
        password: "Required field."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    } else if (!isEmptyValue(loginFormData?.password)) {
      setLoginFormDataError((prevState) => ({
        ...prevState,
        password: "Empty spaces are not allowed."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    }
    // Email
    if (!loginFormData?.username) {
      setLoginFormDataError((prevState) => ({
        ...prevState,
        username: "Required field."
      }))
      document.getElementById("login_email")?.focus();
      var isError = true;
    } else if (!isEmptyValue(loginFormData?.username)) {
      setLoginFormDataError((prevState) => ({
        ...prevState,
        username: "Empty spaces are not allowed."
      }))
      document.getElementById("login_email")?.focus();
      var isError = true;
    } else if (!isValidEmail(loginFormData?.username)) {
      setLoginFormDataError((prevState) => ({
        ...prevState,
        username: "Please enter valid email."
      }))
      document.getElementById("login_email")?.focus();
      var isError = true;
    }
    // Final valiation
    if (!isError) {
      Action_Checkout_Login(loginFormData, dispatch, setLoginFormDataError, setOpenMyaccount)
    }
  }

  useEffect(() => {
    setCartId(miniCartDataItems?.[0]?.quote_id)
  }, [miniCartDataItems])
  // stock status
  useEffect(() => {
    if (miniCartData?.code == 200 && !isLoading) {
      if (miniCartData?.message == "You have no items in your shopping cart.") {
        navigate("/mycart", { replace: true })
        return
      } else {
        miniCartDataItems?.map((item) => {
          if (!isHavingOutofStock) {
            if (item?.stock == "Out of Stock") {
              setIsHavingOutofStock(true)
            }
          } else {
            return
          }
        })
      }
    }
  }, [miniCartDataItems])
  useEffect(() => {
    if (isHavingOutofStock) {
      navigate("/mycart")
    }
  }, [isHavingOutofStock])
  // estimate shipping
  useEffect(() => {
    if (cartId !== null && cartId !== undefined && estimateShipping?.country_id) {
      getGuestEstimateShipping(guestCartToken, dispatch, estimateShipping, setEstimateShippingData, cartId, setEstimateShippingLoader)
    }
  }, [
    estimateShipping?.country_id, cartId, updateEstimateShipping, updateShippingMethod,
  ])
  // cart summary
  useEffect(() => {
    guestTotalCartCheckout(dispatch, guestCartToken, setCartSummaryDetails, setTotalLoader)
  }, [updateTotalInfo, paymentInfoData])
  // setEstimate shipping
  useEffect(() => {
    // shipping
    if (
      guestShippingAddress?.country || guestShippingAddress?.state ||
      guestShippingAddress?.zip_code || cartDataAddress?.shippingMethod
    ) {
      setEstimateShipping((prevState) => ({
        ...prevState,
        country_id: guestShippingAddress?.country,
        display_country: guestShippingAddress?.display_country,
        region: guestShippingAddress?.display_state,
        region_id: guestShippingAddress?.state,
        postcode: guestShippingAddress?.zip_code,
        address1: guestShippingAddress?.address1,
        address2: guestShippingAddress?.address2,
        city: guestShippingAddress?.city,
        firstname: guestShippingAddress?.first_name,
        lastname: guestShippingAddress?.last_name,
        company: guestShippingAddress?.company,
        telephone: guestShippingAddress?.number
      }))
      setShippingInformtionData((prevState) => ({
        ...prevState,
        shipping_address: {
          ...prevState.shipping_address,
          countryId: guestShippingAddress?.country,
          regionId: guestShippingAddress?.state ? guestShippingAddress?.state : null,
          regionCode: guestShippingAddress?.state ? guestShippingAddress?.state : null,
          region: guestShippingAddress?.display_state,
          postcode: guestShippingAddress?.zip_code,
          street: [
            guestShippingAddress?.address1,
            guestShippingAddress?.address2 ? guestShippingAddress?.address2 : '',
          ],
          company: guestShippingAddress?.company,
          telephone: guestShippingAddress?.number,
          city: guestShippingAddress?.city,
          firstname: guestShippingAddress?.first_name,
          lastname: guestShippingAddress?.last_name,
          email: guestShippingAddress?.email,
        },
        billing_address: {
          ...prevState.billing_address,
          countryId: guestShippingAddress?.country
        }
      }))
      setGuestShipping(() => ({
        first_name: guestShippingAddress?.first_name ? guestShippingAddress?.first_name : '',
        last_name: guestShippingAddress?.last_name ? guestShippingAddress?.last_name : '',
        address1: guestShippingAddress?.address1 ? guestShippingAddress?.address1 : '',
        address2: guestShippingAddress?.address2 ? guestShippingAddress?.address2 : '',
        country: guestShippingAddress?.country,
        display_country: guestShippingAddress?.display_country,
        display_state: guestShippingAddress?.display_state,
        state: guestShippingAddress?.state,
        regionValues: {
          label: guestShippingAddress?.display_state ? guestShippingAddress?.display_state : '',
          value: guestShippingAddress?.state ? guestShippingAddress?.state : '',
        },
        city: guestShippingAddress?.city ? guestShippingAddress?.city : '',
        zip_code: guestShippingAddress?.zip_code ? guestShippingAddress?.zip_code : '',
        number: guestShippingAddress?.number,
        mobile_valid: guestShippingAddress?.mobile_valid ? guestShippingAddress?.mobile_valid : '',
        company: guestShippingAddress?.company ? guestShippingAddress?.company : '',
        email: guestShippingAddress?.email ? guestShippingAddress?.email : ''
      }))
    }
    // shipping
    if (!guestShippingAddress?.display_country || guestShippingAddress?.display_country == undefined) {
      const defaultCountry = countries?.filter((item) => item?.value == "IN");
      setEstimateShipping((prevState) => ({
        ...prevState,
        country_id: defaultCountry?.[0]?.value,
        display_country: defaultCountry?.[0]?.label,
      }))
      setShippingInformtionData((prevState) => ({
        ...prevState,
        shipping_address: {
          countryId: defaultCountry?.[0]?.value
        },
        billing_address: {
          countryId: defaultCountry?.[0]?.value
        }
      }))
      setGuestShipping((prevState) => ({
        ...prevState,
        country: defaultCountry?.[0]?.value,
        display_country: defaultCountry?.[0]?.label
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
      dispatch(ACTION_GUESTSHIPPING({
        ...guestShippingAddress,
        display_country: defaultCountry?.[0]?.label,
        country: defaultCountry?.[0]?.value
      }))
    }
  }, [countries, guestShippingAddress])
  // billing
  useEffect(() => {
    // billing
    if (guestBillingAddress?.country) {
      setShippingInformtionData((prevState) => ({
        ...prevState,
        billing_address: {
          ...prevState.billing_address,
          countryId: guestBillingAddress?.country,
          regionId: guestBillingAddress?.state ? guestBillingAddress?.state : null,
          regionCode: guestBillingAddress?.state ? guestBillingAddress?.state : null,
          region: guestBillingAddress?.display_state,
          street: [
            guestBillingAddress?.address1,
            guestBillingAddress?.address2 ? guestBillingAddress?.address2 : ''
          ],
          company: guestBillingAddress?.company,
          telephone: guestBillingAddress?.number,
          postcode: guestBillingAddress?.zip_code,
          city: guestBillingAddress?.city,
          firstname: guestBillingAddress?.first_name,
          lastname: guestBillingAddress?.last_name,
          saveInAddressBook: null
        }
      }))
      setGuestBilling((prevState) => ({
        ...prevState,
        country: guestBillingAddress?.country,
        display_country: guestBillingAddress?.display_country,
        state: guestBillingAddress?.state,
        display_state: guestBillingAddress?.display_state,
        regionValues: {
          label: guestBillingAddress?.display_state ? guestBillingAddress?.display_state : '',
          value: guestBillingAddress?.state ? guestBillingAddress?.state : '',
        },
        first_name: guestBillingAddress?.first_name ? guestBillingAddress?.first_name : '',
        last_name: guestBillingAddress?.last_name ? guestBillingAddress?.last_name : '',
        address1: guestBillingAddress?.address1 ? guestBillingAddress?.address1 : '',
        address2: guestBillingAddress?.address2 ? guestBillingAddress?.address2 : '',
        city: guestBillingAddress?.city ? guestBillingAddress?.city : '',
        zip_code: guestBillingAddress?.zip_code ? guestBillingAddress?.zip_code : '',
        number: guestBillingAddress?.number ? guestBillingAddress?.number : '',
        mobile_valid: guestBillingAddress?.mobile_valid ? guestBillingAddress?.mobile_valid : '',
        company: guestBillingAddress?.company ? guestBillingAddress?.company : '',
      }))
    }
    // shipping
    if (!guestBillingAddress?.display_country || guestBillingAddress?.display_country == undefined) {
      const defaultCountry = countries?.filter((item) => item?.value == "IN");
      setGuestBilling((prevState) => ({
        ...prevState,
        country: defaultCountry?.[0]?.value,
        display_country: defaultCountry?.[0]?.label
      }))
      dispatch(ACTION_GUESTBILLING({
        ...guestBillingAddress,
        display_country: defaultCountry?.[0]?.label,
        country: defaultCountry?.[0]?.value
      }))
    }
  }, [countries, guestBillingAddress])

  // shipping information
  useEffect(() => {
    setTimeout(() => {
      guestShippingInformation(guestCartToken, dispatch, shippingInformtionData, setPaymentInfoData, setShippingInforLoader)
    }, 300);
  }, [
    shippingInformtionData?.shipping_method_code, shippingInformtionData?.shipping_address?.countryId,
    shippingInformtionData?.billing_address?.countryId, estimateShippingData, selectedShippingMethod
  ])
  // focusout
  useEffect(() => {
    if (shippingInforLoader || estimateShippingLoader) {
      document.getElementById('zip_code')?.blur();
    }
    document.getElementById("number")?.blur();
  }, [shippingInforLoader, estimateShippingLoader])
  // create order
  useEffect(() => {
    if (guestSameAsShipping) {
      setCreateOrderInfo((prevState) => ({
        ...prevState,
        cartId: cartId,
        email: guestShipping?.email,
        paymentMethod: {
          method: selectPaymentMethod
        },
        billing_address: {
          region: guestShippingAddress?.display_state,
          region_id: guestShippingAddress?.state,
          region_code: guestShippingAddress?.state ? guestShippingAddress?.state : null,
          country_id: guestShippingAddress?.country,
          street: [
            guestShippingAddress?.address1,
            guestShippingAddress?.address2 ? guestShippingAddress?.address2 : ""
          ],
          postcode: guestShippingAddress?.zip_code,
          city: guestShippingAddress?.city,
          firstname: guestShippingAddress?.first_name,
          lastname: guestShippingAddress?.last_name,
          email: guestShippingAddress?.email,
          telephone: guestShippingAddress?.number
        }
      }))
    } else {
      setCreateOrderInfo((prevState) => ({
        ...prevState,
        cartId: cartId,
        email: guestShippingAddress?.email,
        paymentMethod: {
          method: selectPaymentMethod
        },
        billing_address: {
          region: guestBillingAddress?.display_state,
          region_id: guestBillingAddress?.state,
          region_code: guestBillingAddress?.state ? guestBillingAddress?.state : null,
          country_id: guestBillingAddress?.country,
          street: [
            guestBillingAddress?.address1,
            guestBillingAddress?.address2 ? guestBillingAddress?.address2 : ""
          ],
          postcode: guestBillingAddress?.zip_code,
          city: guestBillingAddress?.city,
          firstname: guestBillingAddress?.first_name,
          lastname: guestBillingAddress?.last_name,
          email: guestShippingAddress?.email,
          telephone: guestBillingAddress?.number,
        }
      }))
    }
  }, [guestBillingAddress, guestShippingAddress, cartId, selectPaymentMethod, guestSameAsShipping]);

  // sameasBillingShipping
  useEffect(() => {
    if (guestSameAsShipping) {
      dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
    } else if (!guestBillingAddress?.first_name) {
      dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
    } else {
      dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(false))
    }
  }, [guestBillingAddress])

  // set payment method
  useEffect(() => {
    if (selectPaymentMethod) {
      guestSetPaymentInformation(dispatch, guestCartToken, selectPaymentMethod, guestShippingAddress?.email, updateTotalInfo, setUpdateTotalInfo, setSetPaymentInformationLoader)
    }
  }, [selectPaymentMethod, updatePaymentInformation, paymentInfoData])

  useEffect(() => {
    if (
      guestShippingAddress?.first_name &&
      guestShippingAddress?.last_name &&
      guestShippingAddress?.address1 &&
      guestShippingAddress?.display_country &&
      guestShippingAddress?.display_state &&
      guestShippingAddress?.city &&
      guestShippingAddress?.zip_code &&
      guestShippingAddress?.number &&
      guestShipping?.mobile_valid?.length
    ) {
      setIsValidShippingAddress(true)
    } else {
      setIsValidShippingAddress(false)
    }
    if (guestBillingAddress?.first_name) {
      setIsValidBillingAddress(true)
    } else {
      setIsValidBillingAddress(false)
    }
    if (paymentInfoData?.[0]?.data?.payment_methods?.length) {
      setIsHavingPaymentMethod(true)
    } else {
      setIsHavingPaymentMethod(false)
    }
    if (selectPaymentMethod) {
      setIsSelectedPaymentMethod(true)
    } else {
      setIsSelectedPaymentMethod(false)
    }
    if (cartDataAddress?.shippingMethod?.method_code && cartDataAddress?.shippingMethod?.carrier_code) {
      setIsSelectedShippingMethod(true)
    } else {
      setIsSelectedShippingMethod(false)
    }
  }, [guestBillingAddress, guestShippingAddress, paymentInfoData, cartDataAddress, selectPaymentMethod])

  useEffect(() => {
    setShippingFormError((prevState) => ({
      ...prevState,
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      zip_code: "",
      number: "",
      email: ""
    }))
    setBillingFormError((prevState) => ({
      ...prevState,
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      zip_code: "",
      number: "",
      email: ""
    }))
    setOpenMyaccount(false)
  }, [location?.pathname])

  useEffect(() => {
    if (!openMyAccount) {
      setLoginFormData((prevState) => ({
        ...prevState,
        username: "",
        password: ""
      }))
      setLoginFormDataError((prevState) => ({
        ...prevState,
        username: "",
        password: ""
      }))
      setshowPassword(false)
    }
  }, [openMyAccount])

  return (
    <>
      <Stack className='checkout_container_section'>
        <Stack className='checkout_container'>
          <Stack className='checkout_title_signin_section'>
            <Stack className='checkout_title_section'>
              <Typography className='title' variant='h3'>Express Checkout</Typography>
              <Typography className='subtitle' variant='span'>Please enter your details below to complete your purchase</Typography>
            </Stack>
            <Stack className='checkout_signin_section'>
              <Stack className='signin-section'>
                <Box className='btn_block buynow' >
                  <Button className='secondary_default_btn' onClick={() => setOpenMyaccount(!openMyAccount)}>Sign In</Button>
                  {
                    openMyAccount ?
                      <ClickAwayListener onClickAway={() => setOpenMyaccount(!openMyAccount)}>
                        <Box className='useraccount-open-section'>
                          <Box className='logged-in-user-dropdown mobile'>
                            <Stack className='form-block'>
                              <Stack className='header-section'>
                                <Typography variant='span' className="header-title-section">Sign In</Typography>
                                <Box className='close-section' onClick={() => setOpenMyaccount(!openMyAccount)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 18 18">
                                    <path id="close" d="M27,10.575,25.425,9,18,16.425,10.575,9,9,10.575,16.425,18,9,25.425,10.575,27,18,19.575,25.425,27,27,25.425,19.575,18Z" transform="translate(-9 -9)" fill="#767f80" />
                                  </svg>
                                </Box>

                              </Stack>
                              <Box className='input-block'>
                                <Typography className="input_label">Email<Typography variant='span'>*</Typography></Typography>
                                <Stack className='form-address-form common_input_block_section'>
                                  <TextField className='input-text'
                                    name='guestemail'
                                    id='login_email'
                                    value={loginFormData?.username}
                                    onChange={(e) => {
                                      setLoginFormData((prevState) => ({
                                        ...prevState,
                                        username: e.target.value
                                      }))
                                      setLoginFormDataError((prevState) => ({
                                        ...prevState,
                                        username: ""
                                      }))
                                    }}
                                    onKeyDown={(e) => pressEnterCallFunction(e, loginHandler)}
                                  />
                                  {
                                    loginFormDataError?.username &&
                                    <Typography className='form-error-lable field-error'>{loginFormDataError?.username}</Typography>
                                  }
                                </Stack>
                              </Box>
                              <Box className='input-block password-section'>
                                <Typography className="input_label">Password<Typography variant='span'>*</Typography></Typography>
                                <Stack className='form-address-form common_input_block_section'>
                                  <Stack className='input-icon-section'>
                                    <TextField className='input-text'
                                      name='password'
                                      id='password'
                                      type={showPassword ? 'text' : 'password'}
                                      value={loginFormData?.password}
                                      onChange={(e) => {
                                        setLoginFormData((prevState) => ({
                                          ...prevState,
                                          password: e.target.value
                                        }))
                                        setLoginFormDataError((prevState) => ({
                                          ...prevState,
                                          password: ""
                                        }))
                                      }}
                                      onKeyDown={(e) => pressEnterCallFunction(e, loginHandler)}
                                    />
                                    {
                                      loginFormDataError?.password &&
                                      <Typography className='form-error-lable field-error'>{loginFormDataError?.password}</Typography>
                                    }
                                    <div className='icon-section'>
                                      <img src={showPassword ? Eyepass : EyeHide} alt=""
                                        onClick={() => setshowPassword(!showPassword)}
                                      />
                                    </div>
                                  </Stack>

                                </Stack>
                              </Box>

                              <Box className='checkout-signin-btn'>
                                <Typography
                                  variant='span'
                                  className='forgot-password'
                                  onClick={() => {
                                    setOpenMyaccount(!openMyAccount)
                                    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                      loginReg: false,
                                      forgotPas: true,
                                      resetPass: false
                                    }))
                                  }}
                                >
                                  Forgot Password?
                                </Typography>
                                <Stack className='button-section'>
                                  <Button
                                    className='login-button secondary_default_btn'
                                    onClick={() => loginHandler()}
                                  >Sign In</Button>
                                </Stack>
                              </Box>

                            </Stack>
                          </Box>
                        </Box>
                      </ClickAwayListener>
                      : ""
                  }
                </Box>
              </Stack>

            </Stack>

          </Stack>
          <Stack className='checkout_container_grid'>

            <Stack className='checkouk_grid_section shipping-signin-section'>
              <Stack className='shipping-address-sign-content'>
                <Guest
                  guestShipping={guestShipping}
                  setGuestShipping={setGuestShipping}
                  shippingFormError={shippingFormError}
                  setShippingFormError={setShippingFormError}
                  addGuestNewAddressHandlerShipping={addGuestNewAddressHandlerShipping}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                />
                <ShippingAddress
                  guestShipping={guestShipping}
                  setGuestShipping={setGuestShipping}
                  shippingFormError={shippingFormError}
                  setShippingFormError={setShippingFormError}
                  addGuestNewAddressHandlerShipping={addGuestNewAddressHandlerShipping}
                  setUpdateShippingMethod={setUpdateShippingMethod}
                  updateShippingMethod={updateShippingMethod}
                  setEstimateShipping={setEstimateShipping}
                  setIsValidShippingAddress={setIsValidShippingAddress}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                />
              </Stack>

            </Stack>
            <Stack className='checkouk_grid_section'>
              <Stack className='shipping-payment-section'>
                <ShippingMethod
                  estimateShippingData={estimateShippingData}
                  setShippingInformtionData={setShippingInformtionData}
                  setSelectedShippingMethod={setSelectedShippingMethod}
                  shippingFormValues={guestShipping}
                  getShippingBillingAddres={getShippingBillingAddres}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                />
                <PaymentMethod
                  guestBilling={guestBilling}
                  setGuestBilling={setGuestBilling}
                  billingFormError={billingFormError}
                  setBillingFormError={setBillingFormError}
                  addGuestNewBillingAddressHandler={addGuestNewBillingAddressHandler}
                  paymentInfoData={paymentInfoData}
                  selectPaymentMethod={selectPaymentMethod}
                  setSelectPaymentMethod={setSelectPaymentMethod}
                  getShippingBillingAddres={getShippingBillingAddres}
                  setSameAsBillingShipping={setSameAsBillingShipping}
                  sameAsBillingShipping={sameAsBillingShipping}
                  // disable placeorder
                  setDisablePlaceOrder={setDisablePlaceOrder}
                  disablePlaceOrder={disablePlaceOrder}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                  // shipping information
                  setShippingInformtionData={setShippingInformtionData}
                  isClickedUpdate={isClickedUpdate}
                  setIsClickedUpdate={setIsClickedUpdate}
                />
              </Stack>
            </Stack>
            <Stack className='checkouk_grid_section summary-section'>
              <Stack className='summary-sectiont-content'>
                <Summary
                  cartSummaryDetails={cartSummaryDetails}
                  addGuestNewAddressHandlerShipping={addGuestNewAddressHandlerShipping}
                  addGuestNewBillingAddressHandler={addGuestNewBillingAddressHandler}
                  setUpdateTotalInfo={setUpdateTotalInfo}
                  updateTotalInfo={updateTotalInfo}
                  // validations
                  isValidShippingAddress={isValidShippingAddress}
                  isValidBillingAddress={isValidBillingAddress}
                  isSelectedShippingMethod={isSelectedShippingMethod}
                  isSelectedPaymentMethod={isSelectedPaymentMethod}
                  isHavingPaymentMethod={isHavingPaymentMethod}
                  sameAsBillingShipping={sameAsBillingShipping}
                  // createOrderInfo
                  createOrderInfo={createOrderInfo}
                  guestShipping={guestShipping}
                  // address
                  getShippingBillingAddres={getShippingBillingAddres}
                  // disable placeorder
                  disablePlaceOrder={disablePlaceOrder}
                  // isShippingAddressChnaged
                  isShippingAddressChnaged={isShippingAddressChnaged}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                  // order
                  isPlaceOrderClicked={isPlaceOrderClicked}
                  setIsPlaceOrderClicked={setIsPlaceOrderClicked}
                  // placeorder button
                  shippingInformtionData={shippingInformtionData}
                  selectPaymentMethod={selectPaymentMethod}
                  // shipping error
                  setShippingFormError={setShippingFormError}
                />
              </Stack>

            </Stack>

          </Stack>
        </Stack>
      </Stack>
      {
        shippingInforLoader && <Pageloader />
      }
      {
        getBillingShippingAddressLoader && <Pageloader />
      }
      {
        estimateShippingLoader && <Pageloader />
      }
      {
        shippingAddressHandlerLoader && <Pageloader />
      }
      {
        billingAddressHandlerLoader && <Pageloader />
      }
      {
        totalLoader && <Pageloader />
      }
      {
        setPaymentInformationLoader && <Pageloader />
      }
    </>
  )
}

export default Index;
