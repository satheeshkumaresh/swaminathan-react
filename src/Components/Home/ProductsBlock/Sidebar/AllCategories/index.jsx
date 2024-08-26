import React, {memo} from 'react';
import "./styles.scss";
import { Link } from 'react-router-dom';
import { Typography, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_PLPFILTERPARAMS, ACTION_UPDATEFILTER } from "../../../../../Store/action";
import categoryItems from "../../../../../Assets/skeleton/home/categoryItems.svg";

const Index = () => {
  const dispatch = useDispatch();
  const { categories, homeApiLoader } = useSelector(state => {
    return {
      categories: state?.homepage?.[0]?.categories,
      homeApiLoader: state?.homeApiLoader
    }
  })
  return (
    <Stack className='sidebar-categories-section'>
      {
        homeApiLoader ?
          <Stack className='allcatgory-section allcatgory_section_skeleton'>
            <Typography className='all-category-title'>
              <img src={categoryItems} alt='Title' />
            </Typography>
          </Stack>
          :
          <Stack className='allcatgory-section'>
            <Typography className='all-category-title'>All Categories</Typography>
            <Stack className='category-list'>
              {categories?.root?.level1?.map((item, index) => {
                return (
                  <Stack className='link-list' key={index}>
                    <Link
                      className='menu-text'
                      to={item?.request_path}
                    >{item?.name}
                      {
                        item?.level2?.length ?
                          <KeyboardArrowRightIcon />
                          : ""
                      }
                    </Link>
                    {
                      item?.level2?.length ?
                        <Stack className='subcategory-img-section'>
                          <Stack className='subcategory'>
                            {item?.level2?.map((elem, ind) => {
                              return (
                                <Link key={ind}
                                  className='menu-text'
                                  to={elem?.request_path}
                                >{elem?.name}</Link>
                              )
                            })}
                          </Stack>
                          <Stack className='subcategory-img'>
                            {
                              item?.image ?
                                <Link
                                  className='menu-text'
                                  to={item?.request_path}
                                  onClick={() => {
                                    dispatch(ACTION_PLPFILTERPARAMS({
                                      url_key: item?.request_path,
                                      min_price: "",
                                      max_price: "",
                                      sort_order: "",
                                      page: 0,
                                      size: 0,
                                      show_page: 15,
                                      filterable_category_id: ""
                                    }))
                                    dispatch(ACTION_UPDATEFILTER())
                                  }}
                                >
                                  <img src={item?.image} alt={item?.name} loading="lazy"/>
                                </Link> : ''
                            }
                          </Stack>
                        </Stack>
                        : ''
                    }
                  </Stack>
                )
              })}
            </Stack>
          </Stack>
      }
    </Stack>
  )
}

export default memo(Index);
