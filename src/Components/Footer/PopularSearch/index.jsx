import React, {memo} from 'react';
import "./styles.scss";
import { Stack, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import titleImage from "../../../Assets/skeleton/home/title4.svg";
import Loader from "../../../Assets/skeleton/home/testimonial/loader1.svg";

const Index = ({ footerData, headerLoader }) => {
    const location = useLocation();
    const emptyData = ['','','','','','','','','','','','','','','','','','','','','','','','','','','',''];
    const data = (
        headerLoader ?
            <Stack className="popular-section skeleton">
                <Typography className='popular-search-title'>
                    <img src={titleImage} className="whychoose-image-hover" alt="" />
                </Typography>
                <Stack className='popular-search-list'>
                    {emptyData?.map((item, ind) => {
                        return (
                            <Box className='content-section' key={ind}>
                                <img src={Loader} className="whychoose-image-hover" alt="" />
                            </Box>
                        )
                    })}
                </Stack>

            </Stack>
            :
            <Stack className="popular-section">
                <Typography className='popular-search-title'>{footerData?.search_terms?.title}</Typography>
                <Stack className='popular-search-list'>
                    {footerData?.search_terms?.search_data_item?.map((item, ind) => {
                        return (
                            <Box className='content-section' key={ind}>
                                <Link
                                    className='content'
                                    state={{
                                        from: {
                                            isSearchResult: true,
                                            value: item?.query_text
                                        }
                                    }}
                                    to={`/search/keyword=${item?.query_text}`}
                                >{item?.query_text}</Link>
                            </Box>
                        )
                    })}
                </Stack>

            </Stack>
    )
    return (
        <Stack className={`${location?.pathname?.slice(1) === "checkout" ? 'popular-search-section checkout_popular_search_section' : 'popular-search-section'}`}>
            <Stack className='container'>
                {data}
            </Stack>
        </Stack>
    )
}

export default memo(Index);
