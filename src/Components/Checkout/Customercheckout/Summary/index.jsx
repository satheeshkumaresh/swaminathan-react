import React, { useState, useEffect } from 'react';
import "./styles.scss";
import { Link, useNavigate } from 'react-router-dom';
import {
  Stack, Box,
  Typography, TextField, Button
} from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import CouponInvalid from '../../../../Assets/Checkout/CouponInvalid.svg';
import MarkIcon from '../../../../Assets/Checkout/markicon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency, pressEnterCallFunction, isEmptyValue, baseDomainChanges } from "../../../../Utilities/Utilities";
import {
  ACTION_PAGEMESSAGE, getCustomerQuoteId, ACTION_PAGELOADER, SessionExpiredLogout,
  ACTION_CUSTOMERSAMEASSHIPPING, ACTION_CARTDATA_ADDRESS, ACTION_IS_ORDER_COMPLETE
} from "../../../../Store/action";
import {
  customerPlaceOrder, customerResetCart,
  customerCartApplyCoupon, customerCartRemoveCoupon,
  razorpayPaymentDetails, createRazorpayOrderId,
  createOrder
} from "../APIList";
import useRazorpay from "react-razorpay";
import logo from '../../../../Assets/header/logo.png';
import { baseUrl } from '../../../../Utilities/Constant';
import axios from "axios";

const Index = ({
  cartSummaryDetails, updateTotalInfo, setUpdateTotalInfo,
  addNewAddressHandlerShipping, addNewAddressHandlerBilling,
  createOrderInfo, setCreateOrderInfo, getShippingBillingAddres, isValidShippingAddress, isValidBillingAddress,
  isSelectedShippingMethod, isSelectedPaymentMethod, isHavingPaymentMethod,
  allAddress, disablePlaceOrder, setgetOrderInfoData, shippingInformtionData, selectPaymentMethod,
  isShippingAddressChnaged, setIsShippingAddressChnaged, setGetShippingBillingAddres,
  getNewAddresses, setGetNewAddresses, shippingFormValues
}) => {
  const fav = "./favicon.ico";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Razorpay = useRazorpay();
  const {
    miniCartDataItems, token,
    customerSameAsShipping, actionmessage, selectedPaymentMethod
  } = useSelector(state => {
    return {
      miniCartDataItems: state?.miniCartDetails?.data,
      token: state?.token,
      customerSameAsShipping: state?.customerSameAsShipping,
      actionmessage: state?.actionmessage,
      selectedPaymentMethod: state?.selectedPaymentMethod
    }
  })
  const rzpKeyId = process.env.REACT_APP_RAZORPAY_KEY_LIVE;
  // purposely commented
  // const rzpKeyId = baseDomainChanges === "https://www.sriswaminathan.com" ? process.env.REACT_APP_RAZORPAY_KEY_LIVE : process.env.REACT_APP_RAZORPAY_KEY;
  const [cartId, setCartId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeError, setCouponCodeError] = useState("");
  const [rotateCoupon, setRotateCoupon] = useState(false);
  const [couponData, setCouponData] = useState({});
  const [isPlaceOrderClicked, setIsPlaceOrderClicked] = useState(false);
  const [razorpayOpen, setRazorPayOpen] = useState(false);
  const [razorpayOptions, setRazorPayOptions] = useState({});

  const applyCoupon = () => {
    customerCartApplyCoupon(token, dispatch, cartId, couponCode, setRotateCoupon, setCouponData,
      setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'checkout', actionmessage?.isSesstionTimeOut
    )
  }
  const removeCoupon = () => {
    customerCartRemoveCoupon(
      token, dispatch, cartId, couponCode, setRotateCoupon, setCouponData,
      setCouponCode, setUpdateTotalInfo, updateTotalInfo, 'checkout', actionmessage?.isSesstionTimeOut
    )
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
      if (cartSummaryDetails?.data?.total?.coupon_code) {
        removeCoupon();
      } else {
        applyCoupon();
      }
    }
  }
  const handlePayment = async () => {
    const backend_orderId = await createOrder(token, dispatch, createOrderInfo, setgetOrderInfoData, actionmessage?.isSesstionTimeOut);
    dispatch(ACTION_IS_ORDER_COMPLETE({
      orderId: backend_orderId !== "failed" ? backend_orderId : "",
      isCancel: true
    }));
    const rzp_orderId = await createRazorpayOrderId(token, dispatch, backend_orderId, actionmessage?.isSesstionTimeOut);
    const options = {
      key: rzpKeyId,
      timeout: 300,
      amount: rzp_orderId?.amount,
      currency: rzp_orderId?.currency,
      name: "Sri Swaminathan & Co.",
      description: "Test Transaction",
      image: fav,
      order_id: rzp_orderId?.rzp_order_id,
      handler: function (response) {
        setRazorPayOptions({});
        setRazorPayOpen(false);
        dispatch(ACTION_IS_ORDER_COMPLETE({
          orderId: "",
          isCancel: false
        }));
        razorpayPaymentDetails(token, dispatch, backend_orderId, response, getShippingBillingAddres, navigate, actionmessage?.isSesstionTimeOut,cartSummaryDetails?.data)
      },
      prefill: {
        name: createOrderInfo?.billing_address?.firstname,
        email: createOrderInfo?.billing_address?.email,
        contact: createOrderInfo?.billing_address?.telephone,
      },
      notes: {
        merchant_order_id: rzp_orderId?.order_id,
      },
      modal: {
        ondismiss: function () {
          setRazorPayOptions({});
          setRazorPayOpen(false);
          dispatch(ACTION_IS_ORDER_COMPLETE({
            orderId: "",
            isCancel: false
          }));
          customerResetCart(token, dispatch, backend_orderId !== "failed" ? backend_orderId : "", actionmessage?.isSesstionTimeOut)
          setGetNewAddresses(false)
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    setRazorPayOpen(true);
    setRazorPayOptions(options);
    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      console.log(response.error, "response.error.code")
    });
    if (backend_orderId !== "failed") {
      rzp1.open();
    }
  };
  const handlePaymentNew = async (getNewAddress, newCreateOrderInfo) => {
    const backend_orderId = await createOrder(token, dispatch, newCreateOrderInfo, setgetOrderInfoData);
    dispatch(ACTION_IS_ORDER_COMPLETE({
      orderId: backend_orderId !== "failed" ? backend_orderId : "",
      isCancel: true
    }));
    const rzp_orderId = await createRazorpayOrderId(token, dispatch, backend_orderId);
    const options = {
      key: rzpKeyId,
      timeout: 300,
      amount: rzp_orderId?.amount,
      currency: rzp_orderId?.currency,
      name: "Sri Swaminathan & Co.",
      description: "Test Transaction",
      image: fav,
      order_id: rzp_orderId?.rzp_order_id,
      handler: function (response) {
        setRazorPayOptions({});
        setRazorPayOpen(false);
        dispatch(ACTION_IS_ORDER_COMPLETE({
          orderId: "",
          isCancel: false
        }));
        razorpayPaymentDetails(token, dispatch, backend_orderId, response, getNewAddress, navigate, actionmessage?.isSesstionTimeOut,cartSummaryDetails?.data)
      },
      prefill: {
        name: createOrderInfo?.billing_address?.firstname,
        email: createOrderInfo?.billing_address?.email,
        contact: createOrderInfo?.billing_address?.telephone,
      },
      notes: {
        merchant_order_id: rzp_orderId?.order_id,
      },
      modal: {
        ondismiss: function () {
          setRazorPayOptions({});
          setRazorPayOpen(false);
          dispatch(ACTION_IS_ORDER_COMPLETE({
            orderId: "",
            isCancel: false
          }));
          customerResetCart(token, dispatch, backend_orderId !== "failed" ? backend_orderId : "", actionmessage?.isSesstionTimeOut)
          setGetNewAddresses(false)
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    setRazorPayOpen(true);
    setRazorPayOptions(options);
    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      console.log(response.error, "response.error.code")
    });
    if (backend_orderId !== "failed") {
      rzp1.open();
    }
  };

  // cash ON delivery
  const handlePaymentCash = async () => {
    dispatch(ACTION_PAGELOADER(true));
    try {
      const Response = await axios.post(
        `${baseUrl()}carts/mine/payment-information`,
        createOrderInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      dispatch(ACTION_PAGELOADER(false));
      setgetOrderInfoData(Response?.data)
      if (Response?.data) {
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
        if (!actionmessage?.isSesstionTimeOut) {
          getCustomerQuoteId(dispatch, token, false)
        }
        navigate('/ordersuccess', {
          state: {
            orderid: Response?.data,
            productDetails:cartSummaryDetails?.data,
            userDetails:createOrderInfo,
            info: "order"
          }
        })
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
      dispatch(ACTION_PAGELOADER(false));
      if (err?.response?.status == 401 && !actionmessage?.isSesstionTimeOut) {
        SessionExpiredLogout(dispatch)
      }
      console.log("Error", err)
    }
  }

  const handlerPlaceOrder = () => {
    var isError = false;
    if (!isValidShippingAddress) {
      var isError = true;
      setIsPlaceOrderClicked(false)
      addNewAddressHandlerShipping()
      return
    }
    // billing address validation
    if (!customerSameAsShipping) {
      if (!isValidBillingAddress) {
        var isError = true;
        setIsPlaceOrderClicked(false)
        addNewAddressHandlerBilling()
      }
    }
    // selectedShippingMethod validation 
    if (isValidBillingAddress && isValidShippingAddress) {
      if (!isSelectedShippingMethod) {
        var isError = true;
        setIsPlaceOrderClicked(false)
        dispatch(ACTION_PAGEMESSAGE({
          show: true,
          isSuccess: false,
          isError: true,
          isWarning: false,
          message: "The shipping method is missing. Select the shipping method and try again.",
          showFor: ""
        }))
        return
      }
    }
    // isHavingPaymentMethod validation
    if (isSelectedShippingMethod) {
      if (!isHavingPaymentMethod) {
        var isError = true;
        setIsPlaceOrderClicked(false)
        dispatch(ACTION_PAGEMESSAGE({
          show: true,
          isSuccess: false,
          isError: true,
          isWarning: false,
          message: "The payment method is missing. Select the shipping method to get payment method and try again.",
          showFor: ""
        }))
        return
      }
    }
    // isSelectedPaymentMethod 
    if (isHavingPaymentMethod) {
      if (!isSelectedPaymentMethod) {
        var isError = true;
        setIsPlaceOrderClicked(false)
        dispatch(ACTION_PAGEMESSAGE({
          show: true,
          isSuccess: false,
          isError: true,
          isWarning: false,
          message: "The payment method is missing. Select the payment method and try again.",
          showFor: ""
        }))
        return
      }
    }
    // Final valiation
    if (!isError) {
      setIsPlaceOrderClicked(true)
    }
  }
  const placeOrderHandler = () => {
    if (isValidShippingAddress && isShippingAddressChnaged) {
      var isError = false;
      // billing address validation
      if (!customerSameAsShipping) {
        if (!isValidBillingAddress) {
          var isError = true;
          setIsPlaceOrderClicked(false)
          addNewAddressHandlerBilling()
        }
      }
      // selectedShippingMethod validation 
      if (isValidBillingAddress && isValidShippingAddress) {
        if (!isSelectedShippingMethod) {
          var isError = true;
          setIsPlaceOrderClicked(false)
          dispatch(ACTION_PAGEMESSAGE({
            show: true,
            isSuccess: false,
            isError: true,
            isWarning: false,
            message: "The shipping method is missing. Select the shipping method and try again.",
            showFor: ""
          }))
        }
      }
      // isHavingPaymentMethod validation
      if (isSelectedShippingMethod) {
        if (!isHavingPaymentMethod) {
          var isError = true;
          setIsPlaceOrderClicked(false)
          dispatch(ACTION_PAGEMESSAGE({
            show: true,
            isSuccess: false,
            isError: true,
            isWarning: false,
            message: "The payment method is missing. Select the shipping method to get payment method and try again.",
            showFor: ""
          }))
          return
        }
      }
      // isSelectedPaymentMethod 
      if (isHavingPaymentMethod) {
        if (!isSelectedPaymentMethod) {
          var isError = true;
          setIsPlaceOrderClicked(false)
          dispatch(ACTION_PAGEMESSAGE({
            show: true,
            isSuccess: false,
            isError: true,
            isWarning: false,
            message: "The payment method is missing. Select the payment method and try again.",
            showFor: ""
          }))
          return
        }
      }
      // Final valiation
      if (!isError) {
        if (selectedPaymentMethod === "cashondelivery") {
          customerPlaceOrder(token, dispatch, shippingInformtionData, selectPaymentMethod, setIsShippingAddressChnaged, handlePaymentCash, setGetShippingBillingAddres, setGetNewAddresses, setCreateOrderInfo, customerSameAsShipping, cartId, shippingFormValues, actionmessage?.isSesstionTimeOut)
        } else {
          customerPlaceOrder(token, dispatch, shippingInformtionData, selectPaymentMethod, setIsShippingAddressChnaged, handlePaymentNew, setGetShippingBillingAddres, setGetNewAddresses, setCreateOrderInfo, customerSameAsShipping, cartId, shippingFormValues, actionmessage?.isSesstionTimeOut)
        }
      }
    } else {
      handlerPlaceOrder()
    }
  }
  // max amount restriction
  useEffect(() => {
    if (cartSummaryDetails?.data?.total?.total_segments?.maximum_order_amount?.error_message) {
      navigate("/mycart")
    }
  }, [cartSummaryDetails])
  useEffect(() => {
    if (isPlaceOrderClicked) {
      if (selectedPaymentMethod === "cashondelivery") {
        handlePaymentCash()
      } else {
        handlePayment()
      }
      setTimeout(() => {
        setIsPlaceOrderClicked(false);
      }, 500)
    }
  }, [isPlaceOrderClicked])
  useEffect(() => {
    if (cartSummaryDetails?.data?.total?.coupon_code) {
      setCouponCode(cartSummaryDetails?.data?.total?.coupon_code)
    }
  }, [cartSummaryDetails?.data?.total?.coupon_code])
  useEffect(() => {
    setCartId(miniCartDataItems?.[0]?.quote_id)
  }, [miniCartDataItems]);

  // Resetcart for back button
  useEffect(() => {
    return () => {
      // reset cart after page refresh && browser back and forward
      const rzp1 = razorpayOpen ? new Razorpay(razorpayOptions) : {};
      if (razorpayOpen) {
        rzp1?.close();
      }
      setRazorPayOpen(false);
      setRazorPayOptions({});
    }
  }, [])
  return (
    <Stack className='summary-info-section'>
      <Stack className="summary-title">
        <Typography className='title' variant='h4'>Summary</Typography>
      </Stack>

      <Stack className='summary-count'>
        <Typography variant='span' class="count-info">{cartSummaryDetails?.data?.total?.items_qty == undefined ? 0 : cartSummaryDetails?.data?.total?.items_qty} Item(s) in cart</Typography>
      </Stack>

      <Stack className='summary-content'>
        {cartSummaryDetails?.data?.total?.items?.map((item, ind) => {
          return (

            <Stack className="summary_container" key={ind}>
              <Stack className="product_item_info_img">
                <Stack className="img_block">
                  <Link className='img_block' to={`/${item?.product_url}`}>
                    <img src={item?.product_image} alt="" tile='...' />
                  </Link>
                </Stack>
              </Stack>
              <Stack className="product_item_info_section">
                <Typography variant='span' className='product-name data-value'>
                  <Link to={`/${item?.product_url}`}>{item?.name}</Link>
                </Typography>
                <Typography variant='span' className="mobileprice-section">
                  {formatCurrency?.format(item?.special_price ? item?.special_price : item?.price)}
                </Typography>

                {
                  item?.color ?
                    <Box className='product-color data-value'>
                      <Typography variant='span' className='data'>Color: </Typography>
                      <Typography variant='span' className='value'>{item?.color}</Typography>
                    </Box>
                    : ''
                }
                {
                  item?.weight_in_kg ?
                    <Box className='product-size data-value'>
                      <Typography variant='span' className='data'>Weight (Kg): </Typography>
                      <Typography variant='span' className='value'>{item?.weight_in_kg}</Typography>
                    </Box>
                    : ''
                }
                {
                  item?.qty ?
                    <Box className='product-size data-value'>
                      <Typography variant='span' className='data'>Qty: </Typography>
                      <Typography variant='span' className='value'>{item?.qty}</Typography>
                    </Box>
                    : ''
                }
              </Stack>
            </Stack>
          )
        })}

        <Stack className='checkout-coupon-info'>
          <Stack className='coupon  common_button_block common_input_block'>
            <Typography variant='p' className='discount-coupon-text'>Do you have a discount coupon? Enter it here</Typography>
            <Stack className={`checkout-coupon-apply ${cartSummaryDetails?.coupon_code ? 'applied coupon-applied' : ''}`}>
              <Stack className={`input-block common_input_block_section`}>
                <TextField
                  id="coupon"
                  variant="outlined"
                  fullWidth
                  className=''
                  placeholder='Enter discount coupon'
                  disabled={cartSummaryDetails?.data?.total?.coupon_code ? true : false}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value)
                    setCouponCodeError("")
                  }}
                  onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                />
                {
                  cartSummaryDetails?.data?.total?.coupon_code ?
                    <Typography className='applied-icon' variant='span'>
                      <img src={MarkIcon} alt="" tile='...' />

                    </Typography>
                    : ''
                }
                {
                  couponData?.code == 400 ?
                    <Typography className='applied-icon' variant='span'>
                      <img src={CouponInvalid} alt="" tile='...' />

                    </Typography> : ''
                }
                {
                  couponCodeError ? <Typography className='coupon-Code-Error'>{couponCodeError}</Typography> : ''
                }

              </Stack>
              <Button
                className={`coupon_secton_btn discount-btn-section ${couponCode ? 'secondary_default_btn' : 'primary_default_btn'}`}
                fullWidth
                onClick={handleSubmit}
                startIcon={rotateCoupon === true ? <LoopIcon /> : ""}
                disabled={rotateCoupon === true || !couponCode ? true : false}
                sx={{
                  pointerEvents: !miniCartDataItems?.length ? 'none' : ''
                }}
              >{cartSummaryDetails?.data?.total?.coupon_code ? 'Delete Coupon' : 'Apply Coupon'}</Button>
            </Stack>
            {
              cartSummaryDetails?.data?.total?.coupon_code ?
                <Stack className='checkout-coupon-apply applied'>
                  <Typography className='applied-msg'>The coupon code has been applied.</Typography>
                </Stack>
                : ''
            }
            {
              couponData?.code == 400 ?
                <Stack className='checkout-coupon-apply applied'>
                  <Typography className='applied-msg invalid'>{couponData?.message}</Typography>
                </Stack>
                : ''
            }
          </Stack>
        </Stack>

        <Box className='additional-charges'>
          {
            cartSummaryDetails?.data?.total?.subtotal ?
              <Stack className='shipping stack-layout gap_below'>
                <Typography>Subtotal</Typography>
                <Typography>{formatCurrency?.format(cartSummaryDetails?.data?.total?.subtotal)}</Typography>
              </Stack>
              : ''
          }
          {
            cartSummaryDetails?.data?.total?.total_segments?.shipping?.title ?
              <Stack className='shipping stack-layout gap_below'>
                <Typography>{cartSummaryDetails?.data?.total?.total_segments?.shipping?.title}</Typography>
                <Typography>{formatCurrency?.format(cartSummaryDetails?.data?.total?.total_segments?.shipping?.value)}</Typography>
              </Stack>
              : ''
          }
          <Stack className='tax stack-layout gap_below'>
            <Typography>Tax</Typography>
            <Typography>{formatCurrency?.format(cartSummaryDetails?.data?.total?.total_segments?.tax?.value)}</Typography>
          </Stack>
          <Stack className='shipping stack-layout gap_below'>
            <Typography>Discount {cartSummaryDetails?.data?.total?.coupon_code ? `(${cartSummaryDetails?.data?.total?.coupon_code})` : ''}</Typography>
            <Typography>{formatCurrency?.format(cartSummaryDetails?.data?.total?.discount_amount)}</Typography>
          </Stack>
        </Box>
        <Stack className='total-amount stack-layout'>
          <Typography>Total</Typography>
          <Typography className='price'>{formatCurrency?.format(cartSummaryDetails?.data?.total?.total_segments?.grand_total?.value)}</Typography>
        </Stack>
        <Stack className='payment-button-section'>
          <Button
            className='primary_default_btn'
            disabled={disablePlaceOrder ? true : false}
            onClick={() => placeOrderHandler()}
          >Place Order</Button>
        </Stack>

      </Stack>

    </Stack>
  )
}

export default Index;
