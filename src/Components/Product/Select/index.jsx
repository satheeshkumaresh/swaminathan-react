import React, { useState, useRef } from 'react';
import "./styles.scss";
import { Box, Stack, Typography } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useSelector, useDispatch } from 'react-redux';
import { ACTION_ISSEARCHRESULT } from "../../../Store/action";
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';

const Index = ({
    data, appliedShow, clsName, appyShow, setShow, appliedShort
}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const { isSearchResult, productlistData } = useSelector(state => {
        return {
            available_filter: state?.productListData?.[0]?.data?.[0]?.available_filter,
            filteredData: state?.filteredData,
            priceFilteredData: state?.priceFilteredData,
            currency: state?.homepage?.[0]?.currency,
            plpFilterParams: state?.plpFilterParams,
            searchfilterparams: state?.searchfilterparams,
            isSearchResult: state?.isSearchResult,
            productlistData: state?.productListData?.[0]?.data?.[0],
        }
    })
    const ref = useRef();
    const [isActive, setisActive] = useState(false);
    const [selectedcategory, setSelectedcategory] = useState("");
    
    return (
        <ClickAwayListener onClickAway={() => setisActive(false)}>
            <Stack className={`form-select ${clsName}`}>
                <Box className='select-dropdown'>
                    <Box className='custom-dropdown' ref={ref}>
                        <Box className="dropdown-btn"
                            onClick={
                                () => {
                                    setisActive(!isActive)
                                }
                            }
                        >
                            <Typography variant='span' className='labelname'>
                                {
                                    appyShow == "plp_show" ? appliedShow : selectedcategory
                                }
                                {
                                    appyShow == "plp_sort" ? appliedShort : selectedcategory
                                }
                            </Typography>
                            <Typography variant='span' className='drop-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.257" height="6.54" viewBox="0 0 12.257 6.54">
                                    <path id="_1acaf6b70816ed66265a220e44035b82" data-name="1acaf6b70816ed66265a220e44035b82" d="M.733.121a.446.446,0,0,0-.611,0,.446.446,0,0,0,0,.611L5.515,6.126.121,11.52a.446.446,0,0,0,0,.611.421.421,0,0,0,.306.126.421.421,0,0,0,.306-.126l5.681-5.7a.51.51,0,0,0,.126-.306.51.51,0,0,0-.126-.306Z" transform="translate(12.257) rotate(90)" />
                                </svg>
                            </Typography>
                        </Box>
                        {
                            isActive &&

                            <Box className="dropdown-content">
                                {
                                    data?.map((item, ind) =>
                                        <Typography className='dropdown-item' value={item?.value} key={ind}
                                            onClick={
                                                () => {
                                                    setisActive(false)
                                                    if (appyShow === "plp_show") {
                                                        const pageCount = Math.ceil(productlistData?.product_count / parseInt(item?.value));
                                                        const current_Page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
                                                        if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                            if (current_Page > pageCount) {
                                                                dispatch(ACTION_ISSEARCHRESULT(true))
                                                                navigate({
                                                                    pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                    search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${pageCount}` : ''}&show_page=${item?.value}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                                })
                                                            } else {
                                                                dispatch(ACTION_ISSEARCHRESULT(true))
                                                                navigate({
                                                                    pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                    search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}&show_page=${item?.value}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                                })
                                                            }
                                                        } else {
                                                            if (current_Page > pageCount) {
                                                                navigate({
                                                                    search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${pageCount}` : ''}&show_page=${item?.value}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                                });
                                                            } else {
                                                                navigate({
                                                                    search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}${searchParams.get('sort_order') ? `&sort_order=${searchParams.get('sort_order')}` : ''}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}&show_page=${item?.value}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                                });
                                                            }
                                                        }
                                                        setShow(item?.value)
                                                    } else if (appyShow === "plp_sort") {
                                                        if (location?.state?.from?.isSearchResult || isSearchResult) {
                                                            dispatch(ACTION_ISSEARCHRESULT(true))
                                                            navigate({
                                                                pathname: `/search/keyword=${productlistData?.searched_keyword}/`,
                                                                search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}&sort_order=${item?.value}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                            })
                                                        } else {
                                                            navigate({
                                                                search: `${searchParams.get('product_list_mode') ? `&product_list_mode=${searchParams.get('product_list_mode')}` : ''}${searchParams.get('min_price') ? `min_price=${searchParams.get('min_price')}` : ''}${searchParams.get('max_price') ? `&max_price=${searchParams.get('max_price')}` : ''}&sort_order=${item?.value}${searchParams.get('size') ? `&size=${searchParams.get('size')}` : ''}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}${searchParams.get('show_page') ? `&show_page=${searchParams.get('show_page')}` : ''}${searchParams.get('filterable_category_id') ? `&filterable_category_id=${searchParams.get('filterable_category_id')}` : ''}${searchParams.get('tag_filter') ? `&tag_filter=${searchParams.get('tag_filter')}` : ''}`,
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        >{item?.label}</Typography>)
                                }
                            </Box>
                        }
                    </Box>
                </Box>
            </Stack>
        </ClickAwayListener>
    )
}

export default Index;