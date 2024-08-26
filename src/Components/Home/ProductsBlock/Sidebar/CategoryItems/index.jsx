import React, {memo} from 'react';
import "./styles.scss";
import { Link } from 'react-router-dom';

import { Typography, Stack } from '@mui/material';
import ProductTitleBlock from '../../../../ProductTitleBlock';
import titleProducts from '../../../../../Assets/skeleton/home/titleProducts.svg';
import { useSelector } from 'react-redux';
import title4 from '../../../../../Assets/skeleton/home/title4.svg';

const Index = ({ title, btn_name, data }) => {
  const { homeApiLoader } = useSelector(state => {
    return {
      homeApiLoader: state?.homeApiLoader
    }
  })
  const titlesData = (
    homeApiLoader ?
      <Stack className="category-product-grid">
        {
          ['', '', '', '']?.map((item, index) => {
            return (
              <Stack className="category-product" key={index}>
                <Link className='image-link' to=''>
                  <img src={titleProducts} className='category-product-img' alt='' />
                </Link>
                <Link className='all-category-title' to=''>
                  <Typography className='all-category-title'>
                    <img src={title4} className='category-product-img' alt='' />
                  </Typography>
                </Link>
              </Stack>
            )
          })
        }
      </Stack>
      :
      <Stack className="category-product-grid">
        {
          data?.products?.map((item, index) => {
            return (
              <Stack className="category-product" key={index}>
                <Link className='image-link' to={`/${item?.url}`}>
                  <img src={item?.image} className='category-product-img' alt={item?.name} loading="lazy"/>
                </Link>
                <Link className='all-category-title' to={`/${item?.url}`}>
                  <Typography className='all-category-title'>{item?.name}</Typography>
                </Link>
              </Stack>
            )
          })
        }
        {
          data?.products?.length === 1 || data?.products?.length === 2 ? ["", ""]?.map((item, ind) => {
            return (
              <Stack className="category-product hidden-items" key={ind}>
                <Link className='image-link' to={`/${item?.url}`}>
                  <img src={data?.products?.[0]?.image} className='category-product-img' alt={item?.name} loading="lazy"/>
                </Link>
                <Link className='all-category-title' to={`/${item?.url}`}>
                  <Typography className='all-category-title'>{data?.products?.[0]?.name}</Typography>
                </Link>
              </Stack>
            )
          }) : ""
        }
      </Stack>
  )
  return (
    <Stack className="category-product-grid-section">
      <ProductTitleBlock
        title={title}
        btn_name={btn_name}
        btn_link={data?.see_more_url_key}
      />
      {
        titlesData
      }
    </Stack>
  )
}

export default memo(Index);
