import React, { useState, useEffect, memo } from 'react';
import "./styles.scss";
import { Typography, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_SHOWAUTHENTICATIONPOPUP } from "../../../Store/action";
import AllCategorySidebar from '../AllCategorySidebar';

const Index = ({ headerData }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isloggeduser, showAuthencationPopup } = useSelector(state => {
        return {
            isloggeduser: state?.isloggeduser,
            showAuthencationPopup: state?.showAuthencationPopup
        }
    })
    const [openCategories, setOpenCategories] = useState(false);
    const [categoriesData, setCategoriesData] = useState([])

    useEffect(() => {
        const data = headerData?.categories?.root?.level1?.filter((item) => item?.include_in_menu === 1);
        setCategoriesData(data)
    }, [headerData])
    useEffect(() => {
        setOpenCategories(false)
    }, [location?.pathname])
    return (

        <Stack className="bottom-header">
            <Stack className='container'>
                <Stack className='row'>
                    <Stack className='menu-login-section'>
                        <Stack className={`menu-btn header-menu-btn-section ${location?.pathname === '/' ? '' : 'active'}`} >
                            <AllCategorySidebar headerData={headerData} />
                        </Stack>
                        <Stack className='menu-section'>
                            <Stack className="menu-list">
                                <>
                                    <Stack className='main-category'>
                                        <Link className={`menu-text ${location?.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
                                        <Stack className='category-menu-list'>

                                            <Typography className='menu-text' onClick={() => setOpenCategories(!openCategories)}>
                                                Categories
                                                {
                                                    openCategories ?
                                                        <KeyboardArrowUpIcon />
                                                        :
                                                        <KeyboardArrowDownIcon />
                                                }
                                            </Typography>

                                            {
                                                openCategories ?
                                                    <ClickAwayListener onClickAway={() => setOpenCategories(false)}>

                                                        <Stack className='subcategories'>
                                                            <Stack className='subcategory-list'>
                                                                {
                                                                    categoriesData?.slice(0, 6)?.map((item, ind) => {
                                                                        return (
                                                                            <Stack className='subcategory-main-title' key={ind}>
                                                                                <Link
                                                                                    className='main-title'
                                                                                    to={item?.request_path}
                                                                                    onClick={() => {
                                                                                        setOpenCategories(!openCategories)
                                                                                    }}
                                                                                >{item?.name}</Link>
                                                                                {
                                                                                    item?.level2?.map((elem, index) => {
                                                                                        return (
                                                                                            <Stack
                                                                                                className='category-sub-title-section'
                                                                                                key={index}
                                                                                                onClick={() => setOpenCategories(!openCategories)}
                                                                                            >
                                                                                                <Link
                                                                                                    className='main-title'
                                                                                                    to={elem?.request_path}
                                                                                                    onClick={() => {
                                                                                                        setOpenCategories(!openCategories)
                                                                                                    }}
                                                                                                >{elem?.name}</Link>
                                                                                            </Stack>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Stack>
                                                                        )
                                                                    })
                                                                }
                                                            </Stack>

                                                        </Stack>
                                                    </ClickAwayListener>

                                                    : ""
                                            }

                                        </Stack>
                                        <Link className={`menu-text ${location?.pathname === '/about-us' ? 'active' : ''}`} to="/about-us">About Us</Link>
                                        <Link className={`menu-text ${location?.pathname === '/contact-us' ? 'active' : ''}`} to="/contact-us">Contact Us</Link>
                                    </Stack>
                                </>
                            </Stack>

                        </Stack>
                        {
                            !isloggeduser ?
                                <Stack className='login-register-section'>
                                    <Stack className='login-section-text'>
                                        <Typography
                                            className='text-section1 text-section'
                                            onClick={() => {
                                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                    loginReg: !showAuthencationPopup?.loginReg,
                                                    forgotPas: false,
                                                    resetPass: false
                                                }))
                                            }}
                                        >Login</Typography>
                                        &nbsp;<Typography className='text-section'>/</Typography>&nbsp;
                                        <Typography
                                            className='text-section1 text-section'
                                            onClick={() => {
                                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                                    loginReg: !showAuthencationPopup?.loginReg,
                                                    forgotPas: false,
                                                    resetPass: false
                                                }))
                                            }}
                                        >Register</Typography>
                                        <Typography className='text-section2 text-section header-msg'>for best experience</Typography>
                                    </Stack>
                                </Stack>
                                : ''
                        }
                    </Stack>
                </Stack>
            </Stack>
        </Stack>

    )
}
export default memo(Index);
