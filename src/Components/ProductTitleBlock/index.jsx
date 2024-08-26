import React from 'react';
import "./styles.scss";
import { Typography, Stack } from '@mui/material';
import ProductLinkBlock from '../ProductLinkBlock';
import { useSelector } from 'react-redux';
import titleImage from '../../Assets/skeleton/home/largeTitle.svg';

const Index = ({ title, btn_name, btn_link, fromTitle }) => {
  const { homeApiLoader } = useSelector(state => {
    return {
      homeApiLoader: state?.homeApiLoader
    }
  })
  return (
    <Stack className='product-title-block'>
      <Stack className={`product-title ${homeApiLoader && fromTitle === undefined ? 'skeleton_title' : ''}`}>
        {
          homeApiLoader && fromTitle === undefined ?
            <Typography className='title-section'>
              <img src={titleImage} alt='' />
            </Typography>
            :
            <Typography className='title-section'>{title}</Typography>
        }
        {
          btn_name && !homeApiLoader ? <ProductLinkBlock btn_name={btn_name} btn_link={btn_link} /> : ''
        }
      </Stack>
    </Stack>
  )
}

export default Index;
