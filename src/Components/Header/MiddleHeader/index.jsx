import React, { useState, useEffect, memo } from 'react';
import "./styles.scss";
import { Stack, Box, Typography, TextField, Badge, Divider,Tooltip } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchLens from '../../../Assets/Clienticons/swaminathan-icons-05.svg';
import MyAccount from '../../../Assets/Clienticons/swaminathan-icons-07.svg';
import MyWishlist from '../../../Assets/Clienticons/swaminathan-icons-03.svg';
import Mycart from '../../../Assets/Clienticons/swaminathan-icons-01.svg';
import MyQuote from '../../../Assets/Clienticons/Myquote.svg';
import { useSelector, useDispatch } from 'react-redux';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import {
    Action_Logout, searchSuggestion, ACTION_SHOWAUTHENTICATIONPOPUP,
    ACTION_RECENTSEARCH
} from "../../../Store/action";
import Searchsuggestion from "../Searchsuggestion";
import RecentSearch from "../RecentSearch";
import { pressEnterCallFunction } from "../../../Utilities/Utilities";
import Minicart from "../../../Components/Minicart";
import MiniQuote from "../../../Components/Miniquote"
import Sidebarmobile from "../Sidebar";
import { ACTION_GET_PRODUCLISTTDATA } from '../../../Store/action';
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
      borderRadius: "50px",
      padding:"10px 15px 10px 15px",
      textAlign:"center",
      fontSize:"13px"
    },
   
  }));
const Index = ({ headerData, headerLoader }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState(null);
    const [isEnterPressed, setIsEnterPressed] = useState(false);
    const [showminicart, setshowminicart] = useState(false)
    // quote
    const [showminiquote, setshowminiquote] = useState(false)
     // quote
    const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false)
    const { isloggeduser, wishlistData,
        miniCartCount, loggedInUserData, showAuthencationPopup,
        recentSearchData, searchedText, productlistData,state,miniQuotecartdetailscount
    } = useSelector(state => {
        return {
            isloggeduser: state?.isloggeduser,
            userdata: state?.userdata,
            filteredData: state?.filteredData,
            miniCartDataItems: state?.miniCartDetails,
            miniCartCount: state?.miniCartDetails?.total_no_of_items,
            plpFilterParams: state?.plpFilterParams,
            wishlistData: state?.wishlistData,
            loggedInUserData: state?.loggedInUserData,
            showAuthencationPopup: state?.showAuthencationPopup,
            recentSearchData: state?.recentSearchData,
            searchedText: state?.searchedText,
            productlistData: state?.productListData,
            miniQuotecartdetailscount:state?.miniQuotecartDetails?.[0]?.count,
            // state?.miniQuotecartDetails?. 
            // length > 0 ? state?.miniQuotecartDetails.reduce((sum, item) => sum + parseInt(item.message.quatation_qty), 0):0,
            state:state
        }
    })
    console.log("state",state);
    console.log("miniQuotecartdetailscount",miniQuotecartdetailscount);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [value, setValue] = useState("");
    const [suggestionsData, setSuggestionsData] = useState({});
    const [isFocusedSearch, setIsFocusedSearch] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const handlerChange = (callSuggestion, event) => {
        setSuggestionsData({})
        setIsChanged(true)
        setIsEnterPressed(callSuggestion)
        setValue(event.target.value)
        setSearchQuery(event.target.value)
    }


    // quote
    const [isBulkOrder, setIsBulkOrder] = useState(true);
  


    const searchResultHandler = () => {
        if (value.trim() !== "") {
            dispatch(ACTION_RECENTSEARCH([...recentSearchData?.slice(-5), value]))
            navigate(`/search/keyword=${value}`, {
                state: {
                    from: {
                        isSearchResult: true,
                        value: value
                    }
                }
            });
            setSuggestionsData({})
        }
    }
    const logoBlock = (
        headerLoader ?
            <Stack className='logo-section middle-sections logo_section_skeleton'>
                <Link to="/">
                    <img src='logo.svg' className='logo-img' alt='Logo' />
                </Link>
            </Stack>
            :
            <Stack className='logo-section middle-sections'>
                <Link to="/">
                    <img src={headerData?.logo} className='logo-img' alt='Logo' />
                </Link>
            </Stack>
    )
    // search after stop typing
    useEffect(() => {
        const delayFn = setTimeout(() => {
            if (isChanged) {
                if (searchQuery?.length > 2 && searchQuery.trim() !== "" && isEnterPressed) {
                    searchSuggestion(dispatch, searchQuery, setSuggestionsData, setShowSuggestion);
                }
            }
        }, 1000);
        return () => clearTimeout(delayFn);
    }, [searchQuery, isEnterPressed]);

    useEffect(() => {
        setIsEnterPressed(false)
    }, [productlistData])
    useEffect(() => {
        setshowminicart(false)
        // quote
        setshowminiquote(false)
           // quote
        setShowMobileUserDropdown(false)
        setShowSuggestion(false)
        setSuggestionsData({})
    }, [location?.pathname])

    useEffect(() => {
        setValue(searchedText)
        if (location.pathname?.split('/')?.[1] === 'search') {
            setValue(searchedText?.replace(/%20/g, " "))
            setShowSuggestion(false)
        } else {
            setValue('')
            setSearchQuery("")
        }
    }, [searchedText, location.pathname]);

    return (
        <>
            <Stack className="middle-header">
                <Stack className='container'>
                    <Stack className='row'>
                        <Stack className='menu-btn header-menu-btn'>
                            <Sidebarmobile headerData={headerData} />
                        </Stack>
                        {logoBlock}
                        <Stack className='category-search middle-sections common_input_block_section'>
                            <ClickAwayListener onClickAway={() => setShowSuggestion(false)}>
                                <Stack className='search_container'>
                                    <Box className='input-block search-block'>
                                        <TextField className='input-text'
                                            name='search'
                                            id='search'
                                            placeholder='Search'
                                            inputProps={{
                                                autoComplete: "off",
                                                form: {
                                                    autoComplete: "off",
                                                },
                                            }}
                                            value={value}
                                            onChange={(e) => handlerChange(true, e)}
                                            onFocus={() => {
                                                setShowSuggestion(true)
                                                setIsFocusedSearch(true)
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (searchQuery?.length > 2 && searchQuery.trim() !== "" && !isEnterPressed) {
                                                        searchSuggestion(dispatch, searchQuery, setSuggestionsData, setShowSuggestion);
                                                    }
                                                }
                                                handlerChange(false, e)
                                                pressEnterCallFunction(e, searchResultHandler)
                                            }}
                                        />
                                        <img
                                            src={SearchLens}
                                            className='search-img' alt='Search'
                                            onClick={() => searchResultHandler()}
                                        />
                                    </Box>
                                    {/* Search suggestion*/}
                                    {
                                        showSuggestion && searchQuery?.length > 2 ?
                                            <Searchsuggestion
                                                suggestionsData={suggestionsData?.data}
                                                message={suggestionsData?.message}
                                                value={searchQuery}
                                                setShowSuggestion={setShowSuggestion}
                                                setSuggestionsData={setSuggestionsData}
                                                setValue={setValue}
                                            />
                                            : ""
                                    }
                                    {/* Recent Search */}
                                    {
                                        showSuggestion && searchQuery?.length <= 2 && recentSearchData?.length && isFocusedSearch ?
                                            <RecentSearch
                                                setValue={setValue}
                                                setSuggestionsData={setSuggestionsData}
                                                setShowSuggestion={setShowSuggestion}
                                            />
                                            : ""
                                    }
                                </Stack>
                            </ClickAwayListener>
                        </Stack>

                        <Stack className='account-cart-list middle-sections'>
                            <Stack className='list-section'>
                                <Stack
                                    className='icon-img-text myaccount-icons'
                                    onClick={() => setShowMobileUserDropdown(!showMobileUserDropdown)}
                                    sx={{
                                        visibility: !isloggeduser ? 'hidden' : ''
                                    }}
                                >
                                    <Box className='icon-img-sec'>
                                        <img src={MyAccount} className='icon-img' alt='My Account' />
                                    </Box>

                                    <Typography className='list-text'>
                                        {
                                            isloggeduser ? loggedInUserData?.firstname : "My Account "
                                        }
                                    </Typography>
                                    {
                                        showMobileUserDropdown && <ClickAwayListener onClickAway={() => setShowMobileUserDropdown(false)}>
                                            <Box className='loggedin-user mobile'>
                                                {
                                                    isloggeduser ?
                                                        <Box className='logged-in-user-dropdown mobile'>
                                                            <Stack className='dp-block'>
                                                                <Typography className='welcome'>Hello {loggedInUserData?.firstname}!</Typography>
                                                                <Divider />
                                                                <Box className='links-block'>
                                                                    <Link className='account link' to="/account/dashboard" onClick={() => setShowMobileUserDropdown(false)}>My Account</Link>
                                                                    <p className='sign-out link' onClick={() => {
                                                                        setShowMobileUserDropdown(false)
                                                                        Action_Logout(dispatch, navigate)
                                                                    }}>Sign Out</p>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                        :
                                                        <>
                                                            <Box className='logged-in-user-dropdown mobile'>
                                                                <Stack className='dp-block'>
                                                                    <Typography className='welcome'>Hello User!</Typography>
                                                                    <Divider />
                                                                    <Box className='links-block'>
                                                                        <Typography
                                                                            className='link'
                                                                            onClick={() => {
                                                                                setShowMobileUserDropdown(false)
                                                                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                                                    loginReg: !showAuthencationPopup?.loginReg,
                                                                                    forgotPas: false,
                                                                                    resetPass: false
                                                                                }))
                                                                            }}>Login</Typography>
                                                                        <Typography
                                                                            className='sign-out link'
                                                                            onClick={() => {
                                                                                setShowMobileUserDropdown(false)
                                                                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                                                    loginReg: !showAuthencationPopup?.loginReg,
                                                                                    forgotPas: false,
                                                                                    resetPass: false
                                                                                }))
                                                                            }}>Sign Up</Typography>
                                                                    </Box>
                                                                </Stack>
                                                            </Box>
                                                        </>
                                                }
                                            </Box>
                                        </ClickAwayListener>
                                    }
                                </Stack>
                                <BootstrapTooltip title="My Wishlist">
                                <Stack
                                    className='icon-img-text wishlist-section'
                                    onClick={() => isloggeduser ?
                                        navigate('/account/mywishlist') :
                                        dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                            loginReg: !showAuthencationPopup?.loginReg,
                                            forgotPas: false,
                                            resetPass: false
                                        }))
                                    }
                                >
                                    <Badge
                                        badgeContent={`${wishlistData?.item_count === undefined ? 0 : wishlistData?.item_count}`}
                                        color="primary" max={9}
                                    >
                                        <Box className='wishlist-button'>
                                            <img src={MyWishlist} className='icon-img' alt='Wishlist' />
                                        </Box>
                                    </Badge>
                                    {/* <Typography className='list-text'>My Wishlist</Typography> */}
                                </Stack>
                                </BootstrapTooltip>
                              
                                {
                                    isBulkOrder==true?(<>
                                              {/* quote */}
                                              <BootstrapTooltip title="My Quote">
                                <Stack
                                    className='icon-img-text my-cart-section my-quote-icon' 
                                    // quote
                                    onClick={() => {
                                        setshowminiquote(!showminiquote)
                                        
                                        navigate('/myquote')
                                    }
                                        
                                    }
                                    // onClick={() => setshowminicart(!showminicart)}
                                >
                                    <Badge
                                        badgeContent={`${miniQuotecartdetailscount === undefined ? 0 : miniQuotecartdetailscount}`}
                                        color="primary" 
                                        // max={null}
                                    >
                                        <Box className='wishlist-button'>
                                            <img src={MyQuote} className='icon-img' alt='My Cart' />
                                        </Box>
                                    </Badge>
                                    {/* <Typography className='list-text'>My Quote</Typography> */}
                                </Stack>
                                </BootstrapTooltip>
                                    {/* quote */}
                                    </>):""
                                }
                               <BootstrapTooltip title="My Cart">
                                <Stack
                                    className='icon-img-text my-cart-section'
                                    onClick={() => setshowminicart(!showminicart)}
                                >
                                    <Badge
                                        badgeContent={`${miniCartCount === undefined ? 0 : miniCartCount}`}
                                        color="primary" max={9}
                                    >
                                        <Box className='wishlist-button'>
                                            <img src={Mycart} className='icon-img' alt='My Cart' />
                                        </Box>
                                    </Badge>
                                    {/* <Typography className='list-text'>My Cart</Typography> */}
                                </Stack>
                                </BootstrapTooltip>
                            </Stack>

                        </Stack>
                    </Stack>
                </Stack>

            </Stack>
            {
                showminicart ?
                    <Stack className={`minicart_sidebar_model_container ${showminicart ? 'open' : ''}`}>
                        <Minicart
                            anchors={'right'}
                            openCart={showminicart}
                            setshowminicart={setshowminicart}
                            showminicart={showminicart}
                        />
                    </Stack >
                    : ''
            }
               {/* {
                showminiquote ?
                    <Stack className={`minicart_sidebar_model_container ${showminiquote ? 'open' : ''}`}>
                        <MiniQuote
                            anchors={'right'}
                            openCart={showminiquote}
                            setshowminiquote={setshowminiquote}
                            showminiquote={showminiquote}
                        />
                    </Stack >
                    : ''
            } */}
        </>)
}

export default memo(Index);