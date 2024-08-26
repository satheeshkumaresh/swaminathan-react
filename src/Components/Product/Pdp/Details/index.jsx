import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import "./styles.scss";
import Checkicon from '../../../../Assets/PDP/checkicon.svg';
import Delivery from '../../../../Assets/Clienticons/swaminathan-icons-12.svg';
import Payment from '../../../../Assets/Clienticons/swaminathan-icons-11.svg';
import Wishlist from '../../../../Assets/Clienticons/swaminathan-icons-03.svg';
import Outofstock from '../../../../Assets/pdpnew/outofstock.svg';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Productmeasurement from "../Productmeasurement";
import { useDispatch, useSelector } from 'react-redux';
import { isNumber, formatCurrency, exceptThisSymbols, isValidNumber,  } from '../../../../Utilities/Utilities';
import {
    addCutomerCartItems, addGuestCart, notify_Me, addWishList,
    ACTION_WISHLISTPRODUCTID, ACTION_SHOWAUTHENTICATIONPOPUP,
    ACTION_PAGEMESSAGE,
    addGuestQuote
} from "../../../../Store/action";
import {
    addCutomerGroupedCartItems, addGuestGroupedCart, wishlistAddToCartGrouped,
    customerBuyNowAddcart, customerBuyNowGroupedCartItems, guestBuyNowAddcart,
    guestBuyNowGroupedCart
} from "../APIList";
import LoopIcon from '@mui/icons-material/Loop';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material';
const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow  classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      borderRadius: "40px",
      padding:"10px",
      textAlign:"center",
      fontSize:"13px"
    },
   
  }));
const Index = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {
        productData, productDetails, isloggeduser, guestCartToken, token,
        loggedInUserData, showAuthencationPopup, wishListItemIdGrouped, pageMessages,
        actionmessage,bulkOrder
    } = useSelector(state => {
        return {
            productData: state?.productData?.[0]?.data?.[0],
            productDetails: state?.productData?.[0]?.data?.[0]?.product,
            isloggeduser: state?.isloggeduser,
            guestCartToken: state?.guestCartToken,
            token: state?.token,
            loggedInUserData: state?.loggedInUserData,
            showAuthencationPopup: state?.showAuthencationPopup,
            wishListItemIdGrouped: state?.wishListItemIdGrouped,
            pageMessages: state?.pageMessages,
            actionmessage: state?.actionmessage,
            bulkOrder:state?.productData?.[0]?.data?.[0]?.product?.breadcrumb?.[0]?.bulk_order
        }
    })
    // Function to track product meta
    const productMeta = () => {
        if (window.fbq) { //  if fbq is available--future ue
            window.fbq('track', 'ViewContent', {
                content_name: productData?.product?.name,
                content_ids: productData?.entityId,
                id:productData?.entityId,
                content_type: 'product',
                value:productData?.product?.display_special_price? productData?.product?.display_special_price:productData?.product?.price,
                price: productData?.product?.display_special_price? productData?.product?.display_special_price:productData?.product?.price,
                currency: 'INR',
                availability:productData?.product?.stock_status,
                description:productData?.product?.description?productData?.product?.description:"No Description",
                title:productData?.product?.name,
                link:`${window.location.origin}` + `/${productData?.urlKey}`,
                // window.location.origin`/${productData?.urlKey}`,
                image_link:productData?.product?.media_gallery
                
            });
        } else {
            console.error('Facebook Pixel (fbq) not initialized.');
        }
    }

    useEffect(() => {
        productMeta();
        // microdata for catalogue
        const googleJobNetworkScript = document.createElement("script");
        googleJobNetworkScript.type = "application/ld+json";
        googleJobNetworkScript.innerHTML = JSON.stringify({
            "@context":"https://schema.org",
            "@type":"Product",
            "productID":`${productData?.entityId}`,
            "name":`${productData?.product?.name}`,
            "description":`${productData?.product?.description?productData?.product?.description:"No Description"}`,
            "url":`${window.location.origin}` + `/${productData?.urlKey}`, //page link
            "price":`${productData?.product?.display_special_price? productData?.product?.display_special_price:productData?.product?.price}`,
            "availability":`${productData?.product?.stock_status}`,
            "image":`${JSON.stringify(productData?.product?.media_gallery)}`,
            "offers": [
              {
                // "@type":`${productData?.product?.tag?.on_offer ? productData?.product?.tag?.on_offer:"No offer"}`,
                "@type": "Offer",
                "price":`${productData?.product?.display_special_price? productData?.product?.display_special_price:productData?.product?.price}`,
                "priceCurrency":"INR",
                "itemCondition":"https://schema.org/NewCondition",
                "availability":`${productData?.product?.stock_status}`
              }
            ],
            "additionalProperty": [{
              "@type": `${productData?.product?.product_type}`,//product_type
              "propertyID": `${productData?.product?.sku}`, //sku
              "value": `${productData?.product?.display_special_price? productData?.product?.display_special_price:productData?.product?.price}`
            }]
        });
    
        document.head.appendChild(googleJobNetworkScript);
    }, [productData]); 

    // checking data for future use
    console.log("productData",productData);
    const [qtyValue, setQtyValue] = useState(0)
    const [showRotate, setShowRotate] = useState(false);
    const [showQuoteRotate, setQuoteShowRotate] = useState(false);
    const [buyNowShowRotate, setBuyNowShowRotate] = useState(false);
    const [groupedData, setGroupedData] = useState([]);
    const [is_table_one, setIs_table_one] = useState([]);
    const [isHavingGroupedPoducts, setIsHavingGroupedPoducts] = useState(false);
    const [isHavingSpecialPrice, setIsHavingSpecialPrice] = useState(false);
    const [groupedValidations, setGroupedValidations] = useState(false);
    const [groupedValidationsMessage, setGroupedValidationsMessage] = useState("");
    const [updateFields, setUpdateFields] = useState(false);
    const focusStockStatus = useRef();
    const increaMentHandler = () => {
        if (qtyValue == '') {
            setQtyValue(1)
        } else if (qtyValue >= 0) {
            setQtyValue(qtyValue + 1)
        }
    }
    const decrementHandler = () => {
        if (qtyValue <= productDetails?.min_quantity) {
            setQtyValue(productDetails?.min_quantity)
        } else {
            setQtyValue(qtyValue - 1)
        }
    }
    const increaMentCount = (qty, id) => {
        if (qty === 0) return
        setIs_table_one(
            is_table_one?.map((item, ind) => {
                if (id === ind) {
                    return {
                        ...item,
                        selected_qty: qty,
                    };
                } else {
                    return item;
                }
            })
        );
    }
    const addCartItems = (sku, qty) => {
        if (qty == 0 || qty == "") {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: `The fewest you may purchase is ${productDetails?.min_quantity}.`,
                showFor: "pdp",
                multipleMessages: {}
            }))
        } else {
            if (isloggeduser) {
                addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, 'pdp', actionmessage?.isSesstionTimeOut)
            } else {
                addGuestCart(dispatch, guestCartToken, sku, qty, setShowRotate, 'pdp')
            }
        }
    }
    const addQuoteCartItems = (sku, qty,productId,productName,price) => {
        if (qty <10) {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: `The quote option requires a minimum order of 10 units`,
                showFor: "pdp",
                multipleMessages: {}
            }))
        } else {
            if (isloggeduser) {
                var customer_id=1;
                // future use for customer  bulk order
                addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, 'pdp')
                // addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, 'pdp', actionmessage?.isSesstionTimeOut)
            } else {
                customer_id=0;
                addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, 'pdp')
            }
        }
    }
    const buyNowAddCartItems = (sku, qty) => {
        if (qty == 0 || qty == "") {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: `The fewest you may purchase is ${productDetails?.min_quantity}.`,
                showFor: "pdp",
                multipleMessages: {}
            }))
        } else {
            if (isloggeduser) {
                customerBuyNowAddcart(token, dispatch, sku, qty, setBuyNowShowRotate, navigate, 'checkout', 'pdp', actionmessage?.isSesstionTimeOut)
            } else {
                guestBuyNowAddcart(dispatch, guestCartToken, sku, qty, setBuyNowShowRotate, navigate, 'checkout', 'pdp')
            }
        }
    }
    const buyNowGroupedAddCartItems = (sku) => {
        if (isloggeduser) {
            customerBuyNowGroupedCartItems(token, dispatch, sku, setBuyNowShowRotate, groupedData, navigate, 'checkout', 'pdp', actionmessage?.isSesstionTimeOut)
        } else {
            guestBuyNowGroupedCart(dispatch, guestCartToken, sku, setBuyNowShowRotate, groupedData, navigate, 'checkout', 'pdp')
        }
    }
    const addWishlistToGroupedAddCartItems = (sku) => {
        if (isloggeduser) {
            wishlistAddToCartGrouped(token, dispatch, sku, groupedData, wishListItemIdGrouped?.id, setShowRotate, navigate, '/account/mywishlist', "pdp", actionmessage?.isSesstionTimeOut)
        }
    }
    const addGroupedCartItems = (sku) => {
        if (isloggeduser) {
            addCutomerGroupedCartItems(token, dispatch, sku, setShowRotate, groupedData, 'pdp', actionmessage?.isSesstionTimeOut)
        } else {
            addGuestGroupedCart(dispatch, guestCartToken, sku, setShowRotate, groupedData, 'pdp')
        }
    }
    const addToWishList = () => {
        if (isloggeduser) {
            addWishList(token, dispatch, productData?.entityId, false, "pdp", actionmessage?.isSesstionTimeOut)
        } else {
            dispatch(ACTION_WISHLISTPRODUCTID(productData?.entityId))
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: !showAuthencationPopup?.loginReg,
                forgotPas: false,
                resetPass: false
            }))
        }
    }
    const actionNotify = () => {
        const data = {
            customerEmail: loggedInUserData?.email,
            productId: Number(productData?.entityId)
        }
        if (isloggeduser) {
            notify_Me(token, dispatch, data, actionmessage?.isSesstionTimeOut)
        } else {
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: !showAuthencationPopup?.loginReg,
                forgotPas: false,
                resetPass: false
            }))
        }

    };
    useEffect(() => {
        if (productData?.grouped_product?.length) {
            setIs_table_one(productData?.grouped_product);
        }
        if (pageMessages?.show) {
            setGroupedValidations(false)
        }
    }, [productData?.grouped_product?.length, updateFields]);
    useEffect(() => {
        if (pageMessages?.showFor == "pdp") {
            setUpdateFields(!updateFields)
        }
    }, [pageMessages?.show == true ? pageMessages?.show : ''])
    useEffect(() => {
        setQtyValue(productDetails?.min_quantity)
    }, [productDetails?.min_quantity, updateFields])
    useEffect(() => {
        const gItemsData = [];
        is_table_one?.forEach((item, ind) => {
            gItemsData?.push({
                id: item?.id,
                qty: item?.stock_status == "Out of stock" || item?.selected_qty == "" ? 0 : item?.selected_qty
            })
        })
        setGroupedData(gItemsData)
    }, [is_table_one])
    useEffect(() => {
        is_table_one?.map((item) => {
            if (!isHavingGroupedPoducts) {
                if (item?.display_special_price) {
                    setIsHavingGroupedPoducts(true)
                }
            } else {
                return
            }
            if (!isHavingSpecialPrice) {
                if (item?.display_special_price) {
                    setIsHavingSpecialPrice(true)
                }
            } else {
                return
            }
        })
    }, [is_table_one]);

    useEffect(() => {
        setIsHavingGroupedPoducts(false)
        setIsHavingSpecialPrice(false)
    }, [location])
    useEffect(() => {
        is_table_one?.map((item) => {
            if (!groupedValidations) {
                if (item?.selected_qty) {
                    setGroupedValidations(true)
                }
            } else {
                return
            }
        })
    }, [is_table_one, groupedValidations])
    useEffect(() => {
        focusStockStatus.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }, [focusStockStatus.current, groupedValidationsMessage]);
    
    return (
        <>
            <Stack className="details">
                {
                    productDetails?.name ?
                        <Typography className='heading'>{productDetails?.name}</Typography>
                        : ''
                }

                <Stack className='price_offer_block'>
                    {
                        !productData?.grouped_product?.length ?
                            <Stack className='price'>
                                {
                                    productDetails?.special_price ?
                                        <>
                                            {
                                                productDetails?.special_price ?
                                                    <Stack className='sale-price price-block'>
                                                        <Typography variant='span' className='amount'>{formatCurrency?.format(productDetails?.special_price)}</Typography>
                                                    </Stack>
                                                    : ''
                                            }
                                            {
                                                productDetails?.price ?
                                                    <Stack className='offer-price price-block'>
                                                        <Typography variant='span' className='amount'>{formatCurrency?.format(productDetails?.price)}</Typography>
                                                    </Stack>
                                                    : ''
                                            }
                                        </>
                                        :
                                        productDetails?.price ?
                                            <Stack className='sale-price price-block'>
                                                <Typography variant='span' className='amount'>{formatCurrency?.format(productDetails?.price)}</Typography>
                                            </Stack>
                                            : ''
                                }
                            </Stack>
                            : ""
                    }
                    {
                        productDetails?.tag?.new_arrival || productDetails?.tag?.on_offer ?
                            <Stack className='offertags'>
                                {
                                    productDetails?.tag?.new_arrival ?
                                        <Typography className='offer-label newarrival'>{productDetails?.tag?.new_arrival}</Typography>
                                        : ''
                                }
                                {
                                    productDetails?.tag?.on_offer ?
                                        <Typography className='offer-label'>{productDetails?.tag?.on_offer}</Typography>
                                        : ''
                                }
                            </Stack>
                            : ''
                    }
                </Stack>
                {
                    productDetails?.sku ? <Stack className='variations sku'>
                        <Typography variant='span' className='label'>SKU:</Typography>
                        <Typography variant='span' className='value'>{productDetails?.sku}</Typography>
                    </Stack> : ""
                }
                <Stack className='variations availability'>
                    <Typography variant='label' className='label'>Availability:</Typography>
                    {
                        productDetails?.stock_status == "In stock" ?
                            <Box className='Product-stock'>
                                <Typography variant='span' className='checkmark'>
                                    <img src={Checkicon} alt="In stock" />
                                </Typography>
                                <Typography variant='span' className='instock'>{productDetails?.stock_status}&nbsp;{!productData?.grouped_product?.length ? `(${productDetails?.quantity})` : ''}</Typography>
                            </Box>
                            :
                            <Box className='Product-stock'>
                                <Typography variant='span' className='checkmark'>
                                    <img src={Outofstock} alt="Out of stock" />
                                </Typography>
                                <Typography variant='span' className='out-of-stock'>{productDetails?.stock_status}</Typography>
                            </Box>
                    }
                </Stack>
                {
                    productDetails?.color ?
                        <Stack className='variations product-color'>
                            <Typography variant='h4' className='label'>Color:</Typography>
                            <Stack className='product-color-section'>
                                <Stack className='item-block'>
                                    <Typography className="value">{productDetails?.color}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        : ''
                }
                {
                    productDetails?.size_in_kg ?
                        <Stack className='variations product-weightr'>
                            <Typography variant='h4' className='label'>Weight (Kg):</Typography>
                            <Stack className='product-color-section'>
                                <Stack className='item-block'>
                                    <Typography className="value">{productDetails?.size_in_kg}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        : ''
                }
                {
                    productDetails?.material ?
                        <Stack className='variations product-material'>
                            <Typography variant='h4' className='label'>Material:</Typography>
                            <Stack className='product-color-section'>
                                <Stack className='item-block'>
                                    <Typography className="value">{productDetails?.material}</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        : ''
                }
                {
                    !productData?.grouped_product?.length && (productDetails?.length || productDetails?.width || productDetails?.length) ?
                        <Stack className='variations product-material'>
                            <Typography variant='h4' className='label'>Size (LxWxH):</Typography>
                            <Stack className='product-color-section'>
                                <Stack className='item-block'>
                                    <Typography className="value">
                                        {productDetails?.length ? `${productDetails?.length}" x ` : "- x "}
                                        {productDetails?.width ? `${productDetails?.width}" x ` : "- x "}
                                        {productDetails?.height ? `${productDetails?.height}"` : "- x"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        : ''
                }
                {
                    productData?.grouped_product?.length ?
                        <Stack className='variations product-material product-material-grouped'>
                            <Typography variant='h4' className='label'>Size (LxWxH):</Typography>
                            <Stack className='size__block'>
                                {
                                    productData?.grouped_product?.map((item, ind) => {
                                        return (
                                            <Stack className='product-color-section' key={ind}>
                                                {
                                                    item?.length || item?.width || item?.height ?
                                                        <Stack className='item-block'>
                                                            <Typography className="label">{item?.size_in_kg} kg -</Typography>
                                                        </Stack>
                                                        : ''
                                                }
                                                {
                                                    item?.length || item?.width || item?.height ?
                                                        <Stack className='dimention'>
                                                            {
                                                                item?.length ?
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            {item?.length ? `${item?.length}" x` : ''}
                                                                        </Typography>
                                                                    </Stack>
                                                                    :
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            - x
                                                                        </Typography>
                                                                    </Stack>
                                                            }
                                                            {
                                                                item?.width ?
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            {item?.width ? `${item?.width}" x` : ''}
                                                                        </Typography>
                                                                    </Stack>
                                                                    :
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            - x
                                                                        </Typography>
                                                                    </Stack>
                                                            }
                                                            {
                                                                item?.height ?
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            {item?.height ? `${item?.height}"` : ''}
                                                                        </Typography>
                                                                    </Stack>
                                                                    :
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">
                                                                            - x
                                                                        </Typography>
                                                                    </Stack>
                                                            }
                                                        </Stack>
                                                        : ''
                                                }
                                            </Stack>
                                        )
                                    })
                                }
                            </Stack>
                        </Stack>
                        : ''
                }
                <Stack className='product_overview'>
                    {
                        productDetails?.short_description ?
                            <Stack className='descriptions short_description'>
                                <Typography variant='h3' className='title'>OVERVIEW</Typography>
                                <Typography className='content'
                                    dangerouslySetInnerHTML={{ __html: productDetails?.short_description }}></Typography>
                            </Stack>
                            : ''
                    }
                    <Stack className='action_block'>
                        {
                            productData?.grouped_product?.length ?
                                <>
                                    <Stack className='grouped_products'>
                                        {
                                            is_table_one?.map((item, ind) => {
                                                return (
                                                    <Stack className='item_block' key={ind}>
                                                        <Stack className='block'>
                                                            <Typography className='weigth'>
                                                                {
                                                                    item?.size_in_kg?.split('-')?.map((weight, ind) => {
                                                                        if (item?.size_in_kg?.split('-')?.length > 1) {
                                                                            if (item?.size_in_kg?.split('-')?.length == ind + 1) {
                                                                                return weight + " " + "kg" + ""
                                                                            } else {
                                                                                return weight + " " + "kg" + " " + "-"
                                                                            }
                                                                        } else {
                                                                            return weight + " " + "kg"
                                                                        }
                                                                    })
                                                                }
                                                            </Typography>
                                                            {
                                                                item?.special_price ?
                                                                    <Stack className='price_block'>
                                                                        <Typography className='price'>{formatCurrency?.format(item?.special_price)}</Typography>
                                                                        <Typography className='price special_price'>{formatCurrency?.format(item?.price)}</Typography>
                                                                    </Stack>
                                                                    :
                                                                    <Stack className='price_block'>
                                                                        {/* purposely commented */}
                                                                        {/* {
                                                                            isHavingSpecialPrice ?
                                                                                <Typography className='price hidden'>{formatCurrency?.format(item?.price)}</Typography>
                                                                                : <></>
                                                                        } */}
                                                                        <Typography className='price'>{formatCurrency?.format(item?.price)}</Typography>
                                                                    </Stack>
                                                            }
                                                            <Stack className='variations product-material'>
                                                                <Typography variant='h4' className='label'>SKU:</Typography>
                                                                <Stack className='product-color-section'>
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">{item?.sku}</Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                            <Stack className='variations product-material'>
                                                                <Typography variant='h4' className='label'>QTY:</Typography>
                                                                <Stack className='product-color-section'>
                                                                    <Stack className='item-block'>
                                                                        <Typography className="value">{item?.quantity}</Typography>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                            {
                                                                isHavingSpecialPrice && !item?.special_price ?
                                                                    <Stack className='price_block'>
                                                                         <Typography className='price hidden'>XYZ</Typography>
                                                                    </Stack>
                                                                    : <></>
                                                            }
                                                        </Stack>
                                                        <Stack className='block'>
                                                            {
                                                                item?.stock_status == "In stock" && item?.quantity !== 0 ?
                                                                    <Stack className='count_block'>
                                                                        <Stack
                                                                            className='minus action'
                                                                            onClick={() => {
                                                                                setGroupedValidationsMessage("")
                                                                                if (item?.selected_qty <= productData?.grouped_product?.[ind]?.min_quantity) {
                                                                                    increaMentCount(productData?.grouped_product?.[ind]?.min_quantity, ind)
                                                                                } else {
                                                                                    increaMentCount(item?.selected_qty - 1, ind)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <RemoveIcon />
                                                                        </Stack>
                                                                        <Box className='input-block'>
                                                                            <TextField
                                                                                className='input-text'
                                                                                type='number'
                                                                                placeholder='Select'
                                                                                value={item?.selected_qty}
                                                                                onKeyDown={evt => {
                                                                                    if (evt.which === 8 || evt.which === 37 || evt.which == 39 || evt.which == 46) {
                                                                                        return;
                                                                                    }
                                                                                    if (evt.which < 48 || evt.which > 57 || exceptThisSymbols.includes(evt.key) || !isValidNumber(evt.key)) {
                                                                                        evt.preventDefault();
                                                                                    }
                                                                                }}
                                                                                onChange={(e) => {
                                                                                    if (e.target.value == '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                                                                                        setGroupedValidations(false)
                                                                                        setGroupedValidationsMessage("")
                                                                                        increaMentCount(e.target.value ? parseInt(e.target.value) : '', ind)
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        <Stack
                                                                            className='plus action'
                                                                            onClick={() => {
                                                                                setGroupedValidationsMessage("")
                                                                                if (item?.selected_qty == "") {
                                                                                    increaMentCount(item?.min_quantity, ind)
                                                                                } else {
                                                                                    increaMentCount(item?.selected_qty == '' ? item?.selected_qty : item?.selected_qty + 1, ind)
                                                                                }
                                                                            }}
                                                                        >
                                                                            <AddIcon />
                                                                        </Stack>
                                                                    </Stack>
                                                                    : <></>
                                                            }
                                                            {
                                                                item?.quantity === 0 ?
                                                                    <Typography className='stock'>Out Of Stock</Typography>
                                                                    : <></>
                                                            }
                                                        </Stack>
                                                    </Stack>
                                                )
                                            })
                                        }
                                    </Stack>
                                    <Stack className='qty-btn-section'>
                                        {
                                            productDetails?.stock_status == "In stock" ?
                                                <Box className='btn_block cart'>
                                                    <Button
                                                        className='primary_default_btn'
                                                        startIcon={showRotate === true ? <LoopIcon /> : ""}
                                                        disabled={showRotate === false ? false : true}
                                                        onClick={() => {
                                                            if (productData?.grouped_product?.length) {
                                                                if (!groupedValidations) {
                                                                    setGroupedValidationsMessage("Please enter a quantity greater than 0.")
                                                                } else {
                                                                    if (
                                                                        wishListItemIdGrouped?.id || wishListItemIdGrouped?.sku
                                                                        && wishListItemIdGrouped?.sku == productDetails?.sku
                                                                    ) {
                                                                        addWishlistToGroupedAddCartItems(productDetails?.sku)
                                                                    } else {
                                                                        addGroupedCartItems(productDetails?.sku)
                                                                    }
                                                                }
                                                            } else {
                                                                addCartItems(productDetails?.sku, qtyValue)
                                                            }
                                                        }}
                                                    >Add To Cart</Button>
                                                </Box> : ''
                                        }

                                    </Stack>
                                </>
                                :
                                <Stack className='qty-btn-section'>

                                    {
                                        productDetails?.stock_status == "In stock" ?
                                            <Stack className='count_block'>
                                                <Stack className='minus action' onClick={() => decrementHandler()}>
                                                    <RemoveIcon />
                                                </Stack>
                                                <Box className='input-block'>
                                                    <TextField
                                                        className='input-text'
                                                        type='number'
                                                        value={qtyValue}
                                                        onKeyDown={evt => {
                                                            if (evt.which === 8 || evt.which === 37 || evt.which == 39 || evt.which == 46) {
                                                                return;
                                                            }
                                                            if (evt.which < 48 || evt.which > 57 || exceptThisSymbols.includes(evt.key) || !isValidNumber(evt.key)) {
                                                                evt.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target.value === '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                                                                setQtyValue(e.target.value != 0 ? parseInt(e.target.value) : '')
                                                            } else {
                                                                return false
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Stack className='plus action' onClick={() => increaMentHandler()}>
                                                    <AddIcon />
                                                </Stack>
                                            </Stack> : ''
                                    }
                                    {
                                        productDetails?.stock_status == "In stock" ?
                                            <Box className='btn_block cart'>
                                                <Button
                                                    className='primary_default_btn'
                                                    startIcon={showRotate === true ? <LoopIcon /> : ""}
                                                    disabled={showRotate === false ? false : true}
                                                    onClick={() => {
                                                        if (productData?.grouped_product?.length) {
                                                            if (!groupedValidations) {
                                                                setGroupedValidationsMessage("Please enter a quantity greater than 0.")
                                                            } else {
                                                                addGroupedCartItems(productDetails?.sku)
                                                            }
                                                        } else {
                                                            addCartItems(productDetails?.sku, qtyValue)
                                                        }
                                                    }}
                                                >Add To Cart</Button>
                                            </Box> : ''
                                    }

                                </Stack>

                        }
                        {
                            productDetails?.stock_status == "In stock" ?
                                <Stack className='btn_blocks'>

                                    <Box className='btn_block buynow'>
                                        <Button
                                            className='secondary_default_btn'
                                            startIcon={buyNowShowRotate === true ? <LoopIcon /> : ""}
                                            disabled={buyNowShowRotate === false ? false : true}
                                            onClick={() => {
                                                if (productData?.grouped_product?.length) {
                                                    if (!groupedValidations) {
                                                        setGroupedValidationsMessage("Please enter a quantity greater than 0.")
                                                    } else {
                                                        if (
                                                            wishListItemIdGrouped?.id || wishListItemIdGrouped?.sku
                                                            && wishListItemIdGrouped?.sku == productDetails?.sku
                                                        ) {
                                                            addWishlistToGroupedAddCartItems(productDetails?.sku)
                                                        } else {
                                                            buyNowGroupedAddCartItems(productDetails?.sku)
                                                        }
                                                    }
                                                } else {
                                                    buyNowAddCartItems(productDetails?.sku, qtyValue)
                                                }
                                            }}
                                        >Buy Now</Button>
                                    </Box>
                                </Stack>
                                :
                                <Stack className='btn_blocks'>
                                    <Box className='btn_block cart'>
                                        <Button
                                            className='outlined_default_btn'
                                            onClick={() => actionNotify()}
                                        >Notify Me</Button>
                                    </Box>
                                </Stack>
                        }
                        {
                            groupedValidationsMessage ?
                                <Stack className='grouped_select_qty_error' ref={focusStockStatus}>
                                    <Typography>{groupedValidationsMessage}</Typography>
                                </Stack>
                                : ''
                        }
                        <Stack className='wishlist'>
                            <Stack className='item_block' onClick={() => addToWishList()}>
                                <img src={Wishlist} title='Wishlist' alt='Wishlist' />
                                <Typography className='content'>Add To Wishlist</Typography>
                            </Stack>
                            {
bulkOrder ==1?(<> <Stack className='btn add_to _quote'>
<Box className='btn_bloc quote_btn_block'>
<BootstrapTooltip title="The quote option requires a minimum order of 10 units">
    <Button
        className='outlined_default_btn'
        startIcon={showQuoteRotate === true ? <LoopIcon /> : ""}
        disabled={showQuoteRotate === false ? false : true}
        onClick={() => {
            if (productData?.grouped_product?.length) {
                if (!groupedValidations) {
                    setGroupedValidationsMessage("Please enter a quantity greater than 0.")
                } else {
                    addGroupedCartItems(productDetails?.sku)
                }
            } else {
                addQuoteCartItems(productDetails?.sku, qtyValue,productData?.entityId,productDetails?.name,productDetails?.price)
                // addCartItems(productDetails?.sku, qtyValue)
            }
        }}
    >Add To Quote</Button>
    </BootstrapTooltip>
</Box>
</Stack></>):""
                            }
                           
                        </Stack>
                        {
                                            bulkOrder==1 ?(
                                                <>
 <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>     
                                                </>
                                            ):""
                                        }
                    </Stack>
                    <Stack className='order_methods'>
                        <Stack className='item_block'>
                            <Box className='image'>
                                <img src={Delivery} title='Delivery' alt='Delivery' />
                            </Box>
                            <Stack className='info'>
                                <Typography variant='h4' className='title'>DELIVERY</Typography>
                                <Typography className='content'>
                                    Select a convenient delivery method. Your shipping charge will depend on your location.
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack className='item_block'>
                            <Box className='image'>
                                <img src={Payment} title='Payment' alt='Payment' />
                            </Box>
                            <Stack className='info'>
                                <Typography variant='h4' className='title'>PAYMENT</Typography>
                                <Typography className='content'>
                                    We accept UPI, Debit and Credit Cards, Cash on Delivery, and NetBanking.
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    {
                        productData?.product?.product_measurements ?
                            <Stack className='measurement'>
                                <Typography variant='h3' className='title'>PRODUCT MEASUREMENT</Typography>
                                <Box className='image' onClick={() => setOpen(true)}>
                                    <img src={productData?.product?.product_measurements} alt="Product measurement" />
                                </Box>
                            </Stack>
                            : ''
                    }
                    {
                        productDetails?.description ?
                            <Stack className='descriptions full_description'>
                                <Typography variant='h3' className='title'>DESCRIPTION</Typography>
                                <Typography className='content'
                                    dangerouslySetInnerHTML={{ __html: productData?.product?.description }}></Typography>
                            </Stack>
                            : ''
                    }
                </Stack>
            </Stack>
            {
                open ? <Productmeasurement setOpen={setOpen} /> : ""
            }
        </>
    )
}

export default Index;