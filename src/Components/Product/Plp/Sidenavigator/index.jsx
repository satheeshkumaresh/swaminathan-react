import React, { useState, useEffect } from 'react';
import "./styles.scss";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Typography, Stack, Box, Drawer, List, Radio, FormControl, FormControlLabel, Button,
    Divider
} from '@mui/material';
import Closeicon from '../../../../Assets/header/sidebar/close.svg';
import { useSelector, useDispatch } from 'react-redux';
import {
    ACTION_PLPFILTERPARAMS, ACTION_SEARCHFILTERPARAMS,
    ACTION_ISSEARCHRESULT
} from "../../../../Store/action";
import ReactSlider from 'react-slider'
import { formatCurrency } from "../../../../Utilities/Utilities";

const Index = ({ productlistData, setSidebarData, setIsPriceFiltered,
    setSelectedKey, setSelectedTag
}) => {
    const {
        plpFilterParams, searchfilterparams, isSearchResult
    } = useSelector(state => {
        return {
            homepage: state?.homepage,
            isloggeduser: state?.isloggeduser,
            userdata: state?.userdata,
            filteredData: state?.filteredData,
            plpFilterParams: state?.plpFilterParams,
            currency: state?.currency,
            priceFilteredData: state?.priceFilteredData,
            searchfilterparams: state?.searchfilterparams,
            isSearchResult: state?.isSearchResult
        }
    })
    let [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedWeight, setSelectedWeight] = useState("");
    const [selectedTagFilter, setSelectedTagFilter] = useState("");
    const [categoryShowMore, setCategoryShowMore] = useState(4);
    const [weightShowMore, setWeightShowMore] = useState(4);
    const [value, setValue] = useState([]);
    const [changedPrice, setChangedPrice] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        left: false,
    });

    const handlerSeeMore = () => {
        if (productlistData?.all_category?.[0]?.level1?.length > 4 && categoryShowMore === 4) {
            setCategoryShowMore(productlistData?.all_category?.[0]?.level1?.length)
        } else if (productlistData?.all_category?.[0]?.level1?.[0]?.level2?.length > 4 && categoryShowMore === 4) {
            setCategoryShowMore(productlistData?.all_category?.[0]?.level1?.[0]?.level2?.length)
        } else {
            setCategoryShowMore(4)
        }
    }
    const handlerSeeMoreWeight = () => {
        if (productlistData?.layered_filter?.size_in_kg?.length > 4 && weightShowMore === 4) {
            setWeightShowMore(productlistData?.layered_filter?.size_in_kg?.length)
        } else {
            setWeightShowMore(4)
        }
    }
    const applyFilter = () => {
        if (location?.state?.from?.isSearchResult || isSearchResult) {
            dispatch(ACTION_ISSEARCHRESULT(true))
            navigate({
                pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&min_price=${changedPrice?.[0]}&max_price=${changedPrice?.[1]}&page=1${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
            })

        } else {
            navigate({
                search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&min_price=${changedPrice?.[0]}&max_price=${changedPrice?.[1]}&page=1${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
            });
        }
    }
    const clearAll = () => {
        setSelectedTag("")
        if (location?.state?.from?.isSearchResult || isSearchResult) {
            dispatch(ACTION_ISSEARCHRESULT(true))
            navigate({
                pathname: `/search/keyword=${productlistData?.searched_keyword}/`
            })
        } else {
            navigate(`/${location?.pathname?.split("/")?.[1]}.html`)
        }
    }
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    useEffect(() => {
        toggleDrawer(true)
    }, [])
    useEffect(() => {
        if (productlistData?.available_filter?.[0]?.max_price || productlistData?.available_filter?.[0]?.max_price) {
            setValue([
                productlistData?.available_filter?.[0]?.min_price,
                productlistData?.available_filter?.[0]?.max_price
            ])
            setChangedPrice([
                productlistData?.available_filter?.[0]?.min_price,
                productlistData?.available_filter?.[0]?.max_price
            ])
        } else {
            setValue([productlistData?.min_price, productlistData?.max_price])
            setChangedPrice([productlistData?.min_price, productlistData?.max_price])
        }
        setSelectedCategory(productlistData?.available_filter?.[0]?.filterable_category_name);
        setSelectedWeight(productlistData?.available_filter?.[0]?.size_filter);
        setSelectedTagFilter(productlistData?.available_filter?.[0]?.tag_filter);
        setCategoryShowMore(4);
        setWeightShowMore(4);
    }, [productlistData])
    return (
        <div className='header-sidebar filter-count'>

            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <span className='menu-btn' onClick={toggleDrawer(anchor, true)}>

                        <Stack className=' plp-filter-grid filter-section-navigation'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="9.633" viewBox="0 0 17 9.633">
                                <g id="filter" transform="translate(-1.5 -11.25)">
                                    <path id="Path_11417" data-name="Path 11417" d="M17.65,12.95H2.35a.85.85,0,0,1,0-1.7h15.3a.85.85,0,1,1,0,1.7Z" transform="translate(0 0)" fill="#2b2525" />
                                    <path id="Path_11418" data-name="Path 11418" d="M19.483,23.45H9.85a.85.85,0,1,1,0-1.7h9.633a.85.85,0,0,1,0,1.7Z" transform="translate(-4.667 -6.533)" fill="#2b2525" />
                                    <path id="Path_11419" data-name="Path 11419" d="M21.683,33.95H18.85a.85.85,0,0,1,0-1.7h2.833a.85.85,0,0,1,0,1.7Z" transform="translate(-10.267 -13.067)" fill="#2b2525" />
                                </g>
                            </svg>
                            <Typography className='filter-title' variant='span'>Filter</Typography>

                        </Stack>
                    </span>
                    <Drawer
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        className="header-menu-drawer"
                    >
                        <Box className='slider filter-slider-section-navigation'>
                            <Box
                                sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 335 }}
                                role="presentation"
                                className="category-slider-block"
                            >
                                <Stack className='signin-header'>

                                    <Box className='box-section-title'>
                                        <Typography className='signin-title'>Filter</Typography>
                                    </Box>

                                    <Box className='signin-closeicon' onClick={toggleDrawer(anchor, false)}>
                                        <img src={Closeicon} alt='' />
                                    </Box>
                                </Stack>
                                <Stack className='content-list-section'>
                                    <List className='navigation-list-section'>
                                        <>
                                            {/* Category */}
                                            <Stack className='main-category'>
                                                {
                                                    productlistData?.all_category?.[0]?.level1?.[0]?.level2?.length ?
                                                        <>
                                                            <Typography className='filter-title-text' variant='h6'>
                                                                {productlistData?.all_category?.[0]?.level1?.[0]?.name}
                                                            </Typography>
                                                            <Stack className='categories-grid-section'>
                                                                {productlistData?.all_category?.[0]?.level1?.[0]?.level2?.slice(0, categoryShowMore)?.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <FormControl className='filter-category-list'>
                                                                                <FormControlLabel
                                                                                    value={item?.name}
                                                                                    control={<Radio />}
                                                                                    label={item?.name}
                                                                                    onClick={() => {
                                                                                        setSelectedKey(item?.request_path)
                                                                                        setSelectedCategory(item?.name)
                                                                                        if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                                                            setTimeout(() => {
                                                                                                dispatch(ACTION_ISSEARCHRESULT(true))
                                                                                                navigate({
                                                                                                    pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                                                    search: `&filterable_category_id=${item?.id}`
                                                                                                })
                                                                                            }, 300);
                                                                                        } else {
                                                                                            setTimeout(() => {
                                                                                                navigate(`/${item?.request_path}?filterable_category_id=${item?.id}`)
                                                                                            }, 300);
                                                                                        }
                                                                                    }}
                                                                                    checked={selectedCategory == item?.name}
                                                                                />
                                                                                <Typography className='category-count'>({item?.product_count})</Typography>
                                                                            </FormControl>
                                                                        </>
                                                                    )
                                                                })}
                                                                {
                                                                    productlistData?.all_category?.[0]?.level1?.[0]?.level2?.length > 4 ?
                                                                        <Typography
                                                                            className='filter-seemore'
                                                                            variant='span'
                                                                            onClick={() => handlerSeeMore()}>
                                                                            {
                                                                                categoryShowMore === 4 ?
                                                                                    'See More' : 'Show Less'
                                                                            }
                                                                        </Typography>
                                                                        : ''
                                                                }
                                                            </Stack>
                                                        </>
                                                        :
                                                        <>
                                                            <Stack className='categories-grid-section'>
                                                                {productlistData?.all_category?.[0]?.level1?.slice(0, categoryShowMore)?.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <FormControl className='filter-category-list' key={index}>
                                                                                <FormControlLabel
                                                                                    value={item?.name}
                                                                                    control={<Radio />}
                                                                                    label={item?.name}
                                                                                    onClick={() => {
                                                                                        setSelectedKey(item?.request_path)
                                                                                        setSelectedCategory(item?.name)
                                                                                        if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                                                            setTimeout(() => {
                                                                                                dispatch(ACTION_ISSEARCHRESULT(true))
                                                                                                navigate({
                                                                                                    pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                                                    search: `&filterable_category_id=${item?.id}`
                                                                                                })
                                                                                            }, 300);
                                                                                        } else {
                                                                                            setTimeout(() => {
                                                                                                navigate(`/${item?.request_path}?filterable_category_id=${item?.id}`)
                                                                                            }, 300);
                                                                                        }
                                                                                    }}
                                                                                    checked={selectedCategory == item?.name}
                                                                                />
                                                                                <Typography className='category-count'>({item?.product_count})</Typography>
                                                                            </FormControl>
                                                                        </>
                                                                    )
                                                                })}
                                                                {
                                                                    productlistData?.all_category?.[0]?.level1?.[0]?.level2?.length > 4 ?
                                                                        <Typography
                                                                            className='filter-seemore'
                                                                            variant='span'
                                                                            onClick={() => handlerSeeMore()}>
                                                                            {
                                                                                categoryShowMore >= 4 ?
                                                                                    'See More' : 'Show Less'
                                                                            }
                                                                        </Typography>
                                                                        : ''
                                                                }
                                                            </Stack>
                                                        </>
                                                }

                                            </Stack>
                                            {
                                                productlistData?.all_category?.[0]?.level1?.length ?
                                                    <Divider />
                                                    : ''
                                            }
                                            {/* Price */}
                                            {
                                                changedPrice?.[0] !== undefined || changedPrice?.[1] !== undefined ?
                                                    <>
                                                        <Stack className='main-category price-slider-section'>
                                                            <Typography className='filter-title-text' variant='h6'>Price</Typography>
                                                            <ReactSlider
                                                                className="horizontal-slider price-ranger-slider"
                                                                thumbClassName="example-thumb"
                                                                trackClassName="example-track"
                                                                defaultValue={[value?.[0], value?.[1]]}
                                                                max={productlistData?.max_price}
                                                                min={productlistData?.min_price}
                                                                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                                                onBeforeChange={(value, index) => {
                                                                    setChangedPrice([value?.[0], value?.[1]])
                                                                }
                                                                }
                                                                onChange={(value, index) => {
                                                                    setChangedPrice([value?.[0], value?.[1]])
                                                                }
                                                                }
                                                                onAfterChange={(value, index) => {
                                                                    setChangedPrice([value?.[0], value?.[1]])
                                                                    if (location?.state?.from?.isSearchResult) {
                                                                        dispatch(ACTION_SEARCHFILTERPARAMS({
                                                                            keyword: searchfilterparams?.keyword,
                                                                            min_price: searchfilterparams?.min_price,
                                                                            max_price: searchfilterparams?.max_price,
                                                                            sort_order: searchfilterparams?.sort_order,
                                                                            page: searchfilterparams?.page,
                                                                            size: searchfilterparams?.size,
                                                                            show_page: searchfilterparams?.show_page,
                                                                            filterable_category_id: searchfilterparams?.filterable_category_id,
                                                                            tag_filter: searchfilterparams?.tag_filter
                                                                        }))
                                                                    } else {
                                                                        dispatch(ACTION_PLPFILTERPARAMS({
                                                                            url_key: plpFilterParams?.url_key ? plpFilterParams?.url_key : location?.pathname?.slice(1),
                                                                            min_price: value?.[0],
                                                                            max_price: value?.[1],
                                                                            sort_order: plpFilterParams?.sort_order,
                                                                            page: plpFilterParams?.page,
                                                                            size: plpFilterParams?.size,
                                                                            show_page: plpFilterParams?.show_page,
                                                                            filterable_category_id: plpFilterParams?.filterable_category_id,
                                                                            tag_filter: plpFilterParams?.tag_filter
                                                                        }))
                                                                    }
                                                                    setIsPriceFiltered(true)
                                                                }
                                                                }
                                                            />
                                                            <Typography className='filter-price-text' variant='h6'>Price:
                                                                <Typography className='price-value'>{formatCurrency?.format(changedPrice?.[0])} - {formatCurrency?.format(changedPrice?.[1])}</Typography>
                                                            </Typography>
                                                            {/* Apply filter */}
                                                            <Stack className='btn-section price_apply_btn  sidebar_filter_btn'>
                                                                <Button
                                                                    className='seeall_small_btn'
                                                                    fullWidth
                                                                    onClick={() => applyFilter()}
                                                                >Apply Filter</Button>
                                                            </Stack>
                                                        </Stack>
                                                    </>
                                                    : ''
                                            }
                                            {/* Weight */}
                                            {
                                                productlistData?.layered_filter?.size_in_kg?.length ?
                                                    <>
                                                        <Divider />
                                                        <Stack className='main-category'>
                                                            <Typography className='filter-title-text' variant='h6'>Weight (Kg)</Typography>
                                                            <Stack className='categories-grid-section'>
                                                                {productlistData?.layered_filter?.size_in_kg?.slice(0, weightShowMore)?.map((item, index) => {
                                                                    return (
                                                                        <>
                                                                            <FormControl className='filter-category-list' >
                                                                                <FormControlLabel
                                                                                    value={item?.value}
                                                                                    control={<Radio />}
                                                                                    label={item?.display}
                                                                                    onClick={() => {
                                                                                        setSidebarData((prevState) => ({
                                                                                            ...prevState,
                                                                                            weight: item?.value
                                                                                        }))
                                                                                        if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                                                            dispatch(ACTION_ISSEARCHRESULT(true))
                                                                                            navigate({
                                                                                                pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                                                search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&page=1${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}&size=${item?.value}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`
                                                                                            })
                                                                                        } else {
                                                                                            navigate({
                                                                                                search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&page=1${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}&size=${item?.value}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    checked={selectedWeight == item?.display ? true : false}
                                                                                />
                                                                                <Typography className='category-count'>({item?.count})</Typography>
                                                                            </FormControl>
                                                                        </>
                                                                    )
                                                                })}
                                                                {
                                                                    productlistData?.layered_filter?.size_in_kg?.length > 4 ?
                                                                        <Typography
                                                                            className='filter-seemore'
                                                                            variant='span'
                                                                            onClick={() => handlerSeeMoreWeight()}>
                                                                            {
                                                                                weightShowMore === 4 ?
                                                                                    'See More' : 'Show Less'
                                                                            }
                                                                        </Typography>
                                                                        : ''
                                                                }
                                                            </Stack>

                                                        </Stack>
                                                    </>
                                                    : ''
                                            }
                                            {/* Tags */}
                                            {
                                                productlistData?.tag_filter?.new_arrival?.label ||
                                                    productlistData?.tag_filter?.on_offer?.label ?
                                                    <>
                                                        <Divider />
                                                        <Stack className='main-category'>
                                                            <Typography className='filter-title-text' variant='h6'>Tags</Typography>
                                                            <Stack className='categories-grid-section'>
                                                                {/* On Offer */}
                                                                {
                                                                    productlistData?.tag_filter?.on_offer?.label ?
                                                                        <FormControl className='filter-category-list' >
                                                                            <FormControlLabel
                                                                                value={productlistData?.tag_filter?.on_offer?.count}
                                                                                control={<Radio />}
                                                                                label={productlistData?.tag_filter?.on_offer?.label}
                                                                                onClick={() => {
                                                                                    setSelectedTagFilter(productlistData?.tag_filter?.on_offer?.label)
                                                                                    if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                                                        dispatch(ACTION_ISSEARCHRESULT(true))
                                                                                        navigate({
                                                                                            pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                                            search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&page=1${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}&tag_filter=1`,
                                                                                        })
                                                                                    } else {
                                                                                        navigate({
                                                                                            search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&page=1${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}&tag_filter=1`,
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                checked={selectedTagFilter == productlistData?.tag_filter?.on_offer?.label}
                                                                            />
                                                                            <Typography className='category-count'>({productlistData?.tag_filter?.on_offer?.count})</Typography>
                                                                        </FormControl>
                                                                        : ''
                                                                }
                                                                {/* New Arrivals */}
                                                                {
                                                                    productlistData?.tag_filter?.new_arrival?.label ?
                                                                        <FormControl className='filter-category-list' >
                                                                            <FormControlLabel
                                                                                value={productlistData?.tag_filter?.new_arrival?.count}
                                                                                control={<Radio />}
                                                                                label={productlistData?.tag_filter?.new_arrival?.label}
                                                                                onClick={() => {
                                                                                    setSelectedTagFilter(productlistData?.tag_filter?.new_arrival?.label)
                                                                                    if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                                                        dispatch(ACTION_ISSEARCHRESULT(true))
                                                                                        navigate({
                                                                                            pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                                            search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}&page=1${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}&tag_filter=2`,
                                                                                        })
                                                                                    } else {
                                                                                        navigate({
                                                                                            search: `?${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `&min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}&page=1${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}&tag_filter=2`,
                                                                                        });
                                                                                    }
                                                                                }}
                                                                                checked={selectedTagFilter == productlistData?.tag_filter?.new_arrival?.label}
                                                                            />
                                                                            <Typography className='category-count'>({productlistData?.tag_filter?.new_arrival?.count})</Typography>
                                                                        </FormControl>
                                                                        : ''
                                                                }
                                                            </Stack>
                                                        </Stack>
                                                        <Divider />
                                                        {/* Clear filter */}
                                                        <Stack className='btn-section price_apply_btn  sidebar_filter_btn clear-btn-section'>
                                                            <Button
                                                                className='seeall_small_btn'
                                                                fullWidth
                                                                onClick={() => clearAll()}
                                                            >Clear All Filter</Button>
                                                        </Stack>
                                                    </>
                                                    : ''
                                            }
                                        </>
                                    </List>
                                </Stack>

                            </Box>
                        </Box>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
export default Index;