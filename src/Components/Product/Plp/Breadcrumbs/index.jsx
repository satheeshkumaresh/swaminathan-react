import { Box, Stack } from '@mui/material';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_PLPFILTERPARAMS, ACTION_UPDATEFILTER } from "../../../../Store/action";

const Index = ({ data }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { productlistData, isSearchResult } = useSelector(state => {
    return {
      productlistData: state?.productListData?.[0]?.data?.[0],
      isSearchResult: state?.isSearchResult
    }
  })
  return (
    <Stack className="plp_breadcrumbs">
      <Stack className="page_breadcrumbs">
        <Stack className="breadcrumb_block">
          <Stack className='item home'>
            <Link className='text_secondary' to='/'>Home</Link>
            {
              data?.length ? <Box className="divider">/</Box> : ""
            }
          </Stack>
          {
            location?.state?.from?.isSearchResult || isSearchResult ?
              <Stack className='item home'>
                <Box className="divider">/</Box>
                <Link className='text_secondary active' to='/'>Search Results for: {productlistData?.searched_keyword}</Link>
              </Stack>
              :
              data?.map((elem, ind) => {
                return (
                  <Stack className='item' key={ind}>
                    <Link
                      className={`text_secondary ${data?.length == ind + 1 ? 'active' : ''}`}
                      to={`/${elem?.link}`}
                      onClick={() => {
                        dispatch(ACTION_PLPFILTERPARAMS({
                          url_key: elem?.link,
                          min_price: "",
                          max_price: "",
                          sort_order: 0,
                          page: 0,
                          size: 0,
                          name: 1,
                          show_page: 0,
                          filterable_category_id: ""
                        }))
                        dispatch(ACTION_UPDATEFILTER())
                      }}
                    >{elem?.label}</Link>
                    {
                      data?.length !== ind + 1 ? <Box className="divider">/</Box> : ""
                    }
                  </Stack>)
              })
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Index;