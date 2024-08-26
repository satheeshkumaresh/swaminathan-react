import React, { useState, useEffect } from 'react';
import "./styles.scss";
import { Box, Button, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useSelector, useDispatch } from 'react-redux';
import { exceptThisSymbols, isValidNumber } from '../../Utilities/Utilities';
import {
    addCutomerCartItems, addGuestCart, notify_Me, addWishList, ACTION_PAGEMESSAGE,
    ACTION_WISHLISTPRODUCTID, ACTION_SHOWAUTHENTICATIONPOPUP, addGuestQuote
} from "../../Store/action";
import {
    customerBuyNowAddcart, guestBuyNowAddcart
} from "./APIList";
import LoopIcon from '@mui/icons-material/Loop';
import Messageblocks from "../Messageblocks";
import Checkicon from "../../Assets/PDP/checkicon.svg";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Wishlist from '../../Assets/pdpnew/wishlist.svg';
import Outofstock from '../../Assets/pdpnew/outofstock.svg';
import { formatCurrency } from "../../Utilities/Utilities";
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
const Index = ({ closePpup }) => {
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        quickViewData, token, guestCartToken, pageMessages, isloggeduser, userdata,
        showAuthencationPopup, actionmessage,state,bulkOrder
    } = useSelector(state => {
        return {
            quickViewData: state?.quickViewData,
            quickView: state?.quickView,
            token: state?.token,
            guestCartToken: state?.guestCartToken,
            pageMessages: state?.pageMessages,
            isloggeduser: state?.isloggeduser,
            userdata: state?.userdata,
            showAuthencationPopup: state?.showAuthencationPopup,
            actionmessage: state?.actionmessage,
            bulkOrder:state?.productListData?.[0]?.data?.[0]?.breadcrumb?.[0]?.bulk_order,
            state:state
        }
    })
    // check data for future use
    console.log("quick view",quickViewData);
    const [showRotate, setShowRotate] = useState(false);
    const [showQuoteRotate, setQuoteShowRotate] = useState(false);
    const [buyShowRotate, setBuyShowRotate] = useState(false);
    const [qtyValue, setQtyValue] = useState(0);
    const [Arrow, setArrow] = useState(false);
    const [show, setShow] = useState(false);

    const increaMentHandler = () => {
        if (qtyValue == '') {
            setQtyValue(1)
        } else if (qtyValue >= 0) {
            setQtyValue(qtyValue + 1)
        }
    }
    const decrementHandler = () => {
        if (qtyValue <= 0) {
            setQtyValue(qtyValue)
        } else {
            setQtyValue(qtyValue - 1)
        }
    }
    const addCartItems = (sku, qty) => {
        if (token) {
            addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, 'quickview', actionmessage?.isSesstionTimeOut)
        } else {
            addGuestCart(dispatch, guestCartToken, sku, qty, setShowRotate, 'quickview')
        }
    }
        const [cartItemLoader, setCartItemLoader] = useState(false);
    const addQuoteItems = (sku, qty,productId,productName,price) => {
        if (token) {
            var customer_id=1;
            addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, 'quickview')
            // addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, 'quickview', actionmessage?.isSesstionTimeOut)
        } else {
            customer_id=0;
            addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, setCartItemLoader,'quickview')
        }
    }

    function getIOSVersion() {
        const userAgent = window.navigator.userAgent;
        const match = userAgent.match(/OS (\d+)_\d+/);
        return match ? parseInt(match[1], 10) : null;
      }
    //   buy now button, wishlist,produ details for ios
      const [iosbuynowbtn,setiosbuynowbtn]=useState(false);
  const [ioswishlist,setioswishlist]=useState(false);
     // future use for ios versions
//   const [iosproddetails,setiosproddetails]=useState(false);
useEffect(()=>{
    applyIOS();
},[])
      function applyIOS() {
        const iosVersion = getIOSVersion();
        console.log("ios",iosVersion);
        if(iosVersion != null){
            if (iosVersion < 15) {
             
                setiosbuynowbtn(true)
                setioswishlist(true)
                   // future use for ios versions
                // setiosproddetails(true)
            }else{
           
                setiosbuynowbtn(false)
                setioswishlist(false)
                // setiosproddetails(false)
            }
        }
       
      }
  
      
    const buyNowAddCartItems = (sku, qty) => {
        if (isloggeduser) {
            customerBuyNowAddcart(token, dispatch, sku, qty, setBuyShowRotate, navigate, 'checkout', 'quickview', actionmessage?.isSesstionTimeOut)
        } else {
            guestBuyNowAddcart(dispatch, guestCartToken, sku, qty, setBuyShowRotate, navigate, 'checkout', 'quickview')
        }
    }
    const addToWishList = () => {
        if (isloggeduser == true) {
            addWishList(token, dispatch, quickViewData?.id, false, "quickview", actionmessage?.isSesstionTimeOut)
        } else {
            dispatch(ACTION_WISHLISTPRODUCTID(quickViewData?.id))
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: !showAuthencationPopup?.loginReg,
                forgotPas: false,
                resetPass: false
            }))
        }
    }
    const actionNotify = () => {
        closePpup()
        const datas = {
            customerEmail: userdata?.email,
            productId: Number(quickViewData?.id)
        }
        notify_Me(token, dispatch, datas, "quickview", actionmessage?.isSesstionTimeOut)
    };

    useEffect(() => {
        setQtyValue(quickViewData?.min_qty)
    }, [quickViewData, pageMessages?.showFor])
    useEffect(() => {
        dispatch(ACTION_PAGEMESSAGE({
            show: false,
            isSuccess: false,
            isError: false,
            isWarning: false,
            message: "",
            showFor: ""
        }))
    }, [])

    return (
        <Stack className='quickcustommodel'>
            <ClickAwayListener onClickAway={closePpup}>
                <Stack className='modelcontainer'>
                    <Box className='closebtn' onClick={closePpup}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path id="close" d="M27,10.575,25.425,9,18,16.425,10.575,9,9,10.575,16.425,18,9,25.425,10.575,27,18,19.575,25.425,27,27,25.425,19.575,18Z" transform="translate(-9 -9)" fill="#767f80" />
                        </svg>
                    </Box>

                    <Stack className="section">
                        <Stack className={`block ${show ? "showoption" : ""}`}
                        >
                            <Box className={`product-img-sec ${Arrow ? "showarrow" : ""}`}
                            >

                                <Stack className="productimage">
                                    <Stack className="image-section">
                                        <Box className="image">
                                            <img src={quickViewData?.media_gallery?.image?.[0]} alt="" />
                                        </Box>
                                    </Stack>
                                </Stack>

                            </Box>
                            {/* // future use for ios versions */}
{/* ${iosproddetails ? 'iosprodquickview-details':""} */}
                            <Stack className={`quickview-details` }>
                                {
                                    quickViewData?.name ?
                                        <Typography className='heading'>{quickViewData?.name}</Typography>
                                        : ''
                                }
                                <Stack className='price_offer_block'>
                                    {
                                        quickViewData?.tag?.new_arrival || quickViewData?.tag?.on_offer ?
                                            <Stack className='offertags'>

                                                {
                                                    quickViewData?.tag?.on_offer ?
                                                        <Typography className='offer-label'>{quickViewData?.tag?.on_offer}</Typography>
                                                        : ''
                                                }
                                                {
                                                    quickViewData?.tag?.new_arrival ?
                                                        <Typography className='offer-label newarrival'>{quickViewData?.tag?.new_arrival}</Typography>
                                                        : ''
                                                }
                                            </Stack>
                                            : ''
                                    }
                                    {
                                        quickViewData?.starting_from_price || quickViewData?.starting_to_price ?
                                            <Stack className='price grouped_products_price'>
                                                <Typography variant='span' className='label'>From</Typography>
                                                {
                                                    quickViewData?.starting_from_price ?
                                                        <Stack className='sale-price price-block'>
                                                            <Typography variant='span' className='amount'>{formatCurrency?.format(quickViewData?.starting_from_price)}</Typography>
                                                        </Stack>
                                                        : ''
                                                }
                                                {
                                                    quickViewData?.starting_to_price ?
                                                        <Stack className='sale-price price-block'>
                                                            <Typography variant='span' className='amount'>-</Typography>
                                                            <Typography variant='span' className='amount'>{formatCurrency?.format(quickViewData?.starting_to_price)}</Typography>
                                                        </Stack>
                                                        : ''
                                                }
                                            </Stack>
                                            :
                                            quickViewData?.special_price ?
                                                <Stack className='price simple_products_price'>
                                                    {
                                                        quickViewData?.special_price ?
                                                            <Stack className='sale-price price-block'>
                                                                <Typography variant='span' className='amount'>{formatCurrency?.format(quickViewData?.special_price)}</Typography>
                                                            </Stack>
                                                            : ''
                                                    }
                                                    {
                                                        quickViewData?.price ?
                                                            <Stack className='offer-price price-block'>
                                                                <Typography variant='span' className='amount'>{formatCurrency?.format(quickViewData?.price)}</Typography>
                                                            </Stack>
                                                            : ''
                                                    }
                                                </Stack>
                                                :
                                                quickViewData?.price ?
                                                    <Stack className='price'>
                                                        <Stack className='sale-price price-block'>
                                                            <Typography variant='span' className='amount'>{formatCurrency?.format(quickViewData?.price)}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                    : ''
                                    }

                                </Stack>
                                {
                                    quickViewData?.sku ?
                                        <Stack className='variations sku'>
                                            <Typography variant='span' className='label'>SKU:</Typography>
                                            <Typography variant='span' className='value'>{quickViewData?.sku}</Typography>
                                        </Stack>
                                        : ''
                                }
                                {
                                    quickViewData?.stock_status == "In stock" ?
                                        <Stack className='variations availability'>

                                            <Typography variant='label' className='label'>Availability:</Typography>

                                            <Box className='Product-stock'>
                                                <Typography variant='span' className='checkmark'>
                                                    <img src={Checkicon} alt="" />
                                                </Typography>
                                                <Typography variant='span' className='instock'>{quickViewData?.stock_status}&nbsp;{!quickViewData?.grouped_product?.length ? `(${quickViewData?.quantity})` : ''}</Typography>
                                            </Box>

                                        </Stack>
                                        :
                                        <Stack className='variations availability'>

                                            <Typography variant='label' className='label'>Availability:</Typography>

                                            <Box className='Product-stock'>
                                                <Typography variant='span' className='checkmark'>
                                                    <img src={Outofstock} alt="" />
                                                </Typography>
                                                <Typography variant='span' className='out-of-stock'>{quickViewData?.stock_status}</Typography>
                                            </Box>

                                        </Stack>
                                }
                                {
                                    quickViewData?.size_in_kg ?
                                        <Stack className='variations product-weightr'>
                                            <Typography variant='h4' className='label'>Weight (Kg):</Typography>
                                            <Stack className='product-color-section'>
                                                <Stack className='item-block'>
                                                    <Typography className="value">{quickViewData?.size_in_kg}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        : ""
                                }
                                {
                                    quickViewData?.material ?
                                        <Stack className='variations product-weightr'>
                                            <Typography variant='h4' className='label'>Material:</Typography>
                                            <Stack className='product-color-section'>
                                                <Stack className='item-block'>
                                                    <Typography className="value">{quickViewData?.material}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        : ""
                                }
                                {
                                    !quickViewData?.grouped_product?.length && (quickViewData?.length || quickViewData?.width || quickViewData?.length) ?
                                        <Stack className='variations product-weightr'>
                                            <Typography variant='h4' className='label'>Size (LxWxH):</Typography>
                                            <Stack className='product-color-section'>
                                                <Stack className='item-block'>
                                                    <Typography className="value">
                                                        {quickViewData?.length ? `${quickViewData?.length}" x ` : "- x "}
                                                        {quickViewData?.width ? `${quickViewData?.width}" x ` : "- x "}
                                                        {quickViewData?.height ? `${quickViewData?.height}"` : "- x"}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        : ""
                                }

                                {
                                    quickViewData?.color ?
                                        <Stack className='variations product-color'>
                                            <Typography variant='h4' className='label'>Color:</Typography>
                                            <Stack className='product-color-section'>
                                                <Stack className='item-block'>
                                                    <Typography className="value">{quickViewData?.color}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        : ''
                                }

                                <Stack className='product_overview'>
                                    {
                                        quickViewData?.short_description ?
                                            <Stack className='descriptions short_description'>
                                                <Typography className='content' dangerouslySetInnerHTML={{ __html: quickViewData?.short_description }}></Typography>
                                            </Stack>
                                            : ''
                                    }
                                    {
                                        pageMessages?.showFor == 'quickview' ? <Messageblocks /> : ''
                                    }
                                    <Stack className='action_block'>
                                        {
                                            (quickViewData?.starting_from_price ||
                                                quickViewData?.starting_to_price) && quickViewData?.stock_status == "In stock" ?
                                                <Stack className='btn_blocks'>
                                                    <Box className={`btn_block cart ${showRotate === true ? 'synchronise-icon ' : ''}`}>
                                                        <Button
                                                            className='primary_default_btn'
                                                            disabled={showRotate === false ? false : true}
                                                            onClick={() => navigate(`/${quickViewData?.url_key}`)}
                                                        >View Product</Button>
                                                    </Box>
                                                </Stack>
                                                :
                                                <>
                                                    {
                                                        quickViewData?.stock_status == "In stock" ?
                                                            <>

                                                                <Stack className='btn_blocks'>
                                                                    <Stack className='count_block'>
                                                                        <Stack
                                                                            className='minus action'
                                                                            sx={{
                                                                                cursor: qtyValue <= 0 ? "not-allowed" : ""
                                                                            }}
                                                                            onClick={() => decrementHandler()}
                                                                        >
                                                                            <RemoveIcon />
                                                                        </Stack>
                                                                        <Box className='input-block'>
                                                                            <TextField
                                                                                className='input-text'
                                                                                type='number'
                                                                                value={qtyValue}
                                                                                onChange={(e) => {
                                                                                    if (e.target.value === '' || e.target.value === 0 || isValidNumber(e.target.value)) {
                                                                                        setQtyValue(e.target.value != 0 ? parseInt(e.target.value) : '')
                                                                                        dispatch(ACTION_PAGEMESSAGE({
                                                                                            show: false,
                                                                                            isSuccess: false,
                                                                                            isError: true,
                                                                                            isWarning: false,
                                                                                            message: "",
                                                                                            showFor: ""
                                                                                        }))
                                                                                    } else {
                                                                                        return false
                                                                                    }
                                                                                }}
                                                                                onKeyDown={evt => {
                                                                                    if (evt.which === 8 || evt.which === 37 || evt.which == 39 || evt.which == 46) {
                                                                                        return;
                                                                                    }
                                                                                    if (evt.which < 48 || evt.which > 57 || exceptThisSymbols.includes(evt.key) || !isValidNumber(evt.key)) {
                                                                                        evt.preventDefault();
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        <Stack className='plus action' onClick={() => increaMentHandler()}>
                                                                            <AddIcon />
                                                                        </Stack>
                                                                    </Stack>
                                                                    <Box className={`btn_block cart ${showRotate === true ? 'synchronise-icon ' : ''}`}>
                                                                        <Button
                                                                            className='primary_default_btn'
                                                                            disabled={showRotate === false ? false : true}
                                                                            onClick={() => {
                                                                                if (qtyValue < quickViewData?.min_qty) {
                                                                                    setQtyValue(quickViewData?.min_qty)
                                                                                    dispatch(ACTION_PAGEMESSAGE({
                                                                                        show: true,
                                                                                        isSuccess: false,
                                                                                        isError: true,
                                                                                        isWarning: false,
                                                                                        message: `The fewest you may purchase is ${quickViewData?.min_qty}.`,
                                                                                        showFor: "quickview"
                                                                                    }))
                                                                                } else {
                                                                                    addCartItems(quickViewData?.sku, qtyValue)
                                                                                }
                                                                            }}
                                                                        >{showRotate === true ? <LoopIcon className='rotate' /> : ""} Add To Cart</Button>
                                                                    </Box>
                                                                  
                                                                    <Box className={`btn_block buynow ${buyShowRotate === true ? 'synchronise-icon ' : ''} ${iosbuynowbtn ? 'ios13-buynow' : ''}`} >
                                                                        <Button
                                                                            className='secondary_default_btn'
                                                                            disabled={buyShowRotate === false ? false : true}
                                                                            onClick={() => {
                                                                                if (qtyValue < quickViewData?.min_qty) {
                                                                                    setQtyValue(quickViewData?.min_qty)
                                                                                    dispatch(ACTION_PAGEMESSAGE({
                                                                                        show: true,
                                                                                        isSuccess: false,
                                                                                        isError: true,
                                                                                        isWarning: false,
                                                                                        message: `The fewest you may purchase is ${quickViewData?.min_qty}.`,
                                                                                        showFor: "quickview"
                                                                                    }))
                                                                                } else {
                                                                                    buyNowAddCartItems(quickViewData?.sku, qtyValue)
                                                                                }
                                                                            }}
                                                                        >{buyShowRotate === true ? <LoopIcon className='rotate' /> : ""} Buy Now</Button>
                                                                    </Box>
                                                                </Stack>
                                                            </>
                                                            :
                                                            <Stack className='btn_blocks'>
                                                                <Box className='btn_block cart'>
                                                                    <Button
                                                                        className='outlined_default_btn'
                                                                        onClick={() => {
                                                                            if (isloggeduser) {
                                                                                actionNotify()
                                                                            } else {
                                                                                closePpup()
                                                                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                                                    loginReg: !showAuthencationPopup?.loginReg,
                                                                                    forgotPas: false,
                                                                                    resetPass: false
                                                                                }))
                                                                            }
                                                                        }}
                                                                    >Notify Me</Button>
                                                                </Box>
                                                            </Stack>
                                                    }
                                                </>
                                        }
                                        <Stack className='wishlist'>
                                            <Stack
                                                className='item_block'
                                                
                                            >
                                                <Stack className={`wishlist_items ${ioswishlist?'ios13wishlist':''}`} onClick={() => addToWishList()}>
                                                <img src={Wishlist} />
                                                <Typography className='content'>Add To Wishlist</Typography>
                                                </Stack>
                                             {
                                                bulkOrder==1 ?(<>
                                                   <Stack>
                                                            {/* quote */}
                                                                    <Box className={`btn_block cart ${showQuoteRotate === true ? 'synchronise-icon ' : ''}`}>
                                                                    <BootstrapTooltip title="The quote option requires a minimum order of 10 units">
                                                                     
                                                                        <Button
                                                                            className='outlined_default_btn'
                                                                            disabled={showQuoteRotate === false ? false : true}
                                                                            onClick={() => {
                                                                                if (qtyValue < 10) {
                                                                                    setQtyValue(quickViewData?.min_qty)
                                                                                    dispatch(ACTION_PAGEMESSAGE({
                                                                                        show: true,
                                                                                        isSuccess: false,
                                                                                        isError: true,
                                                                                        isWarning: false,
                                                                                        message: `The quote option requires a minimum order of 10 units`,
                                                                                        showFor: "quickview"
                                                                                    }))
                                                                                } else {
                                                                                    addQuoteItems(quickViewData?.sku, qtyValue,quickViewData?.id,quickViewData?.name,quickViewData?.price)
                                                                                    // addCartItems(quickViewData?.sku, qtyValue,)
                                                                                }
                                                                            }}
                                                                        >{showQuoteRotate === true ? <LoopIcon className='rotate' /> : ""}  Add To Quote</Button>
                                                                        </BootstrapTooltip>
                                                                                           
                                                                    </Box>
                                                                         {/* quote */}

                                                </Stack>
                                                </>):""
                                             }
                                             
                                                </Stack>
                                                
                                           
                                         
                                        </Stack>
                                        {
                                            bulkOrder==1 ?(
                                                <>
 <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>     
                                                </>
                                            ):""
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                </Stack>
            </ClickAwayListener >
        </Stack >

    )
}
export default Index;