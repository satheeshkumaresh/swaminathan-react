import React, {memo} from "react";
import "./styles.scss";
import { Box, Stack, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACTION_UPDATEFILTER, ACTION_SEARCHFILTERPARAMS } from "../../../Store/action";
import { formatCurrency } from "../../../Utilities/Utilities";

const Index = ({
    suggestionsData, message, value, setShowSuggestion,
    setSuggestionsData, setValue
}) => {
    const dispatch = useDispatch();

    return (
        <>
            {
                suggestionsData?.products?.length || message ?
                    <Stack className="searchsuggestion">
                        {
                            suggestionsData?.products?.length ?
                                <Stack className="section">
                                    {
                                        suggestionsData?.products?.slice?.(0, 5)?.map((item, ind) => {
                                            return (
                                                <Stack className="block" key={ind}>
                                                    <Stack className="image-section">
                                                        <Link to={`/${item?.product_url}`} onClick={() => setShowSuggestion(false)} >
                                                            <img src={item?.image} alt="Recent Search" />
                                                        </Link>
                                                    </Stack>
                                                    <Stack className="info-section">
                                                        <Link to={`/${item?.product_url}`} onClick={() => setShowSuggestion(false)} >
                                                            <Typography className="title">{item?.name}</Typography>
                                                        </Link>
                                                        {
                                                            item?.starting_from_price || item?.starting_to_price ?
                                                                <Stack className='price_block grouped_price amount'>
                                                                    <Typography className='label'>From</Typography>
                                                                    <Stack className='grouped-price-section amount'>
                                                                        {
                                                                            item?.starting_from_price ?
                                                                                <Typography className='special-price sale-price'>{formatCurrency?.format(item?.starting_from_price)}</Typography>
                                                                                : ''
                                                                        }
                                                                        {
                                                                            item?.starting_to_price ?
                                                                                <>
                                                                                    <Typography className='special-price sale-price symbol'> - </Typography>
                                                                                    <Typography className='special-price sale-price'>{formatCurrency?.format(item?.starting_to_price)}</Typography>
                                                                                </>
                                                                                : ''
                                                                        }
                                                                    </Stack>
                                                                </Stack>
                                                                :
                                                                <Stack className='price_block amount'>
                                                                    {
                                                                        item?.special_price ?
                                                                            <Stack className='price_block amount'>
                                                                                {
                                                                                    item?.special_price ?
                                                                                        <Typography className='special-price sale-price'>{formatCurrency?.format(item?.special_price)}</Typography>
                                                                                        : ''
                                                                                }
                                                                                {
                                                                                    item?.price ?
                                                                                        <Typography className='price'>{formatCurrency?.format(item?.price)}</Typography>
                                                                                        : ''
                                                                                }
                                                                            </Stack>
                                                                            :
                                                                            item?.price ?
                                                                                <Stack className='price_block'>
                                                                                    <Typography className='special-price'>{formatCurrency?.format(item?.price)}</Typography>
                                                                                </Stack>
                                                                                : ''
                                                                    }
                                                                </Stack>
                                                        }
                                                        {
                                                            item?.tags?.new_arrival ? <Typography className="search-new-arrival">{item?.tags?.new_arrival}</Typography> : ''
                                                        }
                                                        {
                                                            item?.tags?.on_offer ? <Typography className="search-on-offer">{item?.tags?.on_offer}</Typography> : ''
                                                        }
                                                    </Stack>
                                                </Stack>
                                            )
                                        })
                                    }
                                    <Stack className="view-products">
                                        <Box className="view">
                                            <Link
                                                state={{
                                                    from: {
                                                        isSearchResult: true,
                                                        value: value
                                                    }
                                                }}
                                                to={`search/keyword=${value}`}
                                                onClick={() => {
                                                    setShowSuggestion(false)
                                                    dispatch(ACTION_SEARCHFILTERPARAMS({
                                                        keyword: value,
                                                        min_price: 0,
                                                        max_price: "",
                                                        sort_order: "",
                                                        page: 0,
                                                        size: 0,
                                                        show_page: 15,
                                                        filterable_category_id: ""
                                                    }))
                                                    setSuggestionsData({})
                                                    setValue("")
                                                    dispatch(ACTION_UPDATEFILTER())
                                                }}
                                            >View All ({suggestionsData?.item_count}) Products</Link>
                                        </Box>
                                        <Box className="arrow">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15.45" height="9.046" viewBox="0 0 15.45 9.046">
                                                <g id="arrow-down" transform="translate(29.19 28.197) rotate(-90)">
                                                    <g id="Group_3103" data-name="Group 3103" transform="translate(20 -28.59)">
                                                        <g id="Group_3102" data-name="Group 3102" transform="translate(0 0)">
                                                            <path id="Path_11712" data-name="Path 11712" d="M48,30.25V16" transform="translate(-44.326 -16)" fill="none" stroke="#641233" strokeLinecap="round" strokeWidth="1.2" />
                                                            <path id="Path_11713" data-name="Path 11713" d="M20,52l3.674,3.674L27.349,52" transform="translate(-20 -41.425)" fill="none" stroke="#641233" strokeLinecap="round" strokeWidth="1.2" />
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </Box>
                                    </Stack>
                                </Stack>
                                : ''
                        }
                        {
                            message ?
                                <Stack className="searchsuggestion-empty-section">
                                    {message ? <Typography className="empty-product-msg">{message}</Typography> : ""}
                                </Stack>
                                : ""
                        }
                    </Stack>
                    : ""
            }
        </>

    )
}

export default memo(Index);