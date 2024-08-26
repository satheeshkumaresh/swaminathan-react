import { Stack, Typography, Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./styles.scss";
import {
  notify_Me, ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_GROUPEDFROMWISHLISTTOCART
} from "../../../../../Store/action";
import { ACTION_MYACCOUNTCURRENTPAGE, deleteWishList, addAllToCart, wishlistAddToCart } from "../../APIList";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import Select from "../../../Select/Show";
import LoopIcon from '@mui/icons-material/Loop';
import { formatCurrency } from '../../../../../Utilities/Utilities';
import Model from "../../../../Model";

const Index = ({ accountCurrentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const [isHavingGroupedPoducts, setIsHavingGroupedPoducts] = useState(false);

  const { wishlistData, token, userdata, isloggeduser,
    showAuthencationPopup, actionmessage
  } = useSelector(state => {
    return {
      wishlistData: state?.wishlistData,
      token: state?.token,
      userdata: state?.userdata,
      isloggeduser: state?.isloggeduser,
      showAuthencationPopup: state?.showAuthencationPopup,
      actionmessage: state?.actionmessage
    }
  })
  const [deleteItemId, setDeleteItemId] = useState();
  const [open, setOpen] = useState(false);
  const [isSameId, setIsSameId] = useState(null);
  const [show, setShow] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRotate, setShowRotate] = useState(false);
  const pageCount = Math.ceil(wishlistData?.item_count / show);
  const [callPaginationHandler, setCallPaginationHandler] = useState(false);

  const handlePageClick = (event) => {
    setTimeout(() => {
      setCallPaginationHandler(true)
    }, 300);
    if (callPaginationHandler) {
      setCurrentPage(event?.selected)
      navigate(
        {
          search: `&page=${event?.selected + 1}${searchParams.get('show') ? `&show=${searchParams.get('show')}` : ''}`,
        }
      )
    }
  };
  const deleteWishlist = () => {
    deleteWishList(token, dispatch, deleteItemId, setOpen, "account", actionmessage?.isSesstionTimeOut)
  }
  const actionNotify = (itemId) => {
    const datas = {
      customerEmail: userdata?.email,
      productId: Number(itemId)
    }
    if (isloggeduser) {
      notify_Me(token, dispatch, datas, actionmessage?.isSesstionTimeOut)
    } else {
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: !showAuthencationPopup?.loginReg,
        forgotPas: false,
        resetPass: false
      }))
    }
  };
  const addCartItems = (sku, qty, wishlist_id) => {
    wishlistAddToCart(token, dispatch, sku, qty, wishlist_id, setShowRotate, 'account', actionmessage?.isSesstionTimeOut)
  }
  const addAllToCartList = () => {
    addAllToCart(token, dispatch, "account", actionmessage?.isSesstionTimeOut)
  }
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("My Wishlist"))
  }, [])
  useEffect(() => {
    if (wishlistData?.page) {
      setCurrentPage(parseInt(wishlistData?.page))
    }
    if (wishlistData?.show_per) {
      setShow(wishlistData?.show_per)
    }
  }, [wishlistData])

  const count = [
    {
      label: "15",
      value: 15
    },
    {
      label: "18",
      value: 18
    },
    {
      label: "24",
      value: 24
    },
    {
      label: "30",
      value: 30
    }
  ]

  return (
    <>
      <Stack className="mywishlist-page">
        <Stack className="main_block">
          <Box className='title-item'>
            <Stack className="header page-title">{accountCurrentPage}</Stack>
            {
              wishlistData?.item_count ?
                <Stack className='item-sec'>
                  <Typography className='value'><small>{wishlistData?.item_count}</small></Typography>
                  <Typography className='item'><small>{wishlistData?.item_count > 0 ? 'Items' : 'Item'}</small></Typography>
                </Stack>
                : ''
            }
          </Box>
          {wishlistData?.data?.length ?
            <>

              <Stack className='wishlist-product-section'>
                {
                  wishlistData?.data?.map((item, ind) => {
                    return (
                      <Stack className='product-grid-list' >
                        <Stack className='product-image-info-grid'>
                          <Stack className='product-image-grid'>
                            {
                              item?.stock_status == "Out of stock" ?
                                <Stack className='outofstock-section'>
                                  <Typography className='notify-content'>{item?.stock_status}</Typography>
                                </Stack>
                                : ""
                            }
                            <Link className='image-link-section'
                              to={`/${item?.product_url}`}
                              onClick={() => {
                                if (item?.starting_from_price || item?.starting_to_price) {
                                  dispatch(ACTION_GROUPEDFROMWISHLISTTOCART({
                                    id: item?.wishlist_item_id,
                                    sku: item?.sku
                                  }))
                                }
                              }}
                            >
                              <img src={item?.image} alt="..." />
                            </Link>
                            <Stack
                              className='close-icon'
                              onClick={() => {
                                setDeleteItemId(item?.wishlist_item_id)
                                setOpen(true)
                              }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                <g id="Group_3368" data-name="Group 3368" transform="translate(-692 -313)">
                                  <g id="Ellipse_167" data-name="Ellipse 167" transform="translate(692 313)" fill="#fff" stroke="#ebebeb" stroke-width="1">
                                    <circle cx="10" cy="10" r="10" stroke="none" />
                                    <circle cx="10" cy="10" r="9.5" fill="none" />
                                  </g>
                                  <g id="close-line" transform="translate(687.183 308.098)">
                                    <path id="Path_11724" data-name="Path 11724" d="M15.438,14.893l3.506-3.506a.423.423,0,0,0-.6-.6L14.842,14.3l-3.506-3.511a.425.425,0,1,0-.6.6l3.511,3.506L10.735,18.4a.423.423,0,1,0,.6.6l3.511-3.506L18.348,19a.423.423,0,0,0,.6-.6Z" fill="#898d94" />
                                  </g>
                                </g>
                              </svg>
                            </Stack>

                          </Stack>
                          <div className='product-info-section'>
                            {
                              item?.name ? <Link
                                className='productname-text'
                                to={`/${item?.product_url}`}
                                onClick={() => {
                                  if (item?.starting_from_price || item?.starting_to_price) {
                                    dispatch(ACTION_GROUPEDFROMWISHLISTTOCART({
                                      id: item?.wishlist_item_id,
                                      sku: item?.sku
                                    }))
                                  }
                                }}
                              >
                                <Typography className='productname-text' variant="h4">{item?.name}</Typography>
                              </Link> : ''
                            }
                            {/* price block */}
                            <Typography varient="span">
                              <Typography varient="span" className='price'>

                                {
                                  item?.price || item?.special_price ?
                                    item?.special_price ?
                                      <div
                                        className={`price-section ${isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ? "hidden" : ""} ${item?.special_price ? "special" : ""}`}>
                                        <Typography className='product-price-text hidden'>From</Typography>
                                        <Stack className='special_price'>
                                          {
                                            item?.special_price ? <span className='product-price-text price'>{formatCurrency?.format(item?.special_price)}</span> : ''
                                          }
                                          {
                                            item?.price ? <span className='product-price-text old-price'>{formatCurrency?.format(item?.price)}</span> : ''
                                          }
                                        </Stack>
                                      </div>
                                      :
                                      <div className={`price-section ${isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ? "hidden" : ""}`}>
                                        <Typography className='hidden'>From</Typography>
                                        {
                                          item?.price ? <span className='product-price-text price'>{formatCurrency?.format(item?.price)}</span> : ''
                                        }
                                      </div>
                                    : ''
                                }
                                {
                                  item?.starting_from_price || item?.starting_to_price ?
                                    item?.starting_to_price ?
                                      <div className='price-section multiple'>
                                        <Typography className='from_label'>
                                          <span className='specialprice-tag'>From</span>
                                        </Typography>
                                        <Typography className='price_block'>
                                          <span className='product-price-text special-price'>{formatCurrency?.format(item?.starting_from_price)}</span>
                                          <span className='product-price-text special-price'>- {formatCurrency?.format(item?.starting_to_price)}</span>
                                        </Typography>
                                      </div>
                                      :
                                      <div className='price-section'>
                                        <span className='product-price-text special-price'>{formatCurrency?.format(item?.starting_from_price)}</span>
                                      </div>
                                    : ''
                                }

                              </Typography>
                            </Typography>
                            {/* Buttons */}
                            {
                              item?.starting_from_price || item?.starting_to_price ?
                                item?.stock == "Instock" ?
                                  <Button
                                    className={`common-btn-section primary_default_btn product-addcart-btn synchronise-icon 
                            ${showRotate == true && isSameId == ind ? 'rotateUpdate' : ''}`}
                                    fullWidth
                                    disabled={showRotate === false ? false : true}
                                    onClick={() => {
                                      navigate(`/${item?.product_url}`)
                                      dispatch(ACTION_GROUPEDFROMWISHLISTTOCART({
                                        id: item?.wishlist_item_id,
                                        sku: item?.sku
                                      }))
                                    }}
                                  >
                                    {showRotate === true && isSameId == ind ? <LoopIcon /> : "View Product"}
                                  </Button>
                                  :
                                  <Box className="notify-button">
                                    <Button className='common-btn-section outlined_default_btn product-addcart-btn synchronise-icon' onClick={() => actionNotify(item?.product_id)}>Notify Me</Button>
                                  </Box>

                                :
                                item?.stock == "Instock" ?
                                  <Box className={`notify-button ${showRotate === true && isSameId == ind ? 'rotate-icon' : ''}`}>
                                    <Button
                                      className='mobile-btn common-btn-section primary_default_btn product-addcart-btn synchronise-icon rotateUpdate'
                                      disabled={showRotate === false ? false : true}
                                      onClick={() => {
                                        setIsSameId(ind)
                                        addCartItems(item?.sku, Number(item?.qty), item?.wishlist_item_id)
                                      }}
                                    >{showRotate === true && isSameId == ind ? <LoopIcon className='rotate' /> : "Add To Cart"} </Button>
                                  </Box>
                                  :
                                  <Box className="notify-button">
                                    <Button className='common-btn-section outlined_default_btn product-addcart-btn synchronise-icon' onClick={() => actionNotify(item?.product_id)}>Notify Me</Button>
                                  </Box>
                            }
                          </div>
                        </Stack>
                      </Stack>
                    )
                  })
                }
              </Stack>
              <Stack className='add-all'>
                <Button
                  className='outlined_default_btn'
                  onClick={() => addAllToCartList()}
                >Add All To Cart</Button>
              </Stack>
              <Stack className='filter-blocks filter-blocks-bottom'>
                <Stack className='bottom-section'>
                  {/* Pagination */}
                  <ReactPaginate
                    breakLabel="..."
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    renderOnZeroPageCount={null}
                    activeClassName={"paginationActive"}
                    containerClassName={"pagination-pages"}
                    initialPage={currentPage === 0 ? 0 : currentPage - 1}
                    forcePage={currentPage === 0 ? 0 : currentPage - 1}
                  />
                  <Box className="show">
                    <Box className='title-show'><small>Show</small></Box>
                    <Select
                      data={count}
                      setShow={setShow}
                      appliedShow={wishlistData?.show_per}
                      totalData={wishlistData?.item_count}
                    />
                    <Box className='show-page'><small>/Page</small></Box>
                  </Box>
                </Stack>
              </Stack>
            </>
            : <Typography className='empty-msg'> You have no items in your wishlist.</Typography>
          }
        </Stack>
        <Stack className='button-sec'>
          <Button
            className='primary_default_btn'
            onClick={() => navigate(-1)}
          >Back</Button>
        </Stack>
      </Stack >
      {open && <Model
        name="minicart_alert"
        closePpup={() => setOpen(false)}
        action={() => deleteWishlist()}
        hideCloseIcon={true}
        enableAlert={true}
        alertMessage="Are you sure you want to remove this item from the wishlist?"
      />
      }
    </>
  )
}

export default Index;