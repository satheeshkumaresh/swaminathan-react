import React, { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import './styles.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import ShippingAddress from './ShippingAddress';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import Summary from './Summary';
import {
  ACTION_CARTDATA_ADDRESS,
  ACTION_CUSTOMERSAMEASSHIPPING
} from "../../../Store/action";
import { 
  customerTotalCartCheckout, customerSetPaymentInformation, customerGetShippingBillingAddres,
  customerAddBillingAddressAPI, customerEstimateShippingById, shippingInformation,
  getEstimateShipping
 } from "./APIList";
import { useDispatch, useSelector } from 'react-redux';
import { isEmptyValue, isValidCharacter } from "../../../Utilities/Utilities";
import Pageloader from "../../Loader/Pageloader";

const Index = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token, miniCartDataItems, miniCartData,
    cartDataAddress, countries, customerSameAsShipping, actionmessage,
    isLoading
  } = useSelector(state => {
    return {
      isLoading: state?.isLoading,
      token: state?.token,
      miniCartDataItems: state?.miniCartDetails?.data,
      miniCartData: state?.miniCartDetails,
      cartDataAddress: state?.cartDataAddress,
      countries: state?.countries,
      customerSameAsShipping: state?.customerSameAsShipping,
      actionmessage: state?.actionmessage
    }
  })
  // stock status
  const [isHavingOutofStock, setIsHavingOutofStock] = useState(false);
  // Loaders
  const [totalLoader, setTotalLoader] = useState(false);
  const [estimateShippingLoader, setEstimateShippingLoader] = useState(false);
  const [shippingInforLoader, setShippingInforLoader] = useState(false);
  const [setPaymentInformationLoader, setSetPaymentInformationLoader] = useState(false);
  const [getBillingShippingAddressLoader, setetBillingShippingAddressLoader] = useState(false);
  const [billingAddressHandlerLoader, setBillingAddressHandlerLoader] = useState(false);

  const [cartId, setCartId] = useState(null);
  const [cartSummaryDetails, setCartSummaryDetails] = useState({});
  // disable placeorder
  const [disablePlaceOrder, setDisablePlaceOrder] = useState(false);
  // api condtions
  const [isGetShippBillLoaded, setIsGetShippBillLoaded] = useState(false);
  const [getNewAddresses, setGetNewAddresses] = useState(false);
  // estimate shipping
  const [updateShippingInformationById, setUpdateShippingInformationById] = useState(false);
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
  })
  // payment method data
  const [isClickedUpdate, setIsClickedUpdate] = useState(false);
  const [paymentInfoData, setPaymentInfoData] = useState({});
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
  const [sameAsBillingShipping, setSameAsBillingShipping] = useState(false);
  const [getOrderInfoData, setgetOrderInfoData] = useState("");
  // payment information
  const [updatePaymentInformation, setUpdatePaymentInformation] = useState("");
  // Get Shipping and billing address
  const [getShippingBillingAddres, setGetShippingBillingAddres] = useState({});

  const [allAddress, setAllAddress] = useState({});
  // total 
  const [updateTotalInfo, setUpdateTotalInfo] = useState(false);
  // shipping address
  const [isShippingAddressChnaged, setIsShippingAddressChnaged] = useState(false);
  const [shippingFormValues, setShippingFormValues] = useState({
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
    DefaultBilling: "0",
    save_in_address_book: 0,
    customerAddressId: null,
    same_as_billing: "0"
  })
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
  // billing address
  const [isUncheked, setIsUncheked] = useState(false)
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

  // placeorder validations
  const [isValidShippingAddress, setIsValidShippingAddress] = useState(false);
  const [isValidBillingAddress, setIsValidBillingAddress] = useState(false);
  const [isSelectedShippingMethod, setIsSelectedShippingMethod] = useState(false);
  const [isSelectedPaymentMethod, setIsSelectedPaymentMethod] = useState(false);
  const [isHavingPaymentMethod, setIsHavingPaymentMethod] = useState(false);

  // shipping address
  const addNewAddressHandlerShipping = (setOpen, isEditShipping) => {
    var isError = false;
    // first name
    if (!shippingFormValues?.first_name) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Required field."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.first_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Empty spaces are not allowed."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(shippingFormValues?.first_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        first_name: "Name can only contain alphabets."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    }
    // last name
    if (!shippingFormValues?.last_name) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Required field."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.last_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Empty spaces are not allowed."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(shippingFormValues?.last_name)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        last_name: "Name can only contain alphabets."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    }
    // address1
    if (!shippingFormValues?.address1) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        address1: "Required field."
      }))
      document.getElementById("address1")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.address1)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        address1: "Empty spaces are not allowed."
      }))
      document.getElementById("address1")?.focus();
      var isError = true;
    }
    // zip_code
    if (!shippingFormValues?.zip_code) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        zip_code: "Required field."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.zip_code)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        zip_code: "Empty spaces are not allowed."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    }
    // number
    if (!shippingFormValues?.number || !shippingFormValues?.mobile_valid) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        number: "Required field."
      }))
      document.getElementById("number")?.focus();
      var isError = true;
    }
    // country
    if (!shippingFormValues?.country) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        country: "Required field."
      }))
      document.getElementById("country")?.focus();
      var isError = true;
    }
    // state
    if (!shippingFormValues?.state) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        state: "Required field."
      }))
      document.getElementById("state")?.focus();
      var isError = true;
    }
    // city
    if (!shippingFormValues?.city) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        city: "Required field."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isEmptyValue(shippingFormValues?.city)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        city: "Empty spaces are not allowed."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isValidCharacter(shippingFormValues?.city)) {
      setFormErrorShipping((prevState) => ({
        ...prevState,
        city: "Name can only contain alphabets."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      if (isEditShipping) {
        setOpen(false)
      }
      const data = {
        display_country: shippingFormValues?.display_country,
        address1: shippingFormValues?.address1,
        address2: shippingFormValues?.address2 ? shippingFormValues?.address2 : '',
        city: shippingFormValues?.city,
        region_id: shippingFormValues?.state ? shippingFormValues?.state : null,
        region: shippingFormValues?.display_state,
        country_id: shippingFormValues?.country,
        postcode: shippingFormValues?.zip_code,
        firstname: shippingFormValues?.first_name,
        lastname: shippingFormValues?.last_name,
        company: shippingFormValues?.company,
        telephone: shippingFormValues?.number,
      }
      setTimeout(() => {
        getEstimateShipping(token, dispatch, data, setEstimateShippingData, cartId, setEstimateShippingLoader, actionmessage?.isSesstionTimeOut)
      }, 200);

      setShippingInformtionData((prevState) => ({
        ...prevState,
        shipping_address: {
          ...prevState.shipping_address,
          customerAddressId: null,
          countryId: shippingFormValues?.country,
          regionId: shippingFormValues?.state ? shippingFormValues?.state : null,
          regionCode: shippingFormValues?.state ? shippingFormValues.state : null,
          region: shippingFormValues?.display_state,
          street: [
            shippingFormValues?.address1,
            shippingFormValues?.address2 ? shippingFormValues?.address2 : '',
          ],
          company: shippingFormValues?.company,
          telephone: shippingFormValues?.number,
          postcode: shippingFormValues?.zip_code,
          city: shippingFormValues?.city,
          firstname: shippingFormValues?.first_name,
          lastname: shippingFormValues?.last_name,
          email: shippingFormValues.email,
          same_as_billing: (getShippingBillingAddres?.data?.billing_address?.firstname && getShippingBillingAddres?.data?.billing_address?.firstname !== null) ? 0 : 1,
          save_in_address_book: shippingFormValues.save_in_address_book
        },
        address_from: "new"
      }))
    }
  }

  // billing address
  const addNewAddressHandlerBilling = () => {
    var isError = false;
    // first name
    if (!billingFormValues?.first_name) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        first_name: "Required field."
      }))
      document.getElementById("b_first_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(billingFormValues?.first_name)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        first_name: "Empty spaces are not allowed."
      }))
      document.getElementById("b_first_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(billingFormValues?.first_name)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        first_name: "Name can only contain alphabets."
      }))
      document.getElementById("first_name")?.focus();
      var isError = true;
    }
    // last name
    if (!billingFormValues?.last_name) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        last_name: "Required field."
      }))
      document.getElementById("b_last_name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(billingFormValues?.last_name)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        last_name: "Empty spaces are not allowed."
      }))
      document.getElementById("b_last_name")?.focus();
      var isError = true;
    } else if (!isValidCharacter(billingFormValues?.last_name)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        last_name: "Name can only contain alphabets."
      }))
      document.getElementById("last_name")?.focus();
      var isError = true;
    }
    // address1
    if (!billingFormValues?.address1) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        address1: "Required field."
      }))
      document.getElementById("b_address1")?.focus();
      var isError = true;
    } else if (!isEmptyValue(billingFormValues?.address1)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        address1: "Empty spaces are not allowed."
      }))
      document.getElementById("b_address1")?.focus();
      var isError = true;
    }
    // zip_code
    if (!billingFormValues?.zip_code) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        zip_code: "Required field."
      }))
      document.getElementById("b_zip_code")?.focus();
      var isError = true;
    } else if (!isEmptyValue(billingFormValues?.zip_code)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        zip_code: "Empty spaces are not allowed."
      }))
      document.getElementById("b_zip_code")?.focus();
      var isError = true;
    }
    // number
    if (!isEmptyValue(billingFormValues?.number)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        number: "Empty spaces are not allowed."
      }))
      document.getElementById("b_number")?.focus();
      var isError = true;
    }
    if (!billingFormValues?.number?.length || !billingFormValues?.mobile_valid?.length) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        number: "Required field."
      }))
      document.getElementById("b_number")?.focus();
      var isError = true;
    }
    // country
    if (!billingFormValues?.country) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        country: "Required field."
      }))
      document.getElementById("b_country")?.focus();
      var isError = true;
    }
    // state
    if (!billingFormValues?.state) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        state: "Required field."
      }))
      document.getElementById("b_state")?.focus();
      var isError = true;
    }
    // city
    if (!billingFormValues?.city) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        city: "Required field."
      }))
      document.getElementById("b_city")?.focus();
      var isError = true;
    } else if (!isEmptyValue(billingFormValues?.city)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        city: "Empty spaces are not allowed."
      }))
      document.getElementById("b_city")?.focus();
      var isError = true;
    } else if (!isValidCharacter(billingFormValues?.city)) {
      setFormErrorBilling((prevState) => ({
        ...prevState,
        city: "Name can only contain alphabets."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      if (isShippingAddressChnaged) {
        setShippingInformtionData((prevState) => ({
          ...prevState,
          billing_address: {
            ...prevState.billing_address,
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
          }
        }))
        setUpdateShippingInformationById(!updateShippingInformationById)
      } else {
        customerAddBillingAddressAPI(dispatch, token, billingFormValues, cartId, setUpdatePaymentInformation, updatePaymentInformation, setBillingAddressHandlerLoader, actionmessage?.isSesstionTimeOut)
      }
      setIsUncheked(false)
      setIsClickedUpdate(true)
    }
  }

  // same as billing shipping
  const sameAsShippingHandler = (data) => {
    customerAddBillingAddressAPI(dispatch, token, data, cartId, setUpdatePaymentInformation, updatePaymentInformation, setBillingAddressHandlerLoader, actionmessage?.isSesstionTimeOut)
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
  // setEstimate shipping for empty address address
  useEffect(() => {
    if (isGetShippBillLoaded) {
      if (
        (getShippingBillingAddres?.data?.shipping_address?.region == undefined &&
          getShippingBillingAddres?.data?.shipping_address?.postcode == undefined) &&
        !getShippingBillingAddres?.data?.all_address?.length
      ) {
        // if data added from cart or localstorage
        if (
          cartDataAddress?.address?.countryId || cartDataAddress?.address?.display_country ||
          cartDataAddress?.address?.region || cartDataAddress?.address?.postcode ||
          cartDataAddress?.shippingMethod
        ) {
          setEstimateShipping((prevState) => ({
            ...prevState,
            country_id: cartDataAddress?.address?.countryId,
            display_country: cartDataAddress?.address?.display_country,
            region: cartDataAddress?.address?.region,
            region_id: cartDataAddress?.address?.region_id,
            postcode: cartDataAddress?.address?.postcode,
          }))

          setShippingInformtionData((prevState) => ({
            ...prevState,
            shipping_address: {
              ...prevState.shipping_address,
              customerAddressId: null,
              countryId: cartDataAddress?.address?.countryId,
              regionId: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : null,
              regionCode: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : null,
              region: cartDataAddress?.address?.region,
              postcode: cartDataAddress?.address?.postcode,
            },
            billing_address: {
              ...prevState.billing_address,
              customerAddressId: null,
              countryId: cartDataAddress?.address?.countryId
            }
          }))
          setShippingFormValues((prevState) => ({
            ...prevState,
            country: cartDataAddress?.address?.countryId,
            display_country: cartDataAddress?.address?.display_country,
            display_state: cartDataAddress?.address?.region,
            state: cartDataAddress?.address?.region_id,
            regionValues: {
              label: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : "",
              value: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : "",
            },
            zip_code: cartDataAddress?.address?.postcode,
          }))
          setBillingFormValues((prevState) => ({
            ...prevState,
            country: cartDataAddress?.address?.countryId,
            display_country: cartDataAddress?.address?.display_country
          }))
        }
        // if no data is there for shipping
        if (!cartDataAddress?.address?.countryId || cartDataAddress?.address?.countryId == undefined) {
          const defaultCountry = countries?.filter((item) => item?.value == "IN");
          setEstimateShipping((prevState) => ({
            ...prevState,
            country_id: defaultCountry?.[0]?.value,
            display_country: defaultCountry?.[0]?.label,
          }))

          setShippingInformtionData((prevState) => ({
            ...prevState,
            shipping_address: {
              customerAddressId: null,
              countryId: defaultCountry?.[0]?.value
            },
            billing_address: {
              customerAddressId: null,
              countryId: defaultCountry?.[0]?.value
            }
          }))

          setShippingFormValues((prevState) => ({
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
        }
      }
      // if no data is there for billing
      if (!getShippingBillingAddres?.data?.billing_address?.firstname) {
        const defaultCountry = countries?.filter((item) => item?.value == "IN");
        if (
          (getShippingBillingAddres?.data?.shipping_address?.region !== null && getShippingBillingAddres?.data?.shipping_address?.region !== undefined) ||
          (getShippingBillingAddres?.data?.shipping_address?.postcode !== null && getShippingBillingAddres?.data?.shipping_address?.postcode !== undefined)
        ) {
          setBillingFormValues((prevState) => ({
            ...prevState,
            country: getShippingBillingAddres?.data?.shipping_address?.country_id,
            display_country: getShippingBillingAddres?.data?.shipping_address?.country_name
          }))
        } else if (getShippingBillingAddres?.data?.all_address?.length) {
          setBillingFormValues((prevState) => ({
            ...prevState,
            country: getShippingBillingAddres?.data?.all_address?.[0]?.country_id,
            display_country: getShippingBillingAddres?.data?.all_address?.[0]?.country_name
          }))
        } else {
          setBillingFormValues((prevState) => ({
            ...prevState,
            country: defaultCountry?.[0]?.value,
            display_country: defaultCountry?.[0]?.label
          }))
        }
      }
    }
  }, [countries, getShippingBillingAddres, isGetShippBillLoaded])

  // if address is there
  useEffect(() => {
    if (isGetShippBillLoaded) {
      // billing address
      const defaultBilling = getShippingBillingAddres?.data?.all_address?.filter((item) => item?.default_billing == 1);
      if (getShippingBillingAddres?.data?.billing_address?.firstname) {
        setShippingInformtionData((prevState) => ({
          ...prevState,
          billing_address: {
            ...prevState.billing_address,
            customerAddressId: getShippingBillingAddres?.data?.billing_address?.customer_address_id ? getShippingBillingAddres?.data?.billing_address?.customer_address_id : null,
            countryId: getShippingBillingAddres?.data?.billing_address?.country_id,
            regionId: getShippingBillingAddres?.data?.billing_address?.region_id ? getShippingBillingAddres?.data?.billing_address?.region_id : null,
            regionCode: getShippingBillingAddres?.data?.billing_address?.region_id ? getShippingBillingAddres?.data?.billing_address?.region_id : null,
            region: getShippingBillingAddres?.data?.billing_address?.region,
            street: [
              getShippingBillingAddres?.data?.billing_address?.street?.[0],
              getShippingBillingAddres?.data?.billing_address?.street?.[1] ? getShippingBillingAddres?.data?.billing_address?.street?.[1] : '',
            ],
            company: getShippingBillingAddres?.data?.billing_address?.company,
            telephone: getShippingBillingAddres?.data?.billing_address?.telephone,
            postcode: getShippingBillingAddres?.data?.billing_address?.postcode,
            city: getShippingBillingAddres?.data?.billing_address?.city,
            firstname: getShippingBillingAddres?.data?.billing_address?.firstname,
            lastname: getShippingBillingAddres?.data?.billing_address?.lastname,
            saveInAddressBook: getShippingBillingAddres?.data?.billing_address?.save_in_address_book
          }
        }))
      } else if (defaultBilling?.length) {
        setShippingInformtionData((prevState) => ({
          ...prevState,
          billing_address: {
            ...prevState.billing_address,
            customerAddressId: defaultBilling?.[0]?.address_id,
            countryId: defaultBilling?.[0]?.country_id,
            regionId: defaultBilling?.[0]?.region_id ? defaultBilling?.[0]?.region_id : null,
            regionCode: defaultBilling?.[0]?.region_id ? defaultBilling?.[0]?.region_id : null,
            region: defaultBilling?.[0]?.region,
            street: [
              defaultBilling?.[0]?.streetaddress?.[0],
              defaultBilling?.[0]?.streetaddress?.[1] ? defaultBilling?.[0]?.streetaddress?.[1] : '',
            ],
            company: defaultBilling?.[0]?.company,
            telephone: defaultBilling?.[0]?.phone,
            postcode: defaultBilling?.[0]?.zip_code,
            city: defaultBilling?.[0]?.city,
            firstname: defaultBilling?.[0]?.firstname,
            lastname: defaultBilling?.[0]?.lastname,
            saveInAddressBook: 0
          }
        }))
      }
      // shipping address
      if (
        (getShippingBillingAddres?.data?.shipping_address?.region !== null && getShippingBillingAddres?.data?.shipping_address?.region !== undefined) ||
        (getShippingBillingAddres?.data?.shipping_address?.postcode !== null && getShippingBillingAddres?.data?.shipping_address?.postcode !== undefined)
      ) {
        setEstimateShipping((prevState) => ({
          ...prevState,
          display_country: getShippingBillingAddres?.data?.shipping_address?.country_name,
          customer_id: "",
          address1: getShippingBillingAddres?.data?.shipping_address?.street?.[0],
          address2: getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : '',
          city: getShippingBillingAddres?.data?.shipping_address?.city,
          region: getShippingBillingAddres?.data?.shipping_address?.region,
          region_id: getShippingBillingAddres?.data?.shipping_address?.region_id,
          country_id: getShippingBillingAddres?.data?.shipping_address?.country_id,
          postcode: getShippingBillingAddres?.data?.shipping_address?.postcode,
          firstname: getShippingBillingAddres?.data?.shipping_address?.firstname,
          lastname: getShippingBillingAddres?.data?.shipping_address?.lastname,
          company: getShippingBillingAddres?.data?.shipping_address?.company,
          telephone: getShippingBillingAddres?.data?.shipping_address?.telephone,
        }))

        setShippingInformtionData((prevState) => ({
          ...prevState,
          shipping_address: {
            ...prevState.shipping_address,
            customerAddressId: getShippingBillingAddres?.data?.shipping_address?.customer_address_id,
            countryId: getShippingBillingAddres?.data?.shipping_address?.country_id,
            regionId: getShippingBillingAddres?.data?.shipping_address?.region_id ? getShippingBillingAddres?.data?.shipping_address?.region_id : null,
            regionCode: getShippingBillingAddres?.data?.shipping_address?.region_id ? getShippingBillingAddres?.data?.shipping_address?.region_id : null,
            region: getShippingBillingAddres?.data?.shipping_address?.region,
            street: [
              getShippingBillingAddres?.data?.shipping_address?.street?.[0],
              getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : '',
            ],
            company: getShippingBillingAddres?.data?.shipping_address?.company,
            telephone: getShippingBillingAddres?.data?.shipping_address?.telephone,
            postcode: getShippingBillingAddres?.data?.shipping_address?.postcode,
            city: getShippingBillingAddres?.data?.shipping_address?.city,
            firstname: getShippingBillingAddres?.data?.shipping_address?.firstname,
            lastname: getShippingBillingAddres?.data?.shipping_address?.lastname,
            same_as_billing: getShippingBillingAddres?.data?.shipping_address?.same_as_billing,
            save_in_address_book: !getShippingBillingAddres?.data?.all_address?.length ? 1 : getShippingBillingAddres?.data?.shipping_address?.save_in_address_book,
          }
        }))

        setShippingFormValues((prevState) => ({
          ...prevState,
          first_name: getShippingBillingAddres?.data?.shipping_address?.firstname,
          last_name: getShippingBillingAddres?.data?.shipping_address?.lastname,
          address1: getShippingBillingAddres?.data?.shipping_address?.street?.[0],
          address2: getShippingBillingAddres?.data?.shipping_address?.street?.[1],
          country: getShippingBillingAddres?.data?.shipping_address?.country_id,
          display_country: getShippingBillingAddres?.data?.shipping_address?.country_name,
          display_state: getShippingBillingAddres?.data?.shipping_address?.region,
          state: getShippingBillingAddres?.data?.shipping_address?.region_id,
          regionValues: {
            label: getShippingBillingAddres?.data?.shipping_address?.region ? getShippingBillingAddres?.data?.shipping_address?.region : "",
            value: getShippingBillingAddres?.data?.shipping_address?.region_id ? getShippingBillingAddres?.data?.shipping_address?.region_id : "",
          },
          city: getShippingBillingAddres?.data?.shipping_address?.city,
          zip_code: getShippingBillingAddres?.data?.shipping_address?.postcode,
          number: getShippingBillingAddres?.data?.shipping_address?.telephone !== null ? getShippingBillingAddres?.data?.shipping_address?.telephone : '',
          mobile_valid: getShippingBillingAddres?.data?.shipping_address?.telephone !== null ? getShippingBillingAddres?.data?.shipping_address?.telephone : '',
          save_in_address_book: !getShippingBillingAddres?.data?.all_address?.length ? 1 : getShippingBillingAddres?.data?.shipping_address?.save_in_address_book,
          customerAddressId: getShippingBillingAddres?.data?.shipping_address?.customer_address_id,
          same_as_billing: getShippingBillingAddres?.data?.shipping_address?.same_as_billing
        }))
      } else if (getShippingBillingAddres?.data?.all_address?.length) {
        const defaultShipping = getShippingBillingAddres?.data?.all_address?.filter((item) => item?.default_shipping == 1);
        setEstimateShipping((prevState) => ({
          ...prevState,
          display_country: defaultShipping?.[0]?.country_name,
          customer_id: "",
          address1: defaultShipping?.[0]?.streetaddress?.[0],
          address2: defaultShipping?.[0]?.streetaddress?.[1] ? defaultShipping?.[0]?.streetaddress?.[1] : '',
          city: defaultShipping?.[0]?.city,
          region: defaultShipping?.[0]?.region,
          region_id: defaultShipping?.[0]?.region_id,
          country_id: defaultShipping?.[0]?.country_id,
          postcode: defaultShipping?.[0]?.zip_code,
          firstname: defaultShipping?.[0]?.firstname,
          lastname: defaultShipping?.[0]?.lastname,
          company: defaultShipping?.[0]?.company,
          telephone: defaultShipping?.[0]?.phone,
        }))
        setBillingFormValues((prevState) => ({
          ...prevState,
          country: defaultShipping?.[0]?.country_id,
          display_country: defaultShipping?.[0]?.country_name,
        }))

        setShippingFormValues((prevState) => ({
          ...prevState,
          country: defaultShipping?.[0]?.country_id,
          display_country: defaultShipping?.[0]?.country_name,
        }))

        setShippingInformtionData((prevState) => ({
          ...prevState,
          shipping_address: {
            ...prevState.shipping_address,
            customerAddressId: defaultShipping?.[0]?.address_id,
            countryId: defaultShipping?.[0]?.country_id,
            regionId: defaultShipping?.[0]?.region_id ? defaultShipping?.[0]?.region_id : null,
            regionCode: defaultShipping?.[0]?.region_id ? defaultShipping?.[0]?.region_id : null,
            region: defaultShipping?.[0]?.region,
            street: [
              defaultShipping?.[0]?.streetaddress?.[0],
              defaultShipping?.[0]?.streetaddress?.[1] ? defaultShipping?.[0]?.streetaddress?.[1] : '',
            ],
            company: defaultShipping?.[0]?.company,
            telephone: defaultShipping?.[0]?.telephone,
            postcode: defaultShipping?.[0]?.postcode,
            city: defaultShipping?.[0]?.city,
            firstname: defaultShipping?.[0]?.firstname,
            lastname: defaultShipping?.[0]?.lastname,
            save_in_address_book: 0,
            same_as_billing: defaultShipping?.[0]?.same_as_billing,
          }
        }))
      }
    }
  }, [getShippingBillingAddres, countries, isGetShippBillLoaded]);

  useEffect(() => {
    if (isGetShippBillLoaded) {
      if (
        getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null &&
        getShippingBillingAddres?.data?.all_address?.length
      ) {
        customerEstimateShippingById(
          dispatch, token, getShippingBillingAddres?.data?.shipping_address?.customer_address_id, setEstimateShippingData,
          setEstimateShippingLoader, setUpdateShippingInformationById, updateShippingInformationById, actionmessage?.isSesstionTimeOut
        );
      } else if (getShippingBillingAddres?.data?.all_address?.length) {
        const defaultShipping = getShippingBillingAddres?.data?.all_address?.filter((item) => item?.default_shipping == 1);
        customerEstimateShippingById(
          dispatch, token, defaultShipping?.[0]?.address_id, setEstimateShippingData,
          setEstimateShippingLoader, setUpdateShippingInformationById, updateShippingInformationById, actionmessage?.isSesstionTimeOut
        );
      } else {
        if (cartId !== null && cartId !== undefined && estimateShipping?.country_id) {
          getEstimateShipping(token, dispatch, estimateShipping, setEstimateShippingData, cartId, setEstimateShippingLoader, actionmessage?.isSesstionTimeOut)
        }
      }
    }
  }, [
    estimateShipping?.country_id, cartId, updateEstimateShipping, updateShippingMethod, isGetShippBillLoaded
  ]);
  useEffect(() => {
    if (isGetShippBillLoaded) {
      setTimeout(() => {
        shippingInformation(token, dispatch, shippingInformtionData, setPaymentInfoData, setShippingInforLoader, actionmessage?.isSesstionTimeOut)
      }, 300);
    }
  }, [
    shippingInformtionData?.shipping_method_code, shippingInformtionData?.shipping_address?.countryId,
    estimateShippingData, updateShippingInformationById,
    isGetShippBillLoaded
  ])
  // set payment method
  useEffect(() => {
    if (isGetShippBillLoaded) {
      if (selectPaymentMethod) {
        customerSetPaymentInformation(dispatch, token, selectPaymentMethod, cartId, updateTotalInfo, setUpdateTotalInfo, setSetPaymentInformationLoader, actionmessage?.isSesstionTimeOut)
      }
    }
  }, [selectPaymentMethod, updatePaymentInformation, paymentInfoData, isGetShippBillLoaded]);
  // cart summmary total
  useEffect(() => {
    customerTotalCartCheckout(dispatch, token, setCartSummaryDetails, setTotalLoader, actionmessage?.isSesstionTimeOut)
  }, [updateTotalInfo, paymentInfoData]);
  // customer Get Shipping and billing address
  useEffect(() => {
    customerGetShippingBillingAddres(dispatch, token, setGetShippingBillingAddres, setEstimateShipping, setetBillingShippingAddressLoader,
      setIsGetShippBillLoaded, isGetShippBillLoaded, actionmessage?.isSesstionTimeOut
    );
  }, [paymentInfoData, updatePaymentInformation]);
  // focusout
  useEffect(() => {
    if (shippingInforLoader || estimateShippingLoader) {
      document.getElementById('zip_code')?.blur();
      document.getElementById("number")?.blur();
    }
  }, [shippingInforLoader, estimateShippingLoader])
  // create order
  useEffect(() => {
    if (customerSameAsShipping) {
      setCreateOrderInfo((prevState) => ({
        ...prevState,
        cartId: cartId,
        email: getShippingBillingAddres?.data?.shipping_address?.email,
        paymentMethod: {
          method: selectPaymentMethod
        },
        billing_address: {
          region: getShippingBillingAddres?.data?.shipping_address?.region ? getShippingBillingAddres?.data?.shipping_address?.region : shippingFormValues?.display_state,
          region_id: getShippingBillingAddres?.data?.shipping_address?.region_id ? getShippingBillingAddres?.data?.shipping_address?.region_id : shippingFormValues?.state,
          region_code: "",
          country_id: getShippingBillingAddres?.data?.shipping_address?.country_id ? getShippingBillingAddres?.data?.shipping_address?.country_id : shippingFormValues?.country,
          street: [
            getShippingBillingAddres?.data?.shipping_address?.street?.[0] ? getShippingBillingAddres?.data?.shipping_address?.street?.[0] : shippingFormValues?.address1,
            getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : shippingFormValues?.address2
          ],
          postcode: getShippingBillingAddres?.data?.shipping_address?.postcode ? getShippingBillingAddres?.data?.shipping_address?.postcode : shippingFormValues?.zip_code,
          city: getShippingBillingAddres?.data?.shipping_address?.city ? getShippingBillingAddres?.data?.shipping_address?.city : shippingFormValues?.city,
          firstname: getShippingBillingAddres?.data?.shipping_address?.firstname ? getShippingBillingAddres?.data?.shipping_address?.firstname : shippingFormValues?.first_name,
          lastname: getShippingBillingAddres?.data?.shipping_address?.lastname ? getShippingBillingAddres?.data?.shipping_address?.lastname : shippingFormValues?.last_name,
          email: getShippingBillingAddres?.data?.shipping_address?.email,
          telephone: getShippingBillingAddres?.data?.shipping_address?.telephone ? getShippingBillingAddres?.data?.shipping_address?.telephone : shippingFormValues?.number,
          saveInAddressBook: 0
        }
      }))
    } else {
      setCreateOrderInfo((prevState) => ({
        ...prevState,
        cartId: cartId,
        email: getShippingBillingAddres?.data?.shipping_address?.email,
        paymentMethod: {
          method: selectPaymentMethod
        },
        billing_address: {
          region: getShippingBillingAddres?.data?.billing_address?.region,
          region_id: getShippingBillingAddres?.data?.billing_address?.region_id,
          region_code: "",
          country_id: getShippingBillingAddres?.data?.billing_address?.country_id,
          street: [
            getShippingBillingAddres?.data?.billing_address?.street?.[0],
            getShippingBillingAddres?.data?.billing_address?.street?.[1] ? getShippingBillingAddres?.data?.billing_address?.street?.[1] : ""
          ],
          postcode: getShippingBillingAddres?.data?.billing_address?.postcode,
          city: getShippingBillingAddres?.data?.billing_address?.city,
          firstname: getShippingBillingAddres?.data?.billing_address?.firstname,
          lastname: getShippingBillingAddres?.data?.billing_address?.lastname,
          email: getShippingBillingAddres?.data?.billing_address?.email,
          telephone: getShippingBillingAddres?.data?.billing_address?.telephone,
          saveInAddressBook: getShippingBillingAddres?.data?.billing_address?.save_in_address_book
        }
      }))
    }
  }, [getShippingBillingAddres, cartId, selectPaymentMethod, customerSameAsShipping, shippingFormValues]);

  // sameasBillingShipping
  useEffect(() => {
    setIsShippingAddressChnaged(false);
    if (isGetShippBillLoaded) {
      if (customerSameAsShipping) {
        dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
      } else {
        if (
          !getShippingBillingAddres?.data?.all_address?.length &&
          getShippingBillingAddres?.data?.shipping_address?.firstname == null &&
          getShippingBillingAddres?.data?.billing_address?.firstname == null
        ) {
          dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
        } else if (
          getShippingBillingAddres?.data?.shipping_address?.firstname !== null &&
          getShippingBillingAddres?.data?.billing_address?.firstname == null
        ) {
          dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
        } else if (getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null &&
          getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null
        ) {
          if (
            getShippingBillingAddres?.data?.shipping_address?.customer_address_id ==
            getShippingBillingAddres?.data?.billing_address?.customer_address_id
          ) {
            dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
          }
        } else {
          dispatch(ACTION_CUSTOMERSAMEASSHIPPING(false))
        }
      }
    }
  }, [getShippingBillingAddres])

  // place order validations
  useEffect(() => {
    if (
      getShippingBillingAddres?.data?.shipping_address?.firstname !== null &&
      getShippingBillingAddres?.data?.shipping_address?.lastname !== null &&
      getShippingBillingAddres?.data?.shipping_address?.street?.[0] !== null &&
      getShippingBillingAddres?.data?.shipping_address?.street?.[0] !== '' &&
      getShippingBillingAddres?.data?.shipping_address?.country_id !== null &&
      getShippingBillingAddres?.data?.shipping_address?.country_name !== null &&
      getShippingBillingAddres?.data?.shipping_address?.region !== null &&
      getShippingBillingAddres?.data?.shipping_address?.region_id !== null &&
      getShippingBillingAddres?.data?.shipping_address?.city !== null &&
      getShippingBillingAddres?.data?.shipping_address?.postcode !== null &&
      getShippingBillingAddres?.data?.shipping_address?.telephone !== null &&
      getShippingBillingAddres?.data?.shipping_address?.telephone
    ) {
      setIsValidShippingAddress(true)
    } else {
      setIsValidShippingAddress(false)
    }
    if (getShippingBillingAddres?.data?.billing_address?.firstname) {
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
  }, [getShippingBillingAddres, paymentInfoData, cartDataAddress, selectPaymentMethod])
  useEffect(() => {
    if (
      shippingFormValues?.first_name &&
      shippingFormValues?.last_name &&
      shippingFormValues?.address1 &&
      shippingFormValues?.country &&
      shippingFormValues?.display_country &&
      shippingFormValues?.state &&
      shippingFormValues?.display_state &&
      shippingFormValues?.city &&
      shippingFormValues?.zip_code &&
      shippingFormValues?.number
    ) {
      setIsValidShippingAddress(true)
    } else {
      setIsValidShippingAddress(false)
    }
  }, [shippingFormValues])
  // newaddress
  useEffect(() => {
    setGetNewAddresses(false)
  }, [location])
  return (
    <>
      <Stack className='checkout_container_section'>
        <Stack className='checkout_container'>
          <Stack className='checkout_title_signin_section'>
            <Stack className='checkout_title_section'>
              <Typography className='title' variant='h3'>Express Checkout</Typography>
              <Typography className='subtitle' variant='span'>Please enter your details below to complete your purchase.</Typography>
            </Stack>
          </Stack>
          <Stack className='checkout_container_grid'>

            <Stack className='checkouk_grid_section shipping-signin-section'>
              <Stack className='shipping-address-sign-content'>
                <ShippingAddress
                  shippingFormValues={shippingFormValues}
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
              </Stack>

            </Stack>
            <Stack className='checkouk_grid_section'>
              <Stack className='shipping-payment-section'>
                <ShippingMethod
                  estimateShippingData={estimateShippingData}
                  setShippingInformtionData={setShippingInformtionData}
                  shippingFormValues={shippingFormValues}
                  getShippingBillingAddres={getShippingBillingAddres}
                />
                <PaymentMethod
                  billingFormValues={billingFormValues}
                  setBillingFormValues={setBillingFormValues}
                  formErrorBilling={formErrorBilling}
                  setFormErrorBilling={setFormErrorBilling}
                  addNewAddressHandlerBilling={addNewAddressHandlerBilling}
                  paymentInfoData={paymentInfoData}
                  selectPaymentMethod={selectPaymentMethod}
                  setSelectPaymentMethod={setSelectPaymentMethod}
                  allAddress={allAddress}
                  getShippingBillingAddres={getShippingBillingAddres}
                  // disable placeorder
                  setDisablePlaceOrder={setDisablePlaceOrder}
                  disablePlaceOrder={disablePlaceOrder}
                  // same as billing shipping
                  sameAsShippingHandler={sameAsShippingHandler}
                  // Paymentupdate
                  isClickedUpdate={isClickedUpdate}
                  setIsClickedUpdate={setIsClickedUpdate}
                  isUncheked={isUncheked}
                  setIsUncheked={setIsUncheked}
                />
              </Stack>
            </Stack>
            <Stack className='checkouk_grid_section summary-section'>
              <Stack className='summary-sectiont-content'>
                <Summary
                  cartSummaryDetails={cartSummaryDetails}
                  updateTotalInfo={updateTotalInfo}
                  setUpdateTotalInfo={setUpdateTotalInfo}
                  addNewAddressHandlerShipping={addNewAddressHandlerShipping}
                  addNewAddressHandlerBilling={addNewAddressHandlerBilling}
                  // createOrderInfo
                  createOrderInfo={createOrderInfo}
                  setCreateOrderInfo={setCreateOrderInfo}
                  // Address
                  getShippingBillingAddres={getShippingBillingAddres}
                  // validations
                  isValidShippingAddress={isValidShippingAddress}
                  isValidBillingAddress={isValidBillingAddress}
                  isSelectedShippingMethod={isSelectedShippingMethod}
                  isSelectedPaymentMethod={isSelectedPaymentMethod}
                  isHavingPaymentMethod={isHavingPaymentMethod}
                  sameAsBillingShipping={sameAsBillingShipping}
                  // allAddress
                  allAddress={allAddress}
                  // disable placeorder
                  disablePlaceOrder={disablePlaceOrder}
                  setgetOrderInfoData={setgetOrderInfoData}
                  // placeorder button
                  shippingInformtionData={shippingInformtionData}
                  selectPaymentMethod={selectPaymentMethod}
                  isShippingAddressChnaged={isShippingAddressChnaged}
                  setIsShippingAddressChnaged={setIsShippingAddressChnaged}
                  // shippingBilling
                  setGetShippingBillingAddres={setGetShippingBillingAddres}
                  getNewAddresses={getNewAddresses}
                  setGetNewAddresses={setGetNewAddresses}
                  shippingFormValues={shippingFormValues}
                />
              </Stack>

            </Stack>

          </Stack>
        </Stack>
      </Stack>
      {
        billingAddressHandlerLoader && <Pageloader />
      }
      {
        getBillingShippingAddressLoader && <Pageloader />
      }
      {
        shippingInforLoader && <Pageloader />
      }
      {
        estimateShippingLoader && <Pageloader />
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
