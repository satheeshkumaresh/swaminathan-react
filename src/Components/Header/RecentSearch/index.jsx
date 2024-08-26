import React, {memo} from 'react';
import "./styles.scss";
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ACTION_SEARCHFILTERPARAMS } from "../../../Store/action";

const Index = ({ setValue, setSuggestionsData, setShowSuggestion }) => {
    const dispatch = useDispatch();
    const { recentSearchData } = useSelector(state => {
        return {
            recentSearchData: state?.recentSearchData
        }
    })
    const filteredsearchdata = [...new Set(recentSearchData)];
    return (
        <Stack className="recentsearch">
            <Stack className="section">
                <Stack className='search-title'>
                    <Stack className='icon'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15.132" height="15.131" viewBox="0 0 15.132 15.131">
                            <path id="time" d="M9.7,17.131a7.566,7.566,0,1,1,7.566-7.566A7.574,7.574,0,0,1,9.7,17.131ZM9.7,3.21a6.355,6.355,0,1,0,6.355,6.355A6.362,6.362,0,0,0,9.7,3.21Zm-.048,6.912H5.769a.605.605,0,0,1,0-1.21H9.05V4.421a.605.605,0,1,1,1.21,0v5.1A.605.605,0,0,1,9.655,10.122Z" transform="translate(-2.138 -2)" fill="#2b2525" />
                        </svg>
                    </Stack>
                    <Stack className='title'>Recent searches</Stack>
                </Stack>
                {
                    filteredsearchdata?.map((item, ind) => {
                        return (
                            <Stack className="block" key={ind}>
                                <Stack className='search'>
                                    <Stack className='search-icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7.65" height="7.65" viewBox="0 0 7.65 7.65">
                                            <path id="arrow_1_" data-name="arrow (1)" d="M4.093,11.557a.319.319,0,0,0,.451,0l6.468-6.468V7.506a.319.319,0,1,0,.637,0V4.319A.319.319,0,0,0,11.331,4H8.143a.319.319,0,0,0,0,.637h2.418L4.093,11.105a.32.32,0,0,0,0,.451Z" transform="translate(-3.999 -4)" fill="#2b2525" />
                                        </svg>
                                    </Stack>
                                    <Stack className='search-name'>
                                        <Link
                                            to={`/search/keyword=${item}`}
                                            state={{
                                                from: {
                                                    isSearchResult: true,
                                                    value: item
                                                }
                                            }}
                                            onClick={() => {
                                                setSuggestionsData({})
                                                setValue("")
                                                setShowSuggestion(false)
                                                dispatch(ACTION_SEARCHFILTERPARAMS({
                                                    keyword: item,
                                                    min_price: 0,
                                                    max_price: "",
                                                    sort_order: "",
                                                    page: 0,
                                                    show_page: "",
                                                    category_id: ""
                                                }))
                                            }}
                                        >{item}</Link>
                                    </Stack>
                                </Stack>
                            </Stack>
                        )
                    })
                }

            </Stack>
        </Stack>
    )
}

export default memo(Index);