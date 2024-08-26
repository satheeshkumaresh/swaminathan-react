import React, { useState, useEffect, useLayoutEffect } from 'react';
import "./styles.scss";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Stack, Box, Button,Tooltip,Grid } from '@mui/material';
import Select from "../Select";
import Breadcrumbs from './Breadcrumbs';
import Closeicon from '../../../Assets/header/sidebar/closeIcon.svg';
import ProductWishlist from '../../../Assets/home/Wishlist.svg';
import ProductQuickview from '../../../Assets/home/Quickview.svg';
import ProductWishlistHover from '../../../Assets/home/Wishlisthover.svg';
import ProductQuickviewHover from '../../../Assets/home/QuickviewHover.svg';
import Wishlist from '../../../Assets/pdpnew/wishlist.svg';
import Quickview from '../../../Assets/pdpnew/Quicview.svg';
import ReactPaginate from "react-paginate";
import OneGrid from '../../../Assets/Clienticons/swaminathan-icons-39.svg';
import OneGridActive from '../../../Assets/Clienticons/swaminathan-icons-42.svg';
import TwoList from '../../../Assets/Clienticons/swaminathan-icons-13.svg';
import TwoListActive from '../../../Assets/Clienticons/swaminathan-icons-31.svg';
import Sidenavigator from "./Sidenavigator";
import TwoGrid from '../../../Assets/Clienticons/swaminathan-icons-14.svg';
import TwoGridActive from '../../../Assets/Clienticons/swaminathan-icons-38.svg';
import ThreeGrid from '../../../Assets/Clienticons/swaminathan-icons-35.svg';
import ThreeGridActive from '../../../Assets/Clienticons/swaminathan-icons-32.svg';
import FourGrid from '../../../Assets/Clienticons/swaminathan-icons-34.svg';
import FourGridActive from '../../../Assets/Clienticons/swaminathan-icons-37.svg';
import FiveGrid from '../../../Assets/Clienticons/swaminathan-icons-33.svg';
import FiveGridActive from '../../../Assets/Clienticons/swaminathan-icons-36.svg';
import SixGrid from '../../../Assets/Clienticons/swaminathan-icons-40.svg';
import SixGridActive from '../../../Assets/Clienticons/swaminathan-icons-41.svg';
import LoopIcon from '@mui/icons-material/Loop';
import { styled } from '@mui/material/styles';
import {
  addCutomerCartItems, addGuestCart, addWishList, ACTION_QUICKVIEW,
  ACTION_QUICKVIEWDATA, notify_Me, ACTION_SCROLLTOTOP,
  ACTION_WISHLISTPRODUCTID, ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_SEARCHEDTEXT, ACTION_ISSEARCHRESULT, addGuestQuote
} from "../../../Store/action";
import { productSearchResultAPI, productListAPI } from './APIList';
import { formatCurrency } from "../../../Utilities/Utilities";
import { useDispatch, useSelector } from 'react-redux';
import Pageloader from "../../Loader/Pageloader";
import { Helmet } from "react-helmet-async";
import Errorpage from "../../../Pages/UserAuth/Errorpage";
import { tooltipClasses } from '@mui/material';
import traditional from "../../../Assets/PLP/traditional.png";
import manufacturing from "../../../Assets/PLP/manufacturing.png";
import godstatue from "../../../Assets/PLP/godstatue.png";
import preseve  from "../../../Assets/PLP/preseve.png";
const countvalue = [
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

const images = [
  {
    "title": "RICH IN TRADITIONAL VALUE",
    "url": traditional
  },
  {
    "title": "MANUFACTURING OUR MATERIALS",
    "url": manufacturing
  },
  {
    "title": "HAND CRAFTED BY TRADITIONAL ARTISANS",
    "url": godstatue
  },
  {
    "title": "PRESERVE AND SHARE CULTURAL WISDOM",
    "url": preseve
  }
];

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
}
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
  const [width, height] = useWindowSize();
  const [openCategories, setOpenCategories] = useState(true);
  let [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    productlistData,
    token, guestCartToken, isloggeduser, loggedInUserData, showAuthencationPopup,
    searchfilterparams, isSearchResult, actionmessage,bulkOrder
  } = useSelector(state => {
    return {
      productlistData: state?.productListData?.[0]?.data?.[0],
      bulkOrder: state?.productListData?.[0]?.data?.[0]?.breadcrumb?.[0]?.bulk_order,
      token: state?.token,
      guestCartToken: state?.guestCartToken,
      isloggeduser: state?.isloggeduser,
      loggedInUserData: state?.loggedInUserData,
      showAuthencationPopup: state?.showAuthencationPopup,
      searchfilterparams: state?.searchfilterparams,
      isSearchResult: state?.isSearchResult,
      actionmessage: state?.actionmessage
    }
  })
  // console.log("productlistData",productlistData);
  const [isHavingGroupedPoducts, setIsHavingGroupedPoducts] = useState(false);
  const [selectedKey, setSelectedKey] = useState("")
  const [plpLoader, setPlpLoader] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const [showQuoteRotate, setQuoteShowRotate] = useState(false);
  const [rotateSameId, setRotateSameId] = useState(null);
  const [quoterotateSameId, setquoteRotateSameId] = useState(null);
  const [sidebarData, setSidebarData] = useState({
    category_label: "",
    min_price: "",
    max_price: "",
    weight: ""
  })
  const [selectedTag, setSelectedTag] = useState("")
  const [isPriceFiltered, setIsPriceFiltered] = useState(false);
  const [closeSlider, setCloseSlider] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(15);
  const [callPaginationHandler, setCallPaginationHandler] = useState(false);
  const pageCount = Math.ceil(productlistData?.product_count / show);
  const isCategory = window?.location?.pathname?.slice(-13);
  const isSearch = window?.location?.pathname?.slice(0, 7);
  const isPlp = (isCategory === "category.html" || isSearch === "/search");
  const [metaData, setMetaData] = useState({
    categoryName: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: ""
  });
  const handlePageClick = (event) => {
    setTimeout(() => {
      setCallPaginationHandler(true)
    }, 300);
    if (callPaginationHandler) {
      dispatch(ACTION_SCROLLTOTOP())
      if (location?.state?.from?.isSearchResult || isSearchResult) {
        dispatch(ACTION_ISSEARCHRESULT(true))
        if (productlistData?.searched_keyword) {
          navigate(
            {
              pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
              search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}&page=${event?.selected + 1}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
            }
          )
        }
      } else {
        navigate({
          search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}&page=${event?.selected + 1}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
        });
      }
    }
  };
  const addCartItems = (sku, qty) => {
    if (isloggeduser) {
      addCutomerCartItems(token, dispatch, sku, qty, setShowRotate, 'plp', actionmessage?.isSesstionTimeOut)
    } else {
      addGuestCart(dispatch, guestCartToken, sku, qty, setShowRotate, 'plp')
    }
  }

  // quote
  const addQuoteItems = (sku, qty,productId,productName,price) => {
    if (isloggeduser) {
     var customer_id=1;
    //  future use for customer
     addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, 'plp')
      // addCutomerCartItems(token, dispatch, sku, qty,customer_id, setQuoteShowRotate, 'plp', actionmessage?.isSesstionTimeOut)
    } else {
      customer_id=0;
      addGuestQuote(dispatch, guestCartToken, sku, qty,customer_id,productId,productName,price, setQuoteShowRotate, 'plp')
    }
  }
   // quote
  const addToWishList = (productId) => {
    if (isloggeduser) {
      addWishList(token, dispatch, productId, false, "plp", actionmessage?.isSesstionTimeOut)
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
      notify_Me(token, dispatch, datas, "plp", actionmessage?.isSesstionTimeOut)
    } else {
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: !showAuthencationPopup?.loginReg,
        forgotPas: false,
        resetPass: false
      }))
    }
  };
  const quickViewAction = (data) => {
    dispatch(ACTION_QUICKVIEW())
    dispatch(ACTION_QUICKVIEWDATA(data))
  }

  const goToParentCategory = () => {
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      dispatch(ACTION_ISSEARCHRESULT(true))
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
        search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
      })
    } else {
      navigate({
        pathname: `/${productlistData?.available_filter?.[0]?.filterable_category_url}`,
        search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
      });
    }
  }
  const clearPrice = () => {
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      dispatch(ACTION_ISSEARCHRESULT(true))
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
        search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
      })
    } else {
      navigate({
        search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
      });
    }
  }
  const clearSize = () => {
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      dispatch(ACTION_ISSEARCHRESULT(true))
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
        search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      })
    } else {
      navigate({
        search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      });
    }
  }
  const removeTagFilter = () => {
    setSelectedTag("");
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      dispatch(ACTION_ISSEARCHRESULT(true))
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
        search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      })
    } else {
      navigate({
        search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      });
    }
  }
  const clearAll = () => {
    setSelectedTag("")
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`
      })
    } else {
      navigate(`/${productlistData?.available_filter?.[0]?.filterable_category_url ?
        productlistData?.available_filter?.[0]?.filterable_category_url : productlistData?.urlKey}`)
    }
  }
  const listviewProducts = (num) => {
    setOpenCategories(num)
    if (location?.state?.from?.isSearchResult || isSearchResult) {
      dispatch(ACTION_ISSEARCHRESULT(true))
      navigate({
        pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
        search: `&product_list_mode=list${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      })
    } else {
      navigate({
        search: `?product_list_mode=list${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
      });
    }
  }
  const gridViewProducts = (num) => {
    setOpenCategories(num)
    if (searchParams?.get('product_list_mode') == 'list') {
      if (location?.state?.from?.isSearchResult || isSearchResult) {
        dispatch(ACTION_ISSEARCHRESULT(true))
        navigate({
          pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
          search: `${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
        })
      } else {
        navigate({
          search: `${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}`,
        });
      }
    }
  }
  useEffect(() => {
    if (location?.pathname?.includes("/search/")) {
      dispatch(ACTION_ISSEARCHRESULT(true))
    } else {
      dispatch(ACTION_ISSEARCHRESULT(false))
    }
  }, [location])
  useEffect(() => {
    if (productlistData?.available_filter?.[0]?.page) {
      setCurrentPage(parseInt(productlistData?.available_filter?.[0]?.page))
    }
    if (productlistData?.available_filter?.[0]?.show_page) {
      setShow(productlistData?.available_filter?.[0]?.show_page)
    }
  }, [productlistData])

  useEffect(() => {
    if (isPlp) {
      if (location?.state?.from?.isSearchResult || location?.pathname?.includes("/search/")) {
        productSearchResultAPI(dispatch, {
          keyword: location?.pathname?.slice(16)?.split('/')?.[0] ? location?.pathname?.slice(16)?.split('/')?.[0]?.replace(/%20/g, " ") : searchfilterparams?.keyword,
          min_price: searchParams?.get('min_price') ? searchParams?.get('min_price') : "",
          max_price: searchParams?.get('max_price') ? searchParams?.get('max_price') : "",
          sort_order: searchParams?.get('sort_order') ? searchParams?.get('sort_order') : "",
          page: searchParams?.get('page') ? searchParams?.get('page') : 1,
          size: searchParams?.get('size') ? searchParams?.get('size') : 0,
          show_page: searchParams?.get('show_page') ? parseInt(searchParams?.get('show_page')) : 15,
          filterable_category_id: searchParams?.get('filterable_category_id') ? searchParams?.get('filterable_category_id') : "",
          tag_filter: searchParams?.get('tag_filter') ? parseInt(searchParams?.get('tag_filter')) : "",
        }, navigate, setPlpLoader)
      } else {
        productListAPI(dispatch, {
          url_key: location?.pathname?.slice(1),
          min_price: searchParams?.get('min_price') ? searchParams?.get('min_price') : "",
          max_price: searchParams?.get('max_price') ? searchParams?.get('max_price') : "",
          sort_order: searchParams?.get('sort_order') ? searchParams?.get('sort_order') : "",
          page: searchParams?.get('page') ? searchParams?.get('page') : 1,
          size: searchParams?.get('size') ? searchParams?.get('size') : 0,
          show_page: searchParams?.get('show_page') ? parseInt(searchParams?.get('show_page')) : 15,
          filterable_category_id: searchParams?.get('filterable_category_id') ? searchParams?.get('filterable_category_id') : "",
          tag_filter: searchParams?.get('tag_filter') ? parseInt(searchParams?.get('tag_filter')) : "",
        }, navigate, setPlpLoader)
      }
    }
  }, [location])

  useEffect(() => {
    if (openCategories == "2l" || searchParams?.get('product_list_mode') == 'list') {
      setOpenCategories("2l")
    } else {
      if (width > 1551) {
        setOpenCategories("6")
      } else if (width > 1361 && width < 1550) {
        setOpenCategories("5")
      } else if (width > 768 && width < 1360) {
        setOpenCategories("4")
      } else if (width > 621 && width < 767) {
        setOpenCategories("3")
      } else if (width > 360 && width < 620) {
        setOpenCategories("2g")
      } else if (width < 359) {
        setOpenCategories("1g")
      }
    }
  }, [width, location])
  useEffect(() => {
    setSelectedKey("")
  }, [location?.pathname])
  useEffect(() => {
    productlistData?.products?.map((item) => {
      if (!isHavingGroupedPoducts) {
        if (item?.starting_from_price || item?.starting_to_price) {
          setIsHavingGroupedPoducts(true)
        }
      } else {
        return
      }
    })
  }, [productlistData?.products])
  useEffect(() => {
    if (productlistData?.searched_keyword) {
      dispatch(ACTION_SEARCHEDTEXT(productlistData?.searched_keyword))
    }
    else {
      dispatch(ACTION_SEARCHEDTEXT(''))
    }
  }, [productlistData?.searched_keyword])
  const categoryName = productlistData?.category_name?.length > 0 ? productlistData?.category_name : 'Products';
  const SearchResult = productlistData?.searched_keyword?.replace(/%20/g, " ");
  useEffect(() => {
    setMetaData({
      categoryName: productlistData?.category_name,
      meta_title: productlistData?.meta_title,
      meta_description: productlistData?.meta_description,
      meta_keyword: productlistData?.meta_keywords
    })
  }, [productlistData])
  return (
    <>
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Sri Swaminathan & Co Kumbakonam |  ${metaData?.meta_title ? metaData?.meta_title : metaData?.categoryName}`}</title>
          <meta
            name="title"
            content={metaData?.meta_title ? metaData?.meta_title : `${metaData?.categoryName} - Sri Swaminathan`}
            data-react-helmet="true"
          />
          <meta
            name="description"
            content={metaData?.meta_description ? metaData?.meta_description : `${metaData?.categoryName} Category`}
            data-react-helmet="true"
          />
          <meta
            name="keywords"
            content={metaData?.meta_keyword}
            data-react-helmet="true"
          />
        </Helmet>
      </>
      {
        productlistData?.urlKey !== "no-route" ?
          <Stack className='plp-full-section'>
            <Stack className='default_conitaner'>
              <Stack className='section'>
                <Stack className='breadcrumbs-section'>
                  <Breadcrumbs data={productlistData?.breadcrumb} />
                </Stack>
                <Stack className='plp-product-sections'>
                  <Stack className='count-title-section'>
                    {
                      !location?.state?.from?.isSearchResult ?
                        <Stack className='product-count'>
                          <Typography className='count' variant='span'>{productlistData?.product_count}<Typography className='count-text' variant='span'>{productlistData?.product_count > 1 ? 'Products' : 'Product'}</Typography></Typography>
                        </Stack>
                        : ''
                    }
                    <Stack className='product-header-title'>
                      {
                        location?.state?.from?.isSearchResult || isSearchResult ?
                          <Stack className='searchresult_block'>
                            <Typography className='category-title' variant='h4'>
                              {productlistData?.product_count} Search Results for:
                              <Typography className='search-title' variant='span'>"{SearchResult}"</Typography>
                            </Typography>
                          </Stack>
                          :
                          <Typography className='category-title' variant='h4'>{productlistData?.category_name} </Typography>
                      }
                    </Stack>
                  </Stack>

                  <Stack className='filter-section-list'>
                    {/* Sidebar */}
                    <Sidenavigator
                      productlistData={productlistData}
                      sidebarData={sidebarData}
                      setSidebarData={setSidebarData}
                      setCloseSlider={setCloseSlider}
                      closeSlider={closeSlider}
                      setIsPriceFiltered={setIsPriceFiltered}
                      isPriceFiltered={isPriceFiltered}
                      setSelectedKey={setSelectedKey}
                      selectedKey={selectedKey}
                      selectedTag={selectedTag}
                      setSelectedTag={setSelectedTag}
                    />

                    <Stack className='product-visibility-grid-section plp-filter-grid'>
                      <Stack className='product-visibility-grid'>
                        <Stack className='plp-grid align-items-center'>
                          <Typography
                            className={`listview-section icon-img ${openCategories === "2l" && "twolist"}`}
                            variant='span'
                            onClick={() => listviewProducts('21')}>
                            < img src={TwoList} className='plp-grid-img' alt='...' title='List View' />
                            < img src={TwoListActive} className='plp-grid-img active' alt='...' title='List View' />
                          </Typography>
                          <Typography
                            className={`large-desktop icon-img ${openCategories === "6" && "sixgrid"}`}
                            variant='span'
                            onClick={() => gridViewProducts('6')} >
                            < img src={SixGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                            < img src={SixGrid} className='plp-grid-img' alt='...' title='Grid View' />
                          </Typography>

                          <Typography
                            className={`normal-desktop five-section icon-img ${openCategories === "5" && "fivegrid"}`}
                            variant='span'
                            onClick={() => gridViewProducts('5')} >
                            < img src={FiveGrid} className='plp-grid-img' alt='...' title='Grid View' />
                            < img src={FiveGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                          </Typography>
                          <Typography
                            className={`normal-desktop four-section icon-img ${openCategories === "4" && "fourgrid"}`}
                            variant='span'
                            onClick={() => gridViewProducts('4')} >
                            < img src={FourGrid} className='plp-grid-img' alt='...' title='Grid View' />
                            < img src={FourGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                          </Typography>
                          <Typography
                            className={`normal-desktop three-section icon-img ${openCategories === "3" && "threegrid"}`}
                            variant='span'
                            onClick={() => gridViewProducts('3')} >
                            < img src={ThreeGrid} className='plp-grid-img' alt='...' title='Grid View' />
                            < img src={ThreeGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                          </Typography>
                          <Typography
                            className={`mobile-view icon-img ${openCategories === "2g" && "twogrid"}`}
                            variant='span'
                            onClick={() => gridViewProducts('2g')} >
                            < img src={TwoGrid} className='plp-grid-img' alt='...' title='Grid View' />
                            < img src={TwoGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                          </Typography>
                          <Typography
                            className={`single-view mobile-view icon-img ${openCategories === "1g" && "onegrid"}`}
                            variant='span'
                            onClick={() => setOpenCategories("1g")}>
                            < img src={OneGrid} className='plp-grid-img' alt='...' title='Grid View' />
                            < img src={OneGridActive} className='plp-grid-img active' alt='...' title='Grid View' />
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Stack className='product-sort-section plp-filter-grid'>
                      <Box className="sortby-show">
                        <Box className="sortby">
                          <Select
                            clsName="sortby-plp select-options-box"
                            data={productlistData?.sort_by}
                            appyShow="plp_sort"
                            appliedShort={productlistData?.available_filter?.[0]?.sort_order}
                          />
                        </Box>
                      </Box>
                    </Stack>
                  </Stack>
                  {
                    productlistData?.available_filter?.[0]?.filterable_category_name ||
                      productlistData?.available_filter?.[0]?.size_filter ||
                      productlistData?.available_filter?.[0]?.display_min_price ||
                      productlistData?.available_filter?.[0]?.tag_filter ||
                      productlistData?.available_filter?.[0]?.display_max_price ?
                      <Stack className='filter-result-section'>
                        {
                          productlistData?.available_filter?.[0]?.filterable_category_name ?
                            <Stack className='product-category-filter filter-result-list'>
                              <Typography className='title' variant='span'>
                                {productlistData?.available_filter?.[0]?.filterable_category_name}
                                <img src={Closeicon} alt='...'
                                  onClick={() => goToParentCategory()}
                                />
                              </Typography>
                            </Stack>
                            : ''
                        }
                        {
                          productlistData?.available_filter?.[0]?.tag_filter ?
                            <Stack className='product-category-filter filter-result-list'>
                              <Typography className='title' variant='span'>
                                {productlistData?.available_filter?.[0]?.tag_filter}
                                <img src={Closeicon} alt='...'
                                  onClick={() => removeTagFilter()}
                                />
                              </Typography>
                            </Stack>
                            : ''
                        }
                        {
                          productlistData?.available_filter?.[0]?.min_price ||
                            productlistData?.available_filter?.[0]?.max_price ?
                            <Stack className='product-price-filter filter-result-list'>
                              <Typography className='title' variant='span'>
                                {formatCurrency?.format(productlistData?.available_filter?.[0]?.min_price)}
                                &nbsp;-&nbsp;
                                {formatCurrency?.format(productlistData?.available_filter?.[0]?.max_price)}
                                <img src={Closeicon} alt='...'
                                  onClick={() => clearPrice()} />
                              </Typography>
                            </Stack>
                            : ''
                        }
                        {
                          productlistData?.available_filter?.[0]?.size_filter ?
                            <Stack className='product-price-filter filter-result-list'>
                              <Typography className='title' variant='span'>
                                {
                                  productlistData?.available_filter?.[0]?.size_filter?.split('-')?.map((weight, ind) => {
                                    if (productlistData?.available_filter?.[0]?.size_filter?.split('-')?.length > 1) {
                                      if (productlistData?.available_filter?.[0]?.size_filter?.split('-')?.length == ind + 1) {
                                        return weight + " " + "kg" + ""
                                      } else {
                                        return weight + " " + "kg" + " " + "-"
                                      }
                                    } else {
                                      return weight + " " + "kg"
                                    }
                                  })
                                }
                                <img src={Closeicon} alt='...'
                                  onClick={() => clearSize()} />
                              </Typography>
                            </Stack>
                            : ''
                        }
                        {
                          productlistData?.available_filter?.[0]?.filterable_category_name ||
                            productlistData?.available_filter?.[0]?.size_filter ||
                            productlistData?.available_filter?.[0]?.display_min_price ||
                            productlistData?.available_filter?.[0]?.display_max_price ||
                            productlistData?.available_filter?.[0]?.tag_filter
                            ?
                            <Stack className='product-clear-btn filter-result-list'>
                              <Button
                                className=' common-btn-section product-addcart-btn'
                                fullWidth
                                onClick={() => clearAll()}
                              >Clear All Filter</Button>
                            </Stack>
                            : ''
                        }

                      </Stack>
                      : ''
                  }
                </Stack>
                <Stack className="plp-product-block-section">
                  <Stack className="plp-grid-section">

                    <Stack className={`product-grid-section
                  ${openCategories === "2l" && "twolist"}
                  ${openCategories === "1g" && "onegrid"}
                  ${openCategories === "2g" && "twogrid"}
                  ${openCategories === "3" && "threegrid"} 
                  ${openCategories === "4" && "fourgrid"}
                   ${openCategories === "5" && "fivegrid"}
                  ${openCategories === "6" && "sixgrid"}
                  ${!productlistData?.products?.length && 'empty-product'}
                `}
                    >
                      {
                        productlistData?.products?.length ?

                          <>
                            {
                              productlistData?.products?.map((item, index) => {
                                return (
                                  <>
                                    <Stack className='product-grid-list' key={index}>
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
                                            to={`/${item?.url_key}`}
                                            state={{ from: productlistData?.entityId }}
                                        
                                          >
                                            <img src={item?.media_gallery?.image?.[0]} className="whychoose-image" alt="..." />

                                          </Link>
                                          {
                                            item?.tag?.new_arrival || item?.tag?.on_offer ?
                                              <Box className='tag-section'>
                                                {
                                                  item?.tag?.on_offer ?
                                                    <Typography className='tag-content'>
                                                      <Typography variant='span' className='text-tag' >{item?.tag?.on_offer}</Typography>
                                                    </Typography>
                                                    : ''
                                                }
                                                {
                                                  item?.tag?.new_arrival ?
                                                    <Typography className='tag-content'>
                                                      <Typography variant='span' className='text-tag new-arrival' >{item?.tag?.new_arrival}</Typography>
                                                    </Typography>
                                                    : ''
                                                }
                                              </Box>
                                              : ''
                                          }

                                          <Box className='hover-tag-section'>
                                            <Typography className='tag-img'
                                              onClick={() => addToWishList(item?.id)}
                                            >
                                              <img src={ProductWishlist} className='product-wishlist' alt='...' />
                                              <img src={ProductWishlistHover} className='product-wishlist-hover' alt='...' />
                                            </Typography>
                                            <Typography className='tag-img'
                                              onClick={() => quickViewAction(item)}
                                            >
                                              <img src={ProductQuickview} className='product-quickview' alt='...' />
                                              <img src={ProductQuickviewHover} className='product-quickview-hover' alt='...' />
                                            </Typography>
                                          </Box>
                                        </Stack>
                                        <div className='product-info-section'>
                                          <Link className='productname-text'
                                            to={`/${item?.url_key}`}
                                            state={{ from: productlistData?.entityId }}
                                          >
                                            <Typography className='productname-text' variant="h4">{item?.name}</Typography>
                                          </Link>
                                          {/* price block */}
                                          <Typography varient="span">
                                            <Typography varient="span" className='price'>
                                              {
                                                item?.grouped_product?.length ?
                                                  <div className='price-section multiple'>
                                                    <span className='specialprice-tag'>From</span>
                                                    {
                                                      item?.starting_from_price || item?.starting_to_price ?
                                                        <span className='price_grouped'>
                                                          {
                                                            item?.starting_from_price ?
                                                              <span className='product-price-text special-price'>{formatCurrency?.format(item?.starting_from_price)}</span>
                                                              : ''
                                                          }
                                                          {
                                                            item?.starting_to_price ?
                                                              <>
                                                                <span className='product-price-text special-price'> - </span>
                                                                <span className='product-price-text special-price'>{formatCurrency?.format(item?.starting_to_price)}</span>
                                                              </>
                                                              : ''

                                                          }
                                                        </span>
                                                        : ''
                                                    }
                                                  </div>
                                                  :
                                                  item?.special_price ?
                                                    <div className={`price-section ${isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ? "hidden" : ""} ${item?.special_price ? "special" : ""}`}>
                                                      {
                                                        isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ?
                                                          <Typography className='product-price-text price hidden'>From</Typography> : ""
                                                      }
                                                      <Stack className='special_price'>
                                                        {
                                                          item?.special_price ?
                                                            <span className='product-price-text price'>{formatCurrency?.format(item?.special_price)}</span>
                                                            : ''
                                                        }
                                                        {
                                                          item?.price ?
                                                            <span className='product-price-text old-price'>{formatCurrency?.format(item?.price)}</span>
                                                            : ''
                                                        }
                                                      </Stack>
                                                    </div>
                                                    :
                                                    <div className={`price-section ${isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ? "hidden" : ""} ${item?.special_price ? "special" : ""}`}>
                                                      {
                                                        isHavingGroupedPoducts && !item?.starting_from_price || !item?.starting_to_price ?
                                                          <Typography className='product-price-text price hidden'>From</Typography> : ""
                                                      }
                                                      {
                                                        item?.price ?
                                                          <span className='product-price-text price'>{formatCurrency?.format(item?.price)}</span>
                                                          : ''
                                                      }
                                                    </div>
                                              }
                                            </Typography>
                                          </Typography>
                                          {/* Buttons */}
                                          {
                                            item?.grouped_product?.length && item?.stock_status == "In stock" ?
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
                                              <>
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
                                        {/* quote */}
                                        {
                                         bulkOrder==1 ?
                                          (
                                            <>
                                            <BootstrapTooltip title="The quote option requires a minimum order of 10 units">
                                            <Button
                                            className={` common-btn-section outlined_default_btn product-addcart-btn synchronise-icon 
                                           ${showQuoteRotate == true && quoterotateSameId == index ? 'rotateUpdate' : ''}`}
                                            fullWidth
                                            disabled={showQuoteRotate === false ? false : true}
                                            onClick={() => {
                                              var bulkorderqty=10;
                                              // future use 
                                              addQuoteItems(item?.sku, bulkorderqty,item?.id,item?.name,item?.price)
                                              // addCartItems(item?.sku, item?.min_qty)
                                              // setRotateSameId(index)
                                           setquoteRotateSameId(index)
                                            }}
                                           >
                                            {showQuoteRotate === true && quoterotateSameId == index ? <LoopIcon /> : "Add To Quote"}
                                           </Button>
                                           </BootstrapTooltip>
                                              <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>
                                              </>
                                          ):""

                                        }
                                           
                                                {/* quote */}
                                              </>
                                               
                                                :
                                                <>
                                                           
                                                  <Button
                                                  className={` common-btn-section outlined_default_btn product-addcart-btn synchronise-icon 
                                        ${showRotate == true && rotateSameId == index ? 'rotateUpdate' : ''}`}
                                                  fullWidth
                                                  disabled={showRotate === false ? false : true}
                                                  onClick={() => actionNotify(item?.id)}
                                                >
                                                  {showRotate === true && rotateSameId == index ? <LoopIcon /> : "Notify Me"}
                                                </Button>
                                             
                                                {/* quote */}
                                                {
                                          bulkOrder==1 ?
                                          (
                                            <>
                                            <BootstrapTooltip title="The quote option requires a minimum order of 10 units">
                                            <Button
                                            className={` common-btn-section outlined_default_btn product-addcart-btn synchronise-icon 
                                           ${showQuoteRotate == true && quoterotateSameId == index ? 'rotateUpdate' : ''}`}
                                            fullWidth
                                            disabled={showQuoteRotate === false ? false : true}
                                            onClick={() => {
                                              var bulkorderqty=10;
                                              addQuoteItems(item?.sku, bulkorderqty,item?.id,item?.name,item?.price)
                                              // addCartItems(item?.sku, item?.min_qty)
                                              // setRotateSameId(index)
                                              setquoteRotateSameId(index)
                                            }}
                                           >
                                            {showQuoteRotate === true && quoterotateSameId == index ? <LoopIcon /> : "Add To Quote"}
                                           </Button>
                                           </BootstrapTooltip>
                                           <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>
                                           </>
                                          ):""

                                        }
                                                {/* quote */}
                                                </>
                                              
                                          }
                                        </div>
                                      </Stack>
                                    </Stack>
                                  </>
                                )
                              })
                            }
                            {/* list view section design */}
                            {
                              productlistData?.products?.map((item, index) => {
                                return (
                                  <>
                                    {openCategories === "2l" && "twolist" ?
                                      <Stack className='product-list-view-section'>
                                        <Stack className='product-list-view'>
                                          <Stack className='product-image-grid info-section'>
                                            <Stack className='plp-image-section'>
                                              <Link className='image-link-section'
                                                to={`/${item?.url_key}`}
                                                state={{ from: productlistData?.entityId }}
                                              >
                                                <img src={item?.media_gallery?.image?.[0]} className="whychoose-image" alt="..." />
                                              </Link>
                                            </Stack>
                                            <Stack className='product-info-section'>
                                              <Link className='productname-text'
                                                to={`/${item?.url_key}`}
                                                state={{ from: productlistData?.entityId }}
                                              >
                                                <Typography className='productname-text' variant="h4">{item?.name}</Typography>
                                              </Link>
                                              {
                                                item?.tag?.new_arrival || item?.tag?.on_offer ?
                                                  <Stack className='offertags'>
                                                    {
                                                      item?.tag?.on_offer ?
                                                        <Typography className='offer-label'>{item?.tag?.on_offer}</Typography>
                                                        : ''
                                                    }
                                                    {
                                                      item?.tag?.new_arrival ?
                                                        <Typography className='offer-label newarrival'>{item?.tag?.new_arrival}</Typography>
                                                        : ''
                                                    }
                                                  </Stack>
                                                  : ''
                                              }
                                              {
                                                item?.color ?
                                                  <Stack className='variations product-color'>
                                                    <Typography variant='h4' className='label'>Color:</Typography>
                                                    <Stack className='product-color-section'>
                                                      <Stack className='item-block'>
                                                        <Typography className="value">{item?.color}</Typography>
                                                      </Stack>
                                                    </Stack>
                                                  </Stack>
                                                  : ''
                                              }
                                              {
                                                item?.size_in_kg ?
                                                  <Stack className='variations product-weightr'>
                                                    <Typography variant='h4' className='label'>Weight (Kg):</Typography>
                                                    <Stack className='product-color-section'>
                                                      <Stack className='item-block'>
                                                        <Typography className="value">{item?.size_in_kg}</Typography>
                                                      </Stack>
                                                    </Stack>
                                                  </Stack>
                                                  : ''
                                              }
                                              {
                                                item?.short_description ?
                                                  <Stack className='product-info-description'>
                                                    <Typography className="value" dangerouslySetInnerHTML={{ __html: item?.short_description }}></Typography>
                                                  </Stack>
                                                  : ''
                                              }
                                              <Stack className='mobile-section-design'>
                                                <Stack className='price_offer_block'>

                                                  <Stack className='price'>
                                                    {
                                                      item?.grouped_product?.length ?
                                                        <div className='price-section group-product-price'>
                                                          <span className='specialprice-tag'>From</span>
                                                          {
                                                            item?.starting_from_price || item?.starting_to_price ?
                                                              <Stack className='sale-price price-block'>
                                                                {
                                                                  item?.starting_from_price ?
                                                                    <Typography variant='span' className='amount'>{formatCurrency?.format(item?.starting_from_price)}</Typography>
                                                                    : ''
                                                                }
                                                                {
                                                                  item?.starting_to_price ?
                                                                    <Typography variant='span' className='amount'>{formatCurrency?.format(item?.starting_to_price)}</Typography>
                                                                    : ''
                                                                }
                                                              </Stack>
                                                              : ''
                                                          }
                                                        </div>
                                                        :
                                                        item?.special_price ?
                                                          <div className='price-section'>
                                                            {
                                                              item?.special_price ?
                                                                <Stack className='sale-price price-block'>
                                                                  <Typography variant='span' className='amount'>{formatCurrency?.format(item?.special_price)}</Typography>
                                                                </Stack>
                                                                : ''
                                                            }
                                                            {
                                                              item?.price ?
                                                                <Stack className='offer-price price-block'>
                                                                  <Typography variant='span' className='amount'>{formatCurrency?.format(item?.price)}</Typography>
                                                                </Stack>
                                                                : ''
                                                            }
                                                          </div>
                                                          :
                                                          <div className='price-section'>
                                                            {
                                                              item?.price ?
                                                                <Stack className='offer-price price-block'>
                                                                  <Typography variant='span' className='amount'>{formatCurrency?.format(item?.price)}</Typography>
                                                                </Stack>
                                                                : ''
                                                            }
                                                          </div>
                                                    }
                                                  </Stack>
                                                </Stack>
                                                {
                                                  item?.stock_status ?
                                                    <Stack className='variations availability'>
                                                      <Typography variant='label' className='label'>Availability:</Typography>
                                                      {
                                                        item?.stock_status == "Out of stock" ?
                                                          <Box className='Product-stock'>
                                                            <Typography variant='span' className='out-of-stock'>Out Of Stock</Typography>
                                                          </Box>
                                                          :
                                                          <Box className='Product-stock'>
                                                            <Typography variant='span' className='instock'>In stock</Typography>
                                                          </Box>
                                                      }
                                                    </Stack>
                                                    : ""
                                                }
                                              </Stack>

                                            </Stack>
                                          </Stack>
                                          <Stack className='product-info-section-additional'>
                                            <Stack className='empty-section'>

                                            </Stack>
                                            <Stack className='price_offer_block'>
                                              <Stack className='price'>
                                                {
                                                  item?.grouped_product?.length ?
                                                    <div className='price-section group-product-price'>
                                                      <span className='specialprice-tag'>From</span>
                                                      {
                                                        item?.starting_from_price || item?.starting_to_price ?
                                                          <Stack className='sale-price price-block'>
                                                            {
                                                              item?.starting_from_price ?
                                                                <Typography variant='span' className='amount'>{formatCurrency?.format(item?.starting_from_price)}</Typography>
                                                                : ''
                                                            }
                                                            -
                                                            {
                                                              item?.starting_to_price ?
                                                                <Typography variant='span' className='amount'>{formatCurrency?.format(item?.starting_to_price)}</Typography>
                                                                : ''
                                                            }
                                                          </Stack>
                                                          : ''
                                                      }
                                                    </div>
                                                    :
                                                    item?.special_price ?
                                                      <div className='price-section'>
                                                        {
                                                          item?.special_price ?
                                                            <Stack className='sale-price price-block'>
                                                              <Typography variant='span' className='amount'>{formatCurrency?.format(item?.special_price)}</Typography>
                                                            </Stack>
                                                            : ''
                                                        }
                                                        {
                                                          item?.price ?
                                                            <Stack className='offer-price price-block'>
                                                              <Typography variant='span' className='amount'>{formatCurrency?.format(item?.price)}</Typography>
                                                            </Stack>
                                                            : ''
                                                        }
                                                      </div>
                                                      :
                                                      <div className='price-section'>
                                                        {
                                                          item?.price ?
                                                            <Stack className='sale-price price-block'>
                                                              <Typography variant='span' className='amount'>{formatCurrency?.format(item?.price)}</Typography>
                                                            </Stack>
                                                            : ''
                                                        }
                                                      </div>
                                                }
                                              </Stack>
                                            </Stack>
                                            {
                                              item?.stock_status ?
                                                <Stack className='variations availability'>
                                                  <Typography variant='label' className='label'>Availability:</Typography>
                                                  {
                                                    item?.stock_status == "Out of stock" ?
                                                      <Box className='Product-stock'>
                                                        <Typography variant='span' className='out-of-stock'>Out Of Stock</Typography>
                                                      </Box>
                                                      :
                                                      <Box className='Product-stock'>
                                                        <Typography variant='span' className='instock'>In stock</Typography>
                                                      </Box>
                                                  }
                                                </Stack>
                                                : ""
                                            }
                                            <Stack className='button-section'>
                                              <Stack className='wishlist-quickview'>
                                                <Stack className='wishlist'>
                                                  <Stack className='item_block'>
                                                    <Typography className='item-section'
                                                      onClick={() => addToWishList(item?.id)}
                                                    >
                                                      <img src={Wishlist} title='Add To Wishlist' alt='Add To Wishlist' />
                                                      <Typography className='content'>Add To Wishlist</Typography>
                                                    </Typography>
                                                  </Stack>
                                                </Stack>
                                                <Stack className='wishlist quickview'>
                                                  <Stack className='item_block'>
                                                    <Typography className='item-section'
                                                      onClick={() => quickViewAction(item)}
                                                    >
                                                      <img src={Quickview} title='Quickview' alt='Quickview' />
                                                      <Typography className='content'>Quick View</Typography>
                                                    </Typography>
                                                  </Stack>
                                                </Stack>
                                              </Stack>
                                              <Stack className='button-addtocart-section'>
                                                {/* Buttons */}
                                                {
                                                  item?.grouped_product?.length && item?.stock_status == "In stock" ?
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
                                                    <>
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
                                                      {/* quote */}
                                                      {
                                                      bulkOrder==1 ?( 
                                                      <>
                                                      <BootstrapTooltip title="The quote option requires a minimum order of 10 units">
                                                          <Button
                                                            className={` common-btn-section outlined_default_btn product-addquote-btn synchronise-icon 
                                            ${showQuoteRotate == true && quoterotateSameId == index ? 'rotateUpdate' : ''}`}
                                                            fullWidth
                                                            disabled={showQuoteRotate === false ? false : true}
                                                            onClick={() => {
                                                              var bulkorderqty=10
                                                              addQuoteItems(item?.sku, bulkorderqty,item?.id,item?.name,item?.price)
                                                              // addCartItems(item?.sku, item?.min_qty)
                                                              // setRotateSameId(index)
                                                              setquoteRotateSameId(index)
                                                            }}
                                                          >
                                                            {showQuoteRotate === true && quoterotateSameId == index ? <LoopIcon /> : "Add To Quote"}
                                                          </Button>
                                                          </BootstrapTooltip>
                                                          <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>
                                                          </>
                                                          ):""
                                                      }
                                                     
                                                         {/* quote */}
                                                    </>
                                                    
                                                      :
                                                      <>
                                                         <Button
                                                        className={` common-btn-section outlined_default_btn product-addcart-btn synchronise-icon 
                                        ${showRotate == true && rotateSameId == index ? 'rotateUpdate' : ''}`}
                                                        fullWidth
                                                        disabled={showRotate === false ? false : true}
                                                        onClick={() => actionNotify(item?.id)}
                                                      >
                                                        {showRotate === true && rotateSameId == index ? <LoopIcon /> : "Notify Me"}
                                                      </Button>
                                                      {
                                                       bulkOrder==1 ?( 
                                                       <>
                                                       <BootstrapTooltip title="The quote option requires a minimum order of 10 units">
                                                        <Button
                                                          className={` common-btn-section outlined_default_btn product-addquote-btn synchronise-icon 
                                          ${showQuoteRotate == true && quoterotateSameId == index ? 'rotateUpdate' : ''}`}
                                                          fullWidth
                                                          disabled={showQuoteRotate === false ? false : true}
                                                          onClick={() => {
                                                            var bulkorderqty=10
                                                            addQuoteItems(item?.sku, bulkorderqty,item?.id,item?.name,item?.price)
                                                            // addCartItems(item?.sku, item?.min_qty)
                                                            // setRotateSameId(index)
                                                            setquoteRotateSameId(index)
                                                          }}
                                                        >
                                                          {showQuoteRotate === true && quoterotateSameId == index ? <LoopIcon /> : "Add To Quote"}
                                                        </Button>
                                                        </BootstrapTooltip>
                                                        <Typography className='bulkorder-madeesy' variant='span'>Bulk Orders Made Easy-Just Hit 'Add to Quote' for Your Custom Quote!</Typography>
                                                        </>
                                                        ):""
  
}
                                                      </>
                                                   

                                                      
                                                }
                                              </Stack>
                                            </Stack>
                                          </Stack>

                                        </Stack>
                                      </Stack>
                                      : ""
                                    }
                                  </>
                                )
                              })
                            }
                          </>

                          :
                          ''
                      }

                      {
                        productlistData?.products?.length == 0 ?
                          <Stack className='product-empty-section'>
                            <Typography className='empty-msg'>
                              Sorry there is no product for your selection. Kindly opt for another category.
                            </Typography>
                          </Stack>
                          : ''
                      }

                    </Stack>
                  </Stack>

                </Stack>
                <Stack className='pagination-section-showcount'>
                  <Stack className='pagination-section'>
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

                  </Stack>
                  <Stack className='showcount-section'>
                    <Box className="show">
                      <Box className='title-show'>Show</Box>
                      <Select
                        data={countvalue}
                        appyShow="plp_show"
                        clsName="sortby-plp select-options-box"
                        setShow={setShow}
                        appliedShow={productlistData?.available_filter?.[0]?.show_page}
                      />
                      <Box className='title-show'>/Page</Box>
                    </Box>

                  </Stack>
                </Stack>
                {/* plp banner section */}
                <Stack className='plp-banner-section'>
                  <Box className='plp-bottom-banner'>
                  <Grid container spacing={6} style={{ padding: "80px" }}>
  {images.map((item, index) => (
    <Grid item xs={12} sm={6} md={3} key={index} className="center-content">
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" height="100%">
        <img className='plp-Banner-img' src={item.url} alt={`img-${index}`} style={{ maxWidth: "100%" }} />
        <span className='plp-Banner-text'>{item.title}</span>
      </Box>  
    </Grid>
  ))} 
</Grid>
  </Box>
                  </Stack>
                          {/* plp banner section */}
              </Stack>
            </Stack>
          </Stack>
          : ''
      }
      {
        productlistData?.urlKey == "no-route" ? <Errorpage /> : ''
      }
      {
        plpLoader && <Pageloader />
      }
    </>
  )
}

export default Index;
