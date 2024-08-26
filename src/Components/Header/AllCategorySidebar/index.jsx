import React, { useState, useEffect, memo } from 'react';
import "./styles.scss";
import { Link, useLocation } from 'react-router-dom';
import { Typography, Stack, Box, Drawer, List } from '@mui/material';
import Closeicon from '../../../Assets/header/sidebar/close.svg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Index = ({ headerData }) => {
    const location = useLocation();
    const [openCategories, setOpenCategories] = useState(false);
    const [openSubCategories, setSubOpenCategories] = useState(false);
    const [showSubCategories, setShowSubCategories] = useState(null);
    const [state, setState] = useState({
        left: false,
    });

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
    useEffect(() => {
        if (state?.left) {
            setState(() => ({
                left: false,
            }));
        }
    }, [location?.pathname])
    return (
        <div className='header-sidebar'>

            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <span className='menu-btn' onClick={toggleDrawer(anchor, true)}>

                        <Stack className='allcategory-section'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g id="Group_157" data-name="Group 157" transform="translate(-16987 -3686)">
                                    <rect id="Rectangle_270" data-name="Rectangle 270" width="24" height="24" transform="translate(16987 3686)" fill="none" />
                                    <g id="Group_2" data-name="Group 2" transform="translate(16856 3518.346)">
                                        <line id="Line_2" data-name="Line 2" x2="18" transform="translate(134 173.654)" fill="none" stroke="#2b2525" strokeLinecap="round" strokeWidth="2" />
                                        <line id="Line_3" data-name="Line 3" x2="18" transform="translate(134 179.654)" fill="none" stroke="#2b2525" strokeLinecap="round" strokeWidth="2" />
                                        <line id="Line_4" data-name="Line 4" x2="18" transform="translate(134 185.654)" fill="none" stroke="#2b2525" strokeLinecap="round" strokeWidth="2" />
                                    </g>
                                </g>
                            </svg>
                            <Typography className='msg'>All Categories</Typography>

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
                                <Stack className='signin-header section'>

                                    <Box className='box-section-title main-title'>
                                        <Typography className='signin-title'>ALL CATEGORIES</Typography>
                                    </Box>
                                    <Box className='signin-closeicon' onClick={toggleDrawer(anchor, false)}>
                                        <img src={Closeicon} alt='Close' />
                                    </Box>
                                </Stack>
                                <List className='menu-list-sidebar'>
                                    <>
                                        <Stack className='main-category'>

                                            <Stack className='category-menu-list-section'>
                                                <Stack className='subcategories-section'>
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