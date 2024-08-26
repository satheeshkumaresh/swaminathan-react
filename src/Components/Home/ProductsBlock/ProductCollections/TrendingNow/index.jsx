import React, { useEffect, useState, memo } from 'react';
import "./styles.scss";
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Stack, Box, Button } from '@mui/material';
import Slider from "react-slick";
import LoopIcon from '@mui/icons-material/Loop';
import ProductTitleBlock from '../../../../ProductTitleBlock';
import ProductWishlist from '../../../../../Assets/home/Wishlist.svg';
import ProductQuickview from '../../../../../Assets/home/Quickview.svg';
import { formatCurrency } from '../../../../../Utilities/Utilities';
import ProductWishlistHover from '../../../../../Assets/home/Wishlisthover.svg';
import ProductQuickviewHover from '../../../../../Assets/home/QuickviewHover.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCutomerCartItems, addGuestCart, addWishList, ACTION_QUICKVIEW,
  ACTION_QUICKVIEWDATA, homeNotify_Me, ACTION_WISHLISTPRODUCTID, ACTION_SHOWAUTHENTICATIONPOPUP
} from "../../../../../Store/action";
import trendingProduct from '../../../../../Assets/skeleton/home/trendingProduct.svg';
import title3 from '../../../../../Assets/skeleton/home/title3.svg';
import title4 from '../../../../../Assets/skeleton/home/title4.svg';

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    trending, token, guestCartToken, isloggeduser, loggedInUserData,
    showAuthencationPopup, actionmessage, homeApiLoader
  } = useSelector(state => {
    return {
      trending: state?.homepage?.[0]?.offerproduct,
      token: state?.token,
      guestCartToken: state?.guestCartToken,
      isloggeduser: state?.isloggeduser,
      loggedInUserData: state?.loggedInUserData,
      showAuthencationPopup: state?.showAuthencationPopup,
      actionmessage: state?.actionmessage,
      homeApiLoader: state?.homeApiLoader
    }
  })
  const [showRotate, setShowRotate] = useState(false);
  const [rotateSameId, setRotateSameId] = useState(null);
  const [isHavingGroupedPoducts, setIsHavingGroupedPoducts] = useState(false);
  let dragging = false;
  const addCartItems = (sku, qty) => {
    if (isloggeduser) {
      addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, '', actionmessage?.isSesstionTimeOut)
    } else {
      addGuestCart(dispatch, guestCartToken, sku, qty, setShowRotate, '')
    }
  }
  const addToWishList = (productId) => {
    if (isloggeduser) {
      addWishList(token, dispatch, productId, false, "", actionmessage?.isSesstionTimeOut)
    } else {
      dispatch(ACTION_WISHLISTPRODUCTID(productId))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: !showAuthencationPopup?.loginReg,
        forgotPas: false,
        resetPass: false
      }))
    }
  }
  const actionNotify = (productId) => {
    const datas = {
      customerEmail: loggedInUserData?.email,
      productId: Number(productId)
    }
    if (isloggeduser) {
      homeNotify_Me(token, dispatch, datas, actionmessage?.isSesstionTimeOut)
    } else {
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: !showAuthencationPopup?.loginReg,
        forgotPas: false,
        resetPass: false
      }))
    }
  };
  const quickViewAction = (data) => {
    dispatch(ACTION_QUICKVIEWDATA(data))
    dispatch(ACTION_QUICKVIEW())
  }
  useEffect(() => {
    trending?.products?.map((item) => {
      if (!isHavingGroupedPoducts) {
        if (item?.starting_from_price || item?.starting_to_price) {
          setIsHavingGroupedPoducts(true)
        }
      } else {
        return
      }
    })
  }, [trending?.products])

  const settings = {
    dots: false,
    infinite: trending?.products?.length > 7 ? true : false,
    speed: 500,
    initialSlide: 1,
    slidesToShow: 7,
    swipeToSlide: true,
    beforeChange: () => dragging = true,
    afterChange: () => dragging = false,
    responsive: [
      {
        breakpoint: 1799,
        settings: {
          infinite: trending?.products?.length > 7 ? true : false,
          slidesToShow: 7,
          initialSlide: 1
        }
      },
      {
        breakpoint: 1680,
        settings: {
          infinite: trending?.products?.length > 5 ? true : false,
          slidesToShow: 5,
          initialSlide: 1
        }
      },
      {
        breakpoint: 1440,
        settings: {
          infinite: trending?.products?.length > 5 ? true : false,
          slidesToShow: 5,
          initialSlide: 1
        }
      },
      {
        breakpoint: 1380,
        settings: {
          infinite: trending?.products?.length > 5 ? true : false,
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          infinite: trending?.products?.length > 5 ? true : false,
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 1199,
        settings: {
          infinite: trending?.products?.length > 4 ? true : false,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          infinite: trending?.products?.length > 4 ? true : false,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 860,
        settings: {
          infinite: trending?.products?.length > 4 ? true : false,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 767,
        settings: {
          infinite: trending?.products?.length > 3 ? true : false,
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 567,
        settings: {
          infinite: trending?.products?.length > 2 ? true : false,
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 340,
        settings: {
          infinite: trending?.products?.length > 1 ? true : false,
          slidesToShow: 1,
        }
      }
    ]
  };
  const trendingNowData = (
    homeApiLoader ?
      <Stack className="trending-block-section">
        <Stack className="trendingnow-section">
          <ProductTitleBlock
            title={trending?.title}
          />

          <Stack className='product-grid-section'>
            <>
              <Slider {...settings}>
                {
                  ['', '', '', '', '', '', '', '']?.map((item, index) => {
                    return (
                      <Stack className='product-grid-list product_grid_list_skeleton' key={index}>
                        <Stack className='product-image-info-grid'>
                          <Stack className='product-image-grid'>
                            <Typography className='image-link-section' to=''>
                              <img src={trendingProduct} className="whychoose-image" alt='' />
                            </Typography>
                          </Stack>
                          <div className='product-info-section'>
                            <Link className='productname-text' to=''>
                              <img src={title3} className="whychoose-image" alt='' />
                              <img src={title4} className="whychoose-image" alt='' />
                              <img src={title4} className="whychoose-image" alt='' />
                            </Link>
                          </div>
                        </Stack>
                      </Stack>
                    )
                  })
                }
              </Slider>
            </>
          </Stack>
        </Stack>

      </Stack>
      :
      trending?.products?.length ?
        <Stack className="trending-block-section">
          <Stack className="trendingnow-section">
            <ProductTitleBlock
              title={trending?.title}
            />

            <Stack className='product-grid-section'>
              <>
                <Slider {...settings}>
                  {
                    trending?.products?.map((item, index, arr) => {
                      return (
                        <Stack className='product-grid-list' key={index}>
                          <Stack className='product-image-info-grid'>
                            <Stack className='product-image-grid'>
                              <Link className='image-link-section' to={`/${item?.url_key}`}
                                onClick={(e) => arr?.length > 1 ? dragging && e.preventDefault() : ''}
                              >
                                <img src={item?.media_gallery?.image?.[0]} className="whychoose-image" alt={item?.name} loading="lazy" />
                              </Link>
                              {
                                item?.tag?.new_arrival || item?.tag?.on_offer ?
                                  <Box className='tag-section'>
                                    {
                                      item?.tag?.on_offer ? <Typography className='tag-content'>{item?.tag?.on_offer}</Typography> : ''
                                    }
                                    {
                                      item?.tag?.new_arrival ? <Typography className='tag-content newarrival'>{item?.tag?.new_arrival}</Typography> : ''
                                    }

                                  </Box>
                                  : ''
                              }
                              <Box className='hover-tag-section'>
                                <Typography className='tag-img'
                                  onClick={() => addToWishList(item?.id)}
                                >
                                  <img src={ProductWishlist} className='product-wishlist' alt='Wishlist' />
                                  <img src={ProductWishlistHover} className='product-wishlist-hover' alt='Wishlist' />
                                </Typography>
                                <Typography className='tag-img'
                                  onClick={() => quickViewAction(item)}
                                >
                                  <img src={ProductQuickview} className='product-quickview' alt='Quickview' />
                                  <img src={ProductQuickviewHover} className='product-quickview-hover' alt='Quickview' />
                                </Typography>
                              </Box>
                            </Stack>
                            <div className='product-info-section'>
                              <Link
                                className='productname-text'
                                onClick={(e) => item?.product?.length > 1 ? dragging && e.preventDefault() : ''}
                                to={`/${item?.url_key}`}
                              ><Typography className='productname-text' variant="h4">{item?.name}</Typography></Link>
                              <Typography varient="span">
                                <Typography varient="span" className='price'>
                                  {/* {priceInfo(item)} */}
                                  {
                                    item?.price || item?.special_price ?
                                      item?.special_price ?
                                        <div
                                          className={`price-section ${isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ? "hidden" : ""} ${item?.special_price ? "special" : ""}`}>
                                          {
                                            isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ?
                                              <Typography className='product-price-text price hidden'>From</Typography> : ""
                                          }
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
                                          {
                                            isHavingGroupedPoducts ? <Typography className='hidden'>From</Typography> : ""
                                          }
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
                                          <span className='specialprice-tag'>From</span>
                                          <span className='product-price-text special-price'>{formatCurrency?.format(item?.starting_from_price)}</span>
                                        </div>
                                      : ''
                                  }
                                </Typography>
                              </Typography>
                              {
                                (item?.starting_from_price || item?.starting_to_price) && item?.stock_status == "In stock" ?
                                  <Button
                                    className={`common-btn-section primary_default_btn product-addcart-btn synchronise-icon 
                  ${showRotate == true && rotateSameId == index ? 'rotateUpdate' : ''}`}
                                    fullWidth
                                    disabled={showRotate === false ? false : true}
                                    onClick={() => {
                                      navigate(`/${item?.url_key}`)
                                    }}
                                  >
                                    {showRotate === true && rotateSameId == index ? <LoopIcon /> : "View Product"}
                                  </Button>
                                  :
                                  item?.stock_status == "In stock" ?
                                    <Button
                                      className={` common-btn-section primary_default_btn product-addcart-btn synchronise-icon 
                        ${showRotate == true && rotateSameId == index ? 'rotateUpdate' : ''}`}
                                      fullWidth
                                      disabled={showRotate === false ? false : true}
                                      onClick={() => {
                                        addCartItems(item?.sku, item?.min_qty)
                                        setRotateSameId(index)
                                      }}
                                    >
                                      {showRotate === true && rotateSameId == index ? <LoopIcon /> : "Add To Cart"}
                                    </Button>
                                    :
                                    <Button
                                      className={` common-btn-section outlined_default_btn product-addcart-btn synchronise-icon ${showRotate == true && rotateSameId == index ? 'rotateUpdate' : ''}`}
                                      fullWidth
                                      disabled={showRotate === false ? false : true}
                                      onClick={() => actionNotify(item?.product_id)}
                                    >
                                      {showRotate === true && rotateSameId == index ? <LoopIcon /> : "Notify Me"}
                                    </Button>
                              }
                            </div>
                          </Stack>

                        </Stack>
                      )
                    })
                  }
                </Slider>
              </>
            </Stack>
          </Stack>
        </Stack>
        : <></>
  )

  return (
    <>
      {
        trendingNowData
      }
    </>
  )
}

export default memo(Index);
