import React, { useState, useEffect, memo } from 'react';
import "./styles.scss";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Typography, Stack, Box, Drawer, List } from '@mui/material';
import Closeicon from '../../../Assets/header/sidebar/close.svg';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_SHOWAUTHENTICATIONPOPUP, Action_Logout } from "../../../Store/action";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Index = ({ headerData }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openCategories, setOpenCategories] = useState(false);
    const [openSubCategories, setSubOpenCategories] = useState(false);
    const [showSubCategories, setShowSubCategories] = useState(null);
    const [state, setState] = useState({
        left: false,
    });
    const { isloggeduser, showAuthencationPopup } = useSelector(state => {
        return {
            isloggeduser: state?.isloggeduser,
            showAuthencationPopup: state?.showAuthencationPopup
        }
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    useEffect(() => {
        toggleDrawer(true)
        setOpenCategories(false)
    }, [])
    useEffect(() => {
        setSubOpenCategories(false)
        setShowSubCategories(null)
    }, [openCategories])
    return (
        <div className='header-sidebar'>

            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <span className='menu-btn' onClick={toggleDrawer(anchor, true)}>

                        <Stack>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <g id="Group_3099" data-name="Group 3099" transform="translate(0 0)">
                                    <rect id="Rectangle_2394" data-name="Rectangle 2394" width="32" height="32" transform="translate(0 0)" fill="none" />
                                    <g id="Group_3098" data-name="Group 3098" transform="translate(3.719 864.967)">
                                        <line id="Line_276" data-name="Line 276" x2="19.738" transform="translate(0 -840.967)" fill="none" stroke="#3e484a" strokeLinecap="round" strokeWidth="2" />
                                        <line id="Line_277" data-name="Line 277" x2="24.392" transform="translate(0 -848.967)" fill="none" stroke="#3e484a" strokeLinecap="round" strokeWidth="2" />
                                        <line id="Line_278" data-name="Line 278" x2="12.72" transform="translate(0 -856.967)" fill="none" stroke="#3e484a" strokeLinecap="round" strokeWidth="2" />
                                    </g>
                                </g>
                            </svg>
                        </Stack>
                    </span>
                    <Drawer
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        className="header-menu-drawer"
                    >
                        <Box className='slider category-slider-section'>
                            <Box
                                sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 335 }}
                                role="presentation"
                                className="category-slider-block"
                            >
                                <Stack className='signin-header'>

                                    <Box className='box-section-title'>
                                        <Typography className='signin-title'>Menu</Typography>
                                    </Box>
                                    <Box className='signin-closeicon' onClick={toggleDrawer(anchor, false)}>
                                        <img src={Closeicon} alt='Close' />
                                    </Box>
                                </Stack>
                                <List className='menu-list-sidebar'>
                                    <>
                                        <Stack className='main-category'>
                                            <Link
                                                className={`menu-text ${location?.pathname === '/' ? 'active' : ''}`}
                                                to="/"
                                                onClick={() => {
                                                    setState((prevState) => ({
                                                        ...prevState,
                                                        left: false
                                                    }))
                                                }}
                                            >Home</Link>
                                            <Stack className='category-menu-list'>
                                                <Link
                                                    className={`menu-text ${openCategories ? "opened" : ""}`}
                                                    onClick={() => setOpenCategories(!openCategories)} >Categories
                                                    {
                                                        openCategories ?
                                                            <KeyboardArrowUpIcon />
                                                            :
                                                            <KeyboardArrowDownIcon />
                                                    }
                                                </Link>

                                                {
                                                    openCategories ?
                                                        <Stack className='subcategories'>
                                                            <Stack className='subcategory-list'>
                                                                {
                                                                    headerData?.categories?.root?.level1?.map((item, ind) => {
                                                                        return (
                                                                            <Stack className={`subcategory-main-title ${openSubCategories && showSubCategories === ind ? "opened" : ""}`} key={ind}>
                                                                                <Stack className='main-title-block'>
                                                                                    <Link
                                                                                        className='main-title'
                                                                                        to={item?.request_path}
                                                                                        onClick={() => {
                                                                                            setState((prevState) => ({
                                                                                                ...prevState,
                                                                                                left: false
                                                                                            }))
                                                                                        }}
                                                                                    >{item?.name}</Link>
                                                                                    {
                                                                                        item?.level2?.length ?
                                                                                            openSubCategories && showSubCategories === ind ?
                                                                                                <KeyboardArrowUpIcon onClick={() => {
                                                                                                    setSubOpenCategories(false)
                                                                                                    setShowSubCategories(null)
                                                                                                }} />
                                                                                                :
                                                                                                <KeyboardArrowDownIcon onClick={() => {
                                                                                                    setSubOpenCategories(true)
                                                                                                    setShowSubCategories(ind)

                                                                                                }} />
                                                                                            : ''
                                                                                    }
                                                                                </Stack>
                                                                                {
                                                                                    showSubCategories === ind ?
                                                                                        item?.level2?.map((elem, ind) => {
                                                                                            return (
                                                                                                <Stack
                                                                                                    className='category-sub-title-section'
                                                                                                    key={ind}
                                                                                                >
                                                                                                    <Link className='main-title'
                                                                                                        to={elem?.request_path}
                                                                                                        onClick={() => {
                                                                                                            setState((prevState) => ({
                                                                                                                ...prevState,
                                                                                                                left: false
                                                                                                            }))
                                                                                                        }}
                                                                                                    >{elem?.name}</Link>
                                                                                                </Stack>
                                                                                            )
                                                                                        })
                                                                                        : ''

                                                                                }
                                                                            </Stack>
                                                                        )
                                                                    })
                                                                }
                                                            </Stack>
                                                        </Stack>
                                                        : ""
                                                }


                                            </Stack>
                                            <Link
                                                className={`menu-text ${location?.pathname === '/about-us' ? 'active' : ''}`}
                                                to="/about-us"
                                                onClick={() => {
                                                    setState((prevState) => ({
                                                        ...prevState,
                                                        left: false
                                                    }))
                                                }}
                                            >About Us</Link>
                                            <Link
                                                className={`menu-text ${location?.pathname === '/contact-us' ? 'active' : ''}`}
                                                to="/contact-us"
                                                onClick={() => {
                                                    setState((prevState) => ({
                                                        ...prevState,
                                                        left: false
                                                    }))
                                                }}
                                            >Contact Us</Link>
                                            {
                                                isloggeduser ?
                                                    <Link
                                                        className={`menu-text ${location?.pathname === '/account/mywishlist' ? 'active' : ''}`}
                                                        to="/account/mywishlist"
                                                        onClick={() => {
                                                            setState((prevState) => ({
                                                                ...prevState,
                                                                left: false
                                                            }))
                                                        }}
                                                    >My Wishlist</Link>
                                                    : ''
                                            }

                                            <Stack className='menu-text auth_block'>
                                                {
                                                    isloggeduser ?
                                                        <Typography
                                                            className='login'
                                                            onClick={() => {
                                                                setState((prevState) => ({
                                                                    ...prevState,
                                                                    left: false
                                                                }))
                                                                Action_Logout(dispatch, navigate)
                                                            }}
                                                        >Logout</Typography>
                                                        :
                                                        <>
                                                            <Typography
                                                                className='login'
                                                                onClick={() => {
                                                                    setState((prevState) => ({
                                                                        ...prevState,
                                                                        left: false
                                                                    }))
                                                                    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                                        loginReg: !showAuthencationPopup?.loginReg,
                                                                        forgotPas: false,
                                                                        resetPass: false
                                                                    }))
                                                                }}
                                                            >Login</Typography>
                                                            <Typography className='divider'>/</Typography>
                                                            <Typography
                                                                className='register'
                                                                onClick={() => {
                                                                    setState((prevState) => ({
                                                                        ...prevState,
                                                                        left: false
                                                                    }))
                                                                    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                                        loginReg: !showAuthencationPopup?.loginReg,
                                                                        forgotPas: false,
                                                                        resetPass: false
                                                                    }))
                                                                }}
                                                            >Register</Typography>
                                                        </>
                                                }
                                            </Stack>
                                        </Stack>
                                    </>
                                </List>
                            </Box>
                        </Box>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
export default memo(Index);