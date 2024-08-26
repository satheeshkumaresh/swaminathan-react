import React, {memo} from 'react';
import "./styles.scss";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { Typography, Stack } from '@mui/material';
import ProductTitleBlock from '../../../../ProductTitleBlock';
import BorderImage from '../../../../../Assets/product/CategoryProduct/Border.png';
import { useSelector } from 'react-redux';
import titleProducts from '../../../../../Assets/skeleton/home/titleProducts.svg';
import title4 from '../../../../../Assets/skeleton/home/title4.svg';

const Index = ({ title, btn_name, btn_link, data }) => {
  const { homeApiLoader } = useSelector(state => {
    return {
      homeApiLoader: state?.homeApiLoader
    }
  })
  let dragging = false;
  const settings = {
    speed: 500,
    slidesPerRow: 2,
    slidesToShow: 1,
    rows: 2,
    beforeChange: () => dragging = true,
    afterChange: () => dragging = false,
  };
  const titlesData = (
    homeApiLoader ?
      ['', '', '', '']?.map((item, index) => {
        return (
          <Stack className={`new-category-product-grid grid${index + 1}-child`} key={index}>
            <Stack className="new-category-product">
              <Stack className='product-grid'>
                <Link
                  className='image-link'
                  to=''
                >
                  <img src={BorderImage} className='category-product-img' alt='' />
                </Link>
                <Link className='product-img-link' to=''>
                  <img src={titleProducts} className='category-product-img' alt='' />
                </Link>
              </Stack>
              <Link className='all-category-title' to=''>
                <Typography className='all-category-title'>
                  <img src={title4} className='category-product-img' alt='' />
                </Typography>
              </Link>
            </Stack>
          </Stack>
        )
      })
      :
      data?.products?.map((item, index) => {
        return (
          <Stack className={`new-category-product-grid grid${index + 1}-child`} key={index}>
            <Stack className="new-category-product">
              <Stack className='product-grid'>
                <Link
                  className='image-link'
                  to={`/${item?.url}`}
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  <img src={BorderImage} className='category-product-img' alt={item?.name} loading="lazy"/>
                </Link>
                <Link
                  className='product-img-link'
                  to={`/${item?.url}`}
                  onClick={(e) => dragging && e.preventDefault()}
                >
                  <img src={item?.image} className='category-product-img' alt={item?.name} loading="lazy"/>
                </Link>
              </Stack>
              <Link
                className='all-category-title'
                to={`/${item?.url}`}
                onClick={(e) => dragging && e.preventDefault()}
              >
                <Typography className='all-category-title'>{item?.name} </Typography>
              </Link>
            </Stack>
          </Stack>
        )
      })
  )
  return (
    <>
      <Stack className="new-category-product-grid-section">
        <ProductTitleBlock
          title={title}
          btn_name={btn_name}
          btn_link={btn_link}
        />
        <Slider className='new-arrival-section' {...settings}>
          {
            titlesData
          }
        </Slider>
      </Stack>
    </>
  )
}

export default memo(Index);
