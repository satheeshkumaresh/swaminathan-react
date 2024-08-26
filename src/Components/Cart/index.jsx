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

// Store data
import { useSelector, useDispatch } from 'react-redux';
import {
  ACTION_ESTIMATESHIPPINGMETHOD,
  ACTION_CARTDATA_ADDRESS, ACTION_GUESTSHIPPING, ACTION_PAGEMESSAGE
}
  from "../../Store/action";
import {
  cartSummary, guestCartSummary, GuestCartApplyCoupon,
  customerCartApplyCoupon, customerCartRemoveCoupon, guestCartRemoveCoupon,
  getGuestEstimateShipping, getEstimateShippingCart, deleteCutomerCartItems,
  deleteAllCartItems, updateCutomerCartItems, updateGuestCart,
  deleteGuestCart, deleteGuestAllCartItems
} from "./APIList";
import { isNumber, pressEnterCallFunction, isEmptyValue, formatCurrency, exceptThisSymbols, isValidNumber } from '../../Utilities/Utilities';
import Tooltip from "../../Components/Tooltip"
import ClickAwayListener from '@mui/base/ClickAwayListener';
import CouponInvalid from '../../Assets/Checkout/CouponInvalid.svg';
import MarkIcon from '../../Assets/Checkout/markicon.svg';
import Samecategory from './Samecategory';
import EmptyCart from './Emptycart';

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
    guestShippingAddress, actionmessage
  } = useSelector(state => {
    return {
      token: state?.token,
      currency: state?.currency,
      miniCartDataItems: state?.miniCartDetails?.data,
      miniCartDetails: state?.miniCartDetails,
      guestCartToken: state?.guestCartToken,
      pageMessages: state?.pageMessages,
      countries: state?.countries,
      userdata: state?.userdata,
      states: state?.states,
      cartDataAddress: state?.cartDataAddress,
      guestShippingAddress: state?.guestShippingAddress,
      actionmessage: state?.actionmessage
    }
  })
  const [estimateShippingLoader, setEstimateShippingLoader] = useState(false);
  const focusStockStatus = useRef();
  const [isHavingOutofStock, setIsHavingOutofStock] = useState(false);
  const [focusOutofStock, setFocusOutofStock] = useState(false);
  const [updateFields, setUpdateFields] = useState(false);
  const [showMobileCount, setShowMobileCount] = useState(false);
  const [showlist, setShowlist] = useState(true);
  const [open, setOpen] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [openEstimateTax, setOpenEstimateTax] = useState(true);
  const [openApplyCoupon, setOpenApplyCoupon] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [rotateCoupon, setRotateCoupon] = useState(false);
  const [myCartData, setMycartData] = useState([]);
  const [rotateSameId, setRotateSameId] = useState(null);
  const [couponData, setCouponData] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeError, setCouponCodeError] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isPostCodeChanged, setIsPostCodeChanged] = useState(false);
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
  const [updateTotalInfo, setUpdateTotalInfo] = useState(false)
  const [cartSummaryDetails, setCartSummaryDetails] = useState({})
  const [estimateShippingData, setEstimateShippingData] = useState([])
  const [shippingMedthos, setShippingMedthos] = useState({})
  const updateCart = (item) => {
    const data = {
      cartItem: {
        sku: item?.[4],
        qty: item?.[7]
      }
    }
    if (!isClickedDelete && !open) {
      if (token) {
        updateCutomerCartItems(token, dispatch, item?.[8], data, setRotate, setRotateSameId, 'cart', actionmessage?.isSesstionTimeOut)
      } else if (guestCartToken) {
        updateGuestCart(dispatch, guestCartToken, item?.[8], data, setRotate, setRotateSameId, 'cart')
      }
    }
  }

  const deleteCart = () => {
    setIsClickedDelete(true)
    if (token) {
      deleteCutomerCartItems(token, dispatch, deleteItemId, setOpen, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
      deleteGuestCart(guestCartToken, dispatch, deleteItemId, setOpen, 'cart')
    }
  }

  const deleteAllItems = () => {
    setIsClickedDelete(true)
    if (token) {
      deleteAllCartItems(token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'cart', actionmessage?.isSesstionTimeOut)
    } else if (guestCartToken) {
      deleteGuestAllCartItems(guestCartToken, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'cart')
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
    if (qty === 0) return
    setMycartData(
      myCartData?.map((item, ind) => {
        if (id === ind) {
          return {
            ...item,
            qty: qty
          };
        } else {
          return item;
        }
      })
    );
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
          navigate("/checkout")
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
  }, [miniCartDataItems])
  useEffect(() => {
    if (pageMessages?.showFor == "cart") {
      setUpdateFields(!updateFields)
    }
  }, [pageMessages?.show == true ? pageMessages?.show : ''])

  useEffect(() => {
    setCartId(myCartData?.[0]?.quote_id)
  }, [myCartData])
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
          let name = data?.rowData[2];
          let image = data?.rowData[3];
          let weight = data?.rowData[5];
          let color = data?.rowData[6];
          let price = parseInt(data?.rowData[1]);
          let qty = parseInt(data?.rowData[7]);
          let qtyString = data?.rowData[7];
          let subTotal = (price * qty);
          let pdpUrl = data?.rowData?.[9];
          let oldPrice = '₹900.00'
          let ind = data?.rowData?.[8];
          let index = data?.rowIndex;
          let stackStatus = data?.rowData[17];
          return (
            <Stack className="mycart_container">
              {
                image ?
                  <div className="product_item_info_img">
                    <div className="img_block">
                      <Link to={`/${pdpUrl}`}>
                        <img src={image} alt="" />
                      </Link>
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
              <div className="product_item_info_section">
                {
                  name ?
                    <Stack className='productname-delete-section-mobile'>
                      <span className='product-name data-value'>
                        <Link to={`/${pdpUrl}`}>{name}</Link>
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
                              if (miniCartDataItems?.[index]?.qty !== qty && qtyString !== '' && qty != 0 && qty != '0' && qty != '') {
                                updateCart(data?.rowData)
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
                                      increaMentCount(qty - 1, index)
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
                                        if (miniCartDataItems?.[index]?.qty !== qty && qty !== '' && qty != 0 && qty != '0') {
                                          updateCart(data?.rowData)
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
                              <span className='value'>{formatCurrency?.format(data?.rowData[15])}</span>
                            </div>
                          </div>
                          : ''
                      }
                    </div>
                    : ''
                }
              </div>
              {
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
              }

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
      name: "image",
      label: "Image",
      options: {
        display: false
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
      name: "weight_in_kg",
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
      name: "qty",
      label: "Qty",
      options: {
        customBodyRender: (value, data) => {
          let ind = data?.rowIndex;
          let qty = parseInt(value);
          let qtyString = value;
          let stackStatus = data?.rowData[17];
          let index = data?.rowIndex;
          return (
            <div className='cart-input-box-section'>
              {
                !showMobileCount ?
                  <ClickAwayListener onClickAway={() => {
                    if (miniCartDataItems?.[ind]?.qty !== qty && qtyString !== '' && qty != 0 && qty != '0') {
                      updateCart(data?.rowData)
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
                          if (qty <= 0) {
                            increaMentCount(qty, data?.rowIndex)
                          } else {
                            increaMentCount(qty - 1, data?.rowIndex)
                          }
                        }}
                      >
                        <RemoveIcon />
                      </Stack>
                      <Box className='input-block'>
                        <TextField
                          className='input-text'
                          type='number'
                          value={value}
                          onChange={(e) => {
                            if (e.target.value == '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                              increaMentCount(e.target.value ? parseInt(e.target.value) : '', ind)
                            } else {
                              return false
                            }
                          }}
                          onKeyDown={evt => {
                            pressEnterCallFunction(evt, () => {
                              if (miniCartDataItems?.[ind]?.qty !== qty && qty !== '' && qty != 0 && qty != '0') {
                                updateCart(data?.rowData)
                                setRotateSameId(ind)
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
      name: "item_id",
      label: "item_id",
      options: {
        display: false
      }
    },
    {
      name: "product_url",
      label: "product_url",
      options: {
        display: false
      }
    },
    {
      name: "subtotal",
      label: "Subtotal",
      options: {
        customBodyRender: (value, data) => {
          return (
            <div className='cart-price-box-section'>
              <span className='price'>{formatCurrency?.format(data?.rowData[15])}</span>
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
    {
      name: "",
      label: false,
      options: {
        customBodyRender: (value, data) => {
          let ind = data?.rowData?.[8];
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
          myCartData?.length ?
            <>
              <Stack className="mycart_container">
                <Stack className="mycart_section">
                  <Stack className="cart_block">
                    <Stack className="cart_item_block">
                      <Stack className='cart-header-block'>
                        <Typography variant='h2'>Shopping Cart</Typography>
                      </Stack>
                      <Table
                        columns={columns}
                        data={myCartData}
                        options={options}
                      />
                      <Stack className="cart_actionable_buttons common_button_block"
                        sx={{
                          pointerEvents: !miniCartDataItems?.length ? 'none' : ''
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
                            }}
                          >Clear Shopping Cart</Button>
                        </Box>

                      </Stack>
                    </Stack>
                    {/* Total Cart */}
                    <Stack className={`cart_total_container
                              ${!miniCartDetails?.cross_sell_products?.length && "remove-same-category"}
                              `}
                    >
                      <Stack className="cart_total_block">
                        <Stack className='total stack-layout'>
                          <Typography className='summary-title'>Summary</Typography>
                        </Stack>
                        <Stack className={`expand-icon title-block estimate-tax-block  ${showlist ? "active" : ""}`} onClick={() => setShowlist(!showlist)}>
                          <Typography className='estimate-tax-title'>Estimate Shipping and Tax</Typography>
                          <Box className={`expand-icon ${showlist ? "active" : ""}`} onClick={() => setOpenEstimateTax(!openEstimateTax)}>

                            {
                              openEstimateTax ?
                                <KeyboardArrowUpIcon />
                                :
                                <KeyboardArrowDownIcon />
                            }

                          </Box>
                        </Stack>
                        {
                          openEstimateTax ?
                            <Stack className='estimate-box-section'>
                              <Stack >
                                <Box className='input-block select'>
                                  <Typography className="input_label">Country </Typography>

                                  <FormControl >

                                    <Autocomplete
                                      id="country_id"
                                      className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                      value={estimateShipping?.display_country}
                                      name="state_dropdown_list"
                                      error={estimateShippingError?.country_id ? true : false}
                                      onChange={(event, newValue) => {
                                        dispatch(ACTION_CARTDATA_ADDRESS({
                                          address: {
                                            countryId: newValue?.value,
                                            display_country: newValue?.label,
                                            postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
                                            region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
                                            region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
                                          },
                                          shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
                                        }))
                                        setEstimateShipping((prevState) => ({
                                          ...prevState,
                                          display_country: newValue?.label,
                                          country_id: newValue?.value
                                        }))
                                        dispatch(ACTION_GUESTSHIPPING({
                                          ...guestShippingAddress,
                                          display_country: newValue?.label,
                                          country: newValue?.value
                                        }))
                                        setEstimateShippingError((prevState) => ({
                                          ...prevState,
                                          country_id: ""
                                        }))
                                      }}
                                      options={countries?.length ? countries : []}
                                      fullWidth
                                      disabled={true}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          className="inputfield-box"
                                          placeholder="Country"
                                          InputLabelProps={{
                                            shrink: false,
                                          }}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Box>
                              </Stack>
                              <Stack >
                                <Box className='input-block select'>
                                  <Typography className="input_label">State/Province</Typography>
                                  <FormControl >
                                    <Autocomplete
                                      disablePortal
                                      id="states"
                                      className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                      name="state_dropdown_list"
                                      onChange={(event, newValue) => {
                                        dispatch(ACTION_CARTDATA_ADDRESS({
                                          address: {
                                            countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
                                            display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
                                            postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
                                            region: newValue?.title,
                                            region_id: newValue?.value
                                          },
                                          shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
                                        }))
                                        setEstimateShipping((prevState) => ({
                                          ...prevState,
                                          region: newValue?.title,
                                          region_id: newValue?.value,
                                          regionValues: newValue,
                                        }))
                                        dispatch(ACTION_GUESTSHIPPING({
                                          ...guestShippingAddress,
                                          display_state: newValue?.title,
                                          state: newValue?.value
                                        }))
                                        setEstimateShippingError((prevState) => ({
                                          ...prevState,
                                          region: "",
                                          region_id: ""
                                        }))
                                      }}
                                      isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          className="inputfield-box"
                                          placeholder="Select a region"
                                          InputLabelProps={{
                                            shrink: false,
                                          }}
                                          inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password',
                                          }}
                                        />
                                      )}
                                      options={states?.length ? states : []}
                                      value={estimateShipping?.regionValues}
                                      fullWidth
                                    />

                                  </FormControl>
                                </Box>
                              </Stack>
                              <Stack>
                                <Box className={`input-block ${estimateShippingError?.postcode ? 'gap' : ''}`}>
                                  <Typography className="input_label">Zip/Postal Code </Typography>
                                  <Stack className='common_input_block_section input-box-section zipcode_block'>
                                    <TextField
                                      id="cart_postcode"
                                      variant="outlined"
                                      fullWidth
                                      value={zipcode}
                                      error={estimateShippingError?.postcode ? true : false}
                                      inputProps={{
                                        autocomplete: 'new-password',
                                        form: {
                                          autocomplete: 'off',
                                        },
                                      }}
                                      onChange={(e) => {
                                        if (e.target.value === '' || isNumber.test(e.target.value)) {
                                          setIsPostCodeChanged(true)
                                          dispatch(ACTION_CARTDATA_ADDRESS({
                                            address: {
                                              countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
                                              display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
                                              postcode: e.target.value,
                                              region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
                                              region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
                                            },
                                            shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
                                          }))
                                          dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, zip_code: e.target.value }))
                                          setEstimateShippingError((prevState) => ({
                                            ...prevState,
                                            postcode: ""
                                          }))
                                          setZipcode(e.target.value)
                                        }
                                      }}
                                    />
                                    {
                                      estimateShippingError?.postcode && <Typography className='form-error-lable field-error'>{estimateShippingError?.postcode}</Typography>
                                    }
                                  </Stack>
                                </Box>
                              </Stack>
                              <Stack className="shipping-info">
                                {
                                  estimateShippingData?.map((item, ind) => {
                                    return (
                                      <Box className='input-block' key={ind}>
                                        <Typography className="input_label">{item?.carrier_title}</Typography>
                                        <FormControl>
                                          <RadioGroup
                                            className='product-item'
                                            name="radio-buttons-group"
                                          >
                                            <FormControlLabel
                                              className='sub-title'
                                              control={<Radio />}
                                              label={`${item?.method_title} ${currency}${item?.amount}`}
                                              onClick={() => {
                                                setShippingMedthos(item)
                                                dispatch(ACTION_CARTDATA_ADDRESS({
                                                  address: {
                                                    countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
                                                    display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
                                                    postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
                                                    region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
                                                    region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : '',
                                                  },
                                                  shippingMethod: item
                                                }))
                                                setCartSummaryData((prevState) => ({
                                                  ...prevState,
                                                  shipping_method: item
                                                }))
                                              }}
                                              checked={cartSummaryData?.shipping_method?.method_code == item?.method_code}
                                            />
                                          </RadioGroup>
                                        </FormControl>

                                      </Box>
                                    )
                                  })
                                }
                              </Stack>
                            </Stack>
                            : ""
                        }

                        <Box className='additional-charges'>
                          <Stack className='shipping stack-layout gap_below'>
                            <Typography className='data'>Subtotal</Typography>
                            <Typography className='value'>{cartSummaryDetails?.total?.subtotal ? formatCurrency?.format(cartSummaryDetails?.total?.subtotal) : formatCurrency?.format(0)}</Typography>
                          </Stack>
                          {
                            cartSummaryDetails?.total?.total_segments?.shipping?.title ?
                              <Stack className='shipping stack-layout gap_below'>
                                <Typography className='data'>{cartSummaryDetails?.total?.total_segments?.shipping?.title}</Typography>
                                <Typography className='value'>{cartSummaryDetails?.total?.total_segments?.shipping?.value ? formatCurrency?.format(cartSummaryDetails?.total?.total_segments?.shipping?.value) : formatCurrency?.format(0)}</Typography>
                              </Stack>
                              : ''
                          }
                          <Stack className='tax stack-layout gap_below'>
                            <Typography className='data'>Tax</Typography>
                            <Typography className='value'>{cartSummaryDetails?.total?.total_segments?.tax?.value ? formatCurrency?.format(cartSummaryDetails?.total?.total_segments?.tax?.value) : formatCurrency?.format(0)}</Typography>
                          </Stack>
                          {
                            cartSummaryDetails?.total?.coupon_code ?
                              <Stack className='tax stack-layout gap_below'>
                                <Typography className='data'>Discount</Typography>
                                <Typography className='value'>{cartSummaryDetails?.total?.discount_amount ? formatCurrency?.format(cartSummaryDetails?.total?.discount_amount) : formatCurrency?.format(0)}</Typography>
                              </Stack>
                              : ''
                          }
                        </Box>
                        <Stack className='total-amount stack-layout'>
                          <Typography className='data'>Total</Typography>
                          <Typography className='value'>{cartSummaryDetails?.total?.total_segments?.grand_total?.value ? formatCurrency?.format(cartSummaryDetails?.total?.total_segments?.grand_total?.value) : formatCurrency?.format(0)}</Typography>
                        </Stack>
                        <Stack className='coupon  common_button_block common_input_block'>
                          <Typography variant='h3' className='discount-coupon-title' >Apply Discount Code
                            {
                              openApplyCoupon == true ?
                                <KeyboardArrowUpIcon onClick={() => setOpenApplyCoupon(!openApplyCoupon)}> </KeyboardArrowUpIcon>
                                :
                                <KeyboardArrowDownIcon onClick={() => setOpenApplyCoupon(!openApplyCoupon)}></KeyboardArrowDownIcon>
                            }

                          </Typography >

                          {
                            openApplyCoupon ?
                              <>
                                <Typography variant='p' className='discount-coupon-text'>Do you have a discount coupon? Enter it here</Typography>
                                <Stack className='common_input_block_section input-box-section'>

                                  <TextField
                                    id="coupon"
                                    variant="outlined"
                                    fullWidth
                                    className=''
                                    placeholder='Enter discount code'
                                    disabled={cartSummaryDetails?.total?.coupon_code ? true : false}
                                    value={couponCode}
                                    onChange={(e) => {
                                      setCouponCode(e.target.value)
                                      setCouponCodeError("")
                                    }}
                                    onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                                  />
                                  {
                                    cartSummaryDetails?.total?.coupon_code ?
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
                                {
                                  cartSummaryDetails?.total?.coupon_code ?
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
                                <Button
                                  className={`coupon_secton_btn discount-btn-section ${couponCode ? 'primary_default_btn' : 'disabled'}`}
                                  fullWidth
                                  onClick={handleSubmit}
                                  startIcon={rotateCoupon === true ? <LoopIcon /> : ""}
                                  disabled={rotateCoupon === true || !couponCode ? true : false}
                                  sx={{
                                    pointerEvents: !miniCartDataItems?.length ? 'none' : ''
                                  }}
                                >{cartSummaryDetails?.total?.coupon_code ? 'Delete Coupon' : 'Apply Coupon'}</Button>
                              </>

                              : ""
                          }
                        </Stack>
                        <Stack className='proceed-to-checkout common_button_block'>
                          <Button
                            className='primary_default_btn proceed-checkout'
                            onClick={() => proceedtoCheckOutHandler()}
                            sx={{
                              pointerEvents: !miniCartDataItems?.length ? 'none' : ''
                            }}
                          >Proceed To Checkout</Button>
                        </Stack>
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
                  alertMessage="Are you sure you want to remove this item from the shopping cart?"
                />
              }
            </>
            :
            ""
        }
        {
          miniCartDetails?.message == "You have no items in your shopping cart." ? <EmptyCart /> : ''
        }
      </Stack>
      {
        rotate ? <Pageloader /> : ''
      }
    </>
  )
}

export default Index;