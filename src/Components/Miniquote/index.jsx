import React, { useEffect, useRef, useState } from 'react';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';
import './styles.scss';
import {
    deleteCutomerCartItems, deleteAllCartItems, updateCutomerCartItems,
    updateGuestCart, deleteGuestCart, deleteGuestAllCartItems
} from "./APIList";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useSelector, useDispatch } from "react-redux";
import { isNumber } from '../../Utilities/Utilities';
import { useNavigate, Link } from 'react-router-dom';
import Model from "../Model";
import Messageblocks from "../Messageblocks";
import { formatCurrency, pressEnterCallFunction, exceptThisSymbols, isValidNumber } from "../../Utilities/Utilities";
import Tooltip from "../../Components/Tooltip"
import ClickAwayListener from '@mui/base/ClickAwayListener';
import EmptyCart from './Emptycart';

const Index = ({ anchors, openCart, setshowminiquote, showminiquote }) => {
    console.log("openCart",openCart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, miniCartDataItems, miniCartCount, guestCartToken,
        pageMessages, subTotal, miniCartDetails, actionmessage
    } = useSelector(state => {
        return {
            token: state?.token,
            miniCartDataItems: state?.miniCartDetails?.data,
            miniCartCount: state?.miniCartDetails?.total_no_of_items,
            subTotal: state?.miniCartDetails?.sub_total,
            guestCartToken: state?.guestCartToken,
            isLoading: state?.isLoading,
            userdata: state?.userdata,
            pageMessages: state?.pageMessages,
            miniCartDetails: state?.miniCartDetails,
            actionmessage: state?.actionmessage
        }
    })
    const focusStockStatus = useRef();
    const [isHavingOutofStock, setIsHavingOutofStock] = useState(false);
    const [focusOutofStock, setFocusOutofStock] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [isClickedDelete, setIsClickedDelete] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [rotateSameId, setRotateSameId] = useState(null);
    const [showMessage, setShowMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [miniCartData, setMiniCartData] = useState([]);
    const [state, setState] = useState({
        right: openCart,
    });
    const [stopClosing, setStopClosing] = useState(false);
    const [updateFields, setUpdateFields] = useState(false);
    const [isDeleteAll, setIsDeleteAll] = useState(false);
    const [cartId, setCartId] = useState(null);

    const deleteAllItems = () => {
        if (token) {
            deleteAllCartItems(token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'cart', actionmessage?.isSesstionTimeOut)
        } else if (guestCartToken) {
            deleteGuestAllCartItems(guestCartToken, dispatch, cartId, setOpen, setIsDeleteAll, navigate, 'cart')
        }
    }
    const increaMentCount = (qty, id) => {
        if (qty === 0) return
        setMiniCartData(
            miniCartData?.map((item, ind) => {
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
    const updateCart = (item) => {
        const data = {
            cartItem: {
                sku: item?.sku,
                qty: item?.qty
            }
        }
        if (token) {
            updateCutomerCartItems(token, dispatch, item?.item_id, data, setRotate, setRotateSameId, 'minicart', actionmessage?.isSesstionTimeOut)
        } else if (guestCartToken) {
            updateGuestCart(dispatch, guestCartToken, item?.item_id, data, setRotate, setRotateSameId, 'minicart')
        }
    }
    const deleteCart = () => {
        if (token) {
            deleteCutomerCartItems(token, dispatch, deleteItemId, setOpen, 'minicart', actionmessage?.isSesstionTimeOut)
        } else if (guestCartToken) {
            deleteGuestCart(guestCartToken, dispatch, deleteItemId, setOpen, 'minicart')
        }
    }

    useEffect(() => {
        setMiniCartData(miniCartDataItems)
    }, [miniCartDataItems])
    useEffect(() => {
        if (pageMessages?.showFor == "minicart") {
            setUpdateFields(!updateFields)
        }
    }, [pageMessages?.show == true ? pageMessages?.show : ''])

    useEffect(() => {
        miniCartData?.map((item) => {
            if (!isHavingOutofStock) {
                if (item?.stock == "Out of Stock") {
                    setIsHavingOutofStock(true)
                }
            } else {
                return
            }
        })
    }, [miniCartData])

    useEffect(() => {
        focusStockStatus.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }, [focusStockStatus.current, isHavingOutofStock, focusOutofStock]);
    useEffect(() => {
        setCartId(miniCartData?.[0]?.quote_id)
    }, [miniCartData])

    useEffect(() => {
        if (open) {
            setIsHavingOutofStock(false)
        }
    }, [open])
    return (<>
        <ClickAwayListener onClickAway={() => {
            if (!stopClosing) {
                setshowminiquote(!showminiquote)
            }
        }}>
            <div className='minicart-sidebar-rigth'>
                <Stack className="minicart_container">
                    <Box className='mini-cart-content'>
                        <Stack className="minicart_row">
                            <Stack className='header-section'>
                                <Box className='title-sec'>
                                    <Box className='title'>QUOTE </Box>
                                    {
                                        miniCartData?.length ? <Typography className='count' variant='span'>({miniCartCount})</Typography> : ''
                                    }
                                </Box>
                                <Box className='close-section' onClick={() => setshowminiquote(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <path id="close" d="M27,10.575,25.425,9,18,16.425,10.575,9,9,10.575,16.425,18,9,25.425,10.575,27,18,19.575,25.425,27,27,25.425,19.575,18Z" transform="translate(-9 -9)" fill="#767f80" />
                                    </svg>
                                </Box>
                            </Stack>
                            <Stack className='item-block'>
                                {
                                    miniCartData?.length ?
                                        <Stack className='product-item'>
                                            {
                                                miniCartData?.map((item, ind) => {
                                                    return (
                                                        <Stack className="cart_item" key={ind}>
                                                            <Stack className='image-description'>
                                                                <Box className="image_block">
                                                                    <Link to={`/${item?.product_url}`} onClick={() => setshowminiquote(false)}>
                                                                        <img src={item?.image} alt="..." />
                                                                    </Link>
                                                                    {
                                                                        item?.arrival_tag || item?.offer_tag ?
                                                                            <Box className='tag-section'>
                                                                                {
                                                                                    item?.offer_tag ? <Typography className='tag-content'>{item?.offer_tag}</Typography> : ''
                                                                                }
                                                                                {
                                                                                    item?.arrival_tag ? <Typography className='tag-content new-arrival'>{item?.arrival_tag}</Typography> : ''
                                                                                }

                                                                            </Box>
                                                                            : ''
                                                                    }
                                                                </Box>

                                                                <Stack className='description_block'>
                                                                    <Stack className='productname-price'>
                                                                        {
                                                                            item?.name ?
                                                                                <Link to={`/${item?.product_url}`} onClick={() => setshowminiquote(false)}>
                                                                                    <Typography className="title">{item?.name}</Typography>
                                                                                </Link>
                                                                                : ""
                                                                        }
                                                                        <Stack className='price-section row_total'>
                                                                            <Typography className="amount price">{formatCurrency?.format(item?.row_total)}</Typography>
                                                                        </Stack>

                                                                    </Stack>

                                                                    {
                                                                        item?.special_price ?
                                                                            <Stack className='price-section original_price'>
                                                                                <Typography className="amount price">{formatCurrency?.format(item?.special_price)}</Typography>
                                                                                <Typography className="amount old-price">{formatCurrency?.format(item?.price)}</Typography>
                                                                            </Stack>
                                                                            :
                                                                            <Stack className='price-section original_price'>
                                                                                <Typography className="amount price">{formatCurrency?.format(item?.price)}</Typography>
                                                                            </Stack>
                                                                    }
                                                                    {
                                                                        item?.weight_in_kg ?
                                                                            <Box className='size-sec data-value-section'>
                                                                                <Typography variant='span' className='size data'>Weight (Kg):</Typography>
                                                                                <Typography variant='span' className='value'>{item?.weight_in_kg}</Typography>
                                                                            </Box>
                                                                            : ""
                                                                    }
                                                                    {
                                                                        item?.color ?
                                                                            <Box className='color-sec data-value-section'>
                                                                                <Typography variant='span' className='color-title data'>Color:</Typography>
                                                                                <Typography variant='span' className='color value'>{item?.color}</Typography>
                                                                            </Box>
                                                                            : ""
                                                                    }
                                                                    <Stack className="action_block">
                                                                        {
                                                                            item?.stock == "In Stock" || (miniCartDataItems?.[ind]?.qty > miniCartDataItems?.[ind]?.available_qty && miniCartDataItems?.[ind]?.available_qty !== 0) ?
                                                                                <Stack className="quantity">
                                                                                    <ClickAwayListener onClickAway={() => {
                                                                                        if (miniCartDataItems?.[ind]?.qty !== item?.qty && item?.qty !== '' && item?.qty != 0 && item?.qty != '0' && !isClickedDelete) {
                                                                                            updateCart(item)
                                                                                            setRotateSameId(ind)
                                                                                            setShowMessage(ind)
                                                                                        }
                                                                                    }}>

                                                                                        <Stack className='count_block'>
                                                                                            <Stack
                                                                                                className='minus action'
                                                                                                sx={{
                                                                                                    cursor: item?.qty <= 0 ? "not-allowed" : ""
                                                                                                }}
                                                                                                onClick={() => {
                                                                                                    if (item?.qty <= 0) {
                                                                                                        increaMentCount(item?.qty, ind)
                                                                                                    } else {
                                                                                                        increaMentCount(item?.qty - 1, ind)
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <RemoveIcon />
                                                                                            </Stack>
                                                                                            <Box className='input-block'>
                                                                                                <TextField
                                                                                                    className='input-text'
                                                                                                    type='number'
                                                                                                    value={item?.qty}
                                                                                                    sx={{
                                                                                                        cursor: item?.qty <= 0 ? "not-allowed" : ""
                                                                                                    }}

                                                                                                    onChange={(e) => {
                                                                                                        if (e.target.value == '' || e.target.value === 0 || isNumber.test(e.target.value)) {
                                                                                                            increaMentCount(e.target.value ? parseInt(e.target.value) : '', ind)
                                                                                                        } else {
                                                                                                            return false
                                                                                                        }
                                                                                                    }}
                                                                                                    onKeyDown={evt => {
                                                                                                        pressEnterCallFunction(evt, () => {
                                                                                                            if (miniCartDataItems?.[ind]?.qty !== item?.qty && item?.qty !== '' && item?.qty != 0 && item?.qty != '0') {
                                                                                                                updateCart(item)
                                                                                                                setRotateSameId(ind)
                                                                                                                setShowMessage(ind)
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
                                                                                                onClick={() => {
                                                                                                    increaMentCount(item?.qty == '' ? 1 : item?.qty + 1, ind)
                                                                                                }}
                                                                                            >
                                                                                                <AddIcon />
                                                                                            </Stack>
                                                                                        </Stack>

                                                                                    </ClickAwayListener>
                                                                                </Stack>
                                                                                : ''
                                                                        }

                                                                        <Stack className="buttons_block">
                                                                            {
                                                                                rotate && rotateSameId == ind && item?.stock == "In Stock" ?
                                                                                    <Box className={`synchronise-icon ${rotate == true ? 'rotateUpdate' : ''}`}
                                                                                        onClick={() => setRotateSameId(ind)}
                                                                                    >
                                                                                        <svg className='sync' id="Component_62_6" data-name="Component 62 – 6" xmlns="http://www.w3.org/2000/svg" width="17.578" height="24.17" viewBox="0 0 17.578 24.17">
                                                                                            <path id="Path_233" data-name="Path 233" d="M16.789,7.493v3.3l4.395-4.395L16.789,2V5.3A8.774,8.774,0,0,0,9.362,18.765l1.6-1.6a6.513,6.513,0,0,1-.769-3.076A6.59,6.59,0,0,1,16.789,7.493ZM24.216,9.4l-1.6,1.6a6.513,6.513,0,0,1,.769,3.076,6.59,6.59,0,0,1-6.592,6.592v-3.3l-4.395,4.395,4.395,4.395v-3.3A8.774,8.774,0,0,0,24.216,9.4Z" transform="translate(-8 -2)" fill="#767f80" />
                                                                                        </svg>
                                                                                        <svg className='sync-hover' id="Component_62_10" data-name="Component 62 – 10" xmlns="http://www.w3.org/2000/svg" width="17.578" height="24.17" viewBox="0 0 17.578 24.17">
                                                                                            <path id="Path_233" data-name="Path 233" d="M16.789,7.493v3.3l4.395-4.395L16.789,2V5.3A8.774,8.774,0,0,0,9.362,18.765l1.6-1.6a6.513,6.513,0,0,1-.769-3.076A6.59,6.59,0,0,1,16.789,7.493ZM24.216,9.4l-1.6,1.6a6.513,6.513,0,0,1,.769,3.076,6.59,6.59,0,0,1-6.592,6.592v-3.3l-4.395,4.395,4.395,4.395v-3.3A8.774,8.774,0,0,0,24.216,9.4Z" transform="translate(-8 -2)" fill="#b98457" />
                                                                                        </svg>
                                                                                        <Box className='tool-display'><Tooltip value={"Update"} /></Box>
                                                                                    </Box>
                                                                                    : ''
                                                                            }
                                                                            <ClickAwayListener onClickAway={() => {
                                                                                setTimeout(() => {
                                                                                    if (isClickedDelete && !open) {
                                                                                        setIsClickedDelete(false)
                                                                                    }
                                                                                }, 200);
                                                                            }}>
                                                                                <Box
                                                                                    className="delete_qty btn_block"
                                                                                    onClick={() => {
                                                                                        setIsClickedDelete(true)
                                                                                        setOpen(true)
                                                                                        setDeleteItemId(item?.item_id)
                                                                                        setShowMessage(ind)
                                                                                        setStopClosing(true)
                                                                                    }}
                                                                                >
                                                                                    <svg className='delete' id="Component_63_16" data-name="Component 63 – 16" xmlns="http://www.w3.org/2000/svg" width="17.349" height="20.624" viewBox="0 0 17.349 20.624">
                                                                                        <g id="da086273b974cb595139babd4da17772">
                                                                                            <path id="da086273b974cb595139babd4da17772-2" data-name="da086273b974cb595139babd4da17772" d="M22.622,11.4l-.364,11.029a3.633,3.633,0,0,1-3.644,3.514H11.69a3.633,3.633,0,0,1-3.644-3.51L7.682,11.4a.911.911,0,0,1,1.822-.06l.364,11.032a1.822,1.822,0,0,0,1.822,1.752h6.923a1.822,1.822,0,0,0,1.822-1.755L20.8,11.343a.911.911,0,1,1,1.822.06Zm1.205-1.67a.911.911,0,0,1-.911.911H7.389a.911.911,0,1,1,0-1.822h2.824a1.162,1.162,0,0,0,1.16-1.046,2.725,2.725,0,0,1,2.718-2.454h2.123a2.725,2.725,0,0,1,2.718,2.454,1.162,1.162,0,0,0,1.16,1.046h2.824a.911.911,0,0,1,.911.911ZM12.954,8.822h4.4a3.006,3.006,0,0,1-.232-.86.911.911,0,0,0-.905-.82H14.092a.911.911,0,0,0-.905.82,3.006,3.006,0,0,1-.233.86Zm.917,11.8V12.867a.911.911,0,0,0-1.822,0v7.76a.911.911,0,1,0,1.822,0Zm4.385,0V12.867a.911.911,0,0,0-1.822,0v7.76a.911.911,0,0,0,1.822,0Z" transform="translate(-6.478 -5.322)" fill="#2b2525" />
                                                                                        </g>
                                                                                    </svg>
                                                                                    <svg className='delete-hover' id="Component_63_16" data-name="Component 63 – 16" xmlns="http://www.w3.org/2000/svg" width="17.349" height="20.624" viewBox="0 0 17.349 20.624">
                                                                                        <g id="da086273b974cb595139babd4da17772">
                                                                                            <path id="da086273b974cb595139babd4da17772-2" data-name="da086273b974cb595139babd4da17772" d="M22.622,11.4l-.364,11.029a3.633,3.633,0,0,1-3.644,3.514H11.69a3.633,3.633,0,0,1-3.644-3.51L7.682,11.4a.911.911,0,0,1,1.822-.06l.364,11.032a1.822,1.822,0,0,0,1.822,1.752h6.923a1.822,1.822,0,0,0,1.822-1.755L20.8,11.343a.911.911,0,1,1,1.822.06Zm1.205-1.67a.911.911,0,0,1-.911.911H7.389a.911.911,0,1,1,0-1.822h2.824a1.162,1.162,0,0,0,1.16-1.046,2.725,2.725,0,0,1,2.718-2.454h2.123a2.725,2.725,0,0,1,2.718,2.454,1.162,1.162,0,0,0,1.16,1.046h2.824a.911.911,0,0,1,.911.911ZM12.954,8.822h4.4a3.006,3.006,0,0,1-.232-.86.911.911,0,0,0-.905-.82H14.092a.911.911,0,0,0-.905.82,3.006,3.006,0,0,1-.233.86Zm.917,11.8V12.867a.911.911,0,0,0-1.822,0v7.76a.911.911,0,1,0,1.822,0Zm4.385,0V12.867a.911.911,0,0,0-1.822,0v7.76a.911.911,0,0,0,1.822,0Z" transform="translate(-6.478 -5.322)" fill="#9b3c0b" />
                                                                                        </g>
                                                                                    </svg>
                                                                                    <Box className='tool-display'><Tooltip value={"Delete"} /></Box>
                                                                                </Box>
                                                                            </ClickAwayListener>
                                                                        </Stack>
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack>
                                                            {
                                                                item?.stock !== "In Stock" ?
                                                                    item?.available_qty == 0 ?
                                                                        <Typography className='out_of_stock_message' ref={focusStockStatus}>
                                                                            This product is currently out of stock.
                                                                            Remove this product to proceed to checkout.
                                                                        </Typography>
                                                                        :
                                                                        <Typography className='out_of_stock_message' ref={focusStockStatus}>
                                                                            The requested product quantity is not available.
                                                                        </Typography>

                                                                    : ''
                                                            }
                                                            {
                                                                showMessage == ind && pageMessages?.showFor == 'minicart' ? <Messageblocks /> : ''
                                                            }
                                                        </Stack>
                                                    )
                                                })
                                            }
                                        </Stack>
                                        : ""
                                }
                                {
                                    miniCartData?.length ?
                                        <Stack className="minicart_actions-row">
                                            <Stack className="shipping_block">
                                                <Typography className="title">Shipping:</Typography>
                                                <Typography className="amount">Calculated at checkout</Typography>
                                            </Stack>
                                            <Stack className="amount_block">
                                                <Typography className="title">Subtotal:</Typography>
                                                <Typography className="amount">{formatCurrency?.format(subTotal)}</Typography>
                                            </Stack>
                                            <Stack
                                                className="actions_block"
                                                sx={{
                                                    cursor: !miniCartData?.length ? "not-allowed" : "",
                                                    pointerEvents: !miniCartData?.length ? "none" : ""
                                                }}
                                            >
                                                {/* future use */}
                                                {/* <Box className="button checkout">
                                                    <Button
                                                        className='primary_default_btn '
                                                        onClick={() => {
                                                            if (!isHavingOutofStock) {
                                                                navigate('/checkout')
                                                                setshowminiquote(false)
                                                            } else {
                                                                setFocusOutofStock(!focusOutofStock)
                                                            }
                                                        }}
                                                    >Proceed To Checkout</Button>
                                                </Box> */}
                                                {/* <Box className="button view_cart">
                                                    <Button
                                                        className='outlined_default_btn'
                                                        onClick={() => {
                                                            navigate('/mycart')
                                                            setshowminiquote(false)
                                                        }}
                                                    >View and Edit Cart</Button>
                                                </Box> */}
                                                {/* quote */}
                                                <Box className="button view_cart">
                                                    <Button
                                                        className='outlined_default_btn'
                                                        onClick={() => {
                                                            navigate('/myquote')
                                                            setshowminiquote(false)
                                                        }}
                                                    >View and Edit Quote</Button>
                                                </Box>
                                                  {/* quote */}
                                                <Box className="view_cart delete-all-cart clear-cart">
                                                    <Button className='cart_continue_btn_section'
                                                        onClick={() => {
                                                            setIsClickedDelete(true)
                                                            setOpen(true)
                                                            setIsDeleteAll(true)
                                                            setStopClosing(true)
                                                        }}
                                                    >Clear Quote</Button>
                                                </Box>

                                            </Stack>
                                        </Stack>
                                        : ''
                                }

                                {
                                    // miniCartDetails?.message == "You have no items in your Quote." ?
                                    miniCartDetails?.message == "You have no items in your cart."
                                    // true
                                    ?
                                        <EmptyCart
                                            setState={setState}
                                            setshowminiquote={setshowminiquote}
                                            showminiquote={showminiquote}
                                            // setshowminicart={setshowminicart}
                                            // showminicart={showminicart}
                                        />
                                        : ''
                                }
                            </Stack>

                        </Stack>
                    </Box>
                </Stack>
            </div>
        </ClickAwayListener>
        {open && <Model
            name="minicart_alert"
            closePpup={() => {
                setOpen(false)
                setTimeout(() => {
                    setStopClosing(false)
                }, 200);
            }}
            action={() => isDeleteAll ? deleteAllItems() : deleteCart()}
            hideCloseIcon={true}
            enableAlert={true}
            alertMessage="Are you sure you want to remove this item from the Quote?"
        />}
    </>);
}
export default Index;