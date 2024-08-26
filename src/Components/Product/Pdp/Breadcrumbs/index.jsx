import { Box, Stack } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const Index = ({ data, productName }) => {
  return (
    <Stack className="pdp_breadcrumbs">
      <Stack className="page_breadcrumbs">
        <Stack className="breadcrumb_block">
          <Stack className='item home'>
            <Link className='text_secondary' to='/'>Home</Link>
            {
              data?.length ? <Box className="divider">/</Box> : ""
            }
          </Stack>
          {
            data?.map((elem, ind) => {
              return (
                <Stack className='item' key={ind}>
                  <Link 
                  className="text_secondary" 
                  to={`/${elem?.link}`}>{elem?.label}</Link>
                  <Box className="divider">/</Box>
                </Stack>)
            })
          }
          {
            !data?.length?<Box className="divider">/</Box>:""
          }
          <Link className='text_secondary active' to='/'>{productName}</Link>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Index;