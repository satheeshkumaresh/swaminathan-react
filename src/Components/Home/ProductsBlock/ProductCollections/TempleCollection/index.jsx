import React, {memo} from 'react';
import "./styles.scss";
import { Link } from 'react-router-dom';
import { Typography, Stack } from '@mui/material';
import ProductTitleBlock from '../../../../ProductTitleBlock';
import Slider from "react-slick";
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_PLPFILTERPARAMS, ACTION_UPDATEFILTER } from "../../../../../Store/action";
import templeProduct from '../../../../../Assets/skeleton/home/temple_collection.svg';
import title3 from '../../../../../Assets/skeleton/home/title3.svg';

const Index = () => {
  const dispatch = useDispatch();
  const { temple_collection, homeApiLoader } = useSelector(state => {
    return {
      temple_collection: state?.homepage?.[0]?.temple_collection,
      homeApiLoader: state?.homeApiLoader
    }
  })
  let dragging = false;
  const settings = {
    dots: false,
    infinite: temple_collection?.length > 6 ? true : false,
    speed: 500,
    initialSlide: 1,
    slidesToShow: 6,
    beforeChange: () => dragging = true,
    afterChange: () => dragging = false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          infinite: temple_collection?.length > 6 ? true : false,
          slidesToShow: 6,
          initialSlide: 1
        }
      },
      {
        breakpoint: 1440,
        settings: {
          infinite: temple_collection?.length > 6 ? true : false,
          slidesToShow: 6,
          initialSlide: 1
        }
      },
      {
        breakpoint: 1380,
        settings: {
          infinite: temple_collection?.length > 6 ? true : false,
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          infinite: temple_collection?.length > 5 ? true : false,
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 1260,
        settings: {
          infinite: temple_collection?.length > 4 ? true : false,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          infinite: temple_collection?.length > 5 ? true : false,
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 860,
        settings: {
          infinite: temple_collection?.length > 4 ? true : false,
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 767,
        settings: {
          infinite: temple_collection?.length > 3 ? true : false,
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 567,
        settings: {
          infinite: temple_collection?.length > 2 ? true : false,
          slidesToShow: 2,
        }
      }
    ]
  };
  const templeData = (
    homeApiLoader ?
      ['', '', '', '', '', '', '', '', '', '']?.map((item, index) => {
        return (
          <Stack className="category-product skeleton" key={index}>
            <Link
              className='image-link' to=""
            >
              <img src={templeProduct} className='category-product-img' alt="" />
            </Link>
            <Link className='all-category-title' to="">
              <Typography className='all-category-title'>
                <img src={title3} className='category-product-img' alt="" />
              </Typography>
            </Link>
          </Stack>
        )
      })
      :
      temple_collection?.map((item, index) => {
        return (
          <Stack className="category-product" key={index}>
            <Link
              className='image-link' to={item?.url}
              onClick={(e) => {
                dragging && e.preventDefault()
                dispatch(ACTION_PLPFILTERPARAMS({
                  url_key: item?.url
                }))
                dispatch(ACTION_UPDATEFILTER())
              }}
            >
              <img src={item?.image} className='category-product-img' alt={item?.name} loading="lazy"/>
            </Link>
            <Link
              className='all-category-title' to={item?.url}
              onClick={(e) => {
                dragging && e.preventDefault()
                dispatch(ACTION_PLPFILTERPARAMS({
                  url_key: item?.url
                }))
                dispatch(ACTION_UPDATEFILTER())
              }}
            >
              <Typography className='all-category-title'>{item?.name} </Typography>
            </Link>
          </Stack>
        )
      })
  )

  return (
    <Stack className="category-collection-block-section">
      <Stack className="collection-section">
        <ProductTitleBlock title="Temple Collection" />
        <Stack className="category-product-grid">
          <Slider {...settings}>
            {
              templeData
            }
          </Slider>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default memo(Index);
