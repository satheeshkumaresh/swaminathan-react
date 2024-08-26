import React, {memo} from 'react';
import "./styles.scss";
import Sidebar from './Sidebar';
import ProductCollections from './ProductCollections';
import { Stack } from '@mui/system';

const Index = () => {
  return (
    <Stack className="home-product-block">
      <div className="container sidebar-product-common">
        <Sidebar className='sidbars' />
        <ProductCollections />
      </div>
    </Stack>
  )
}

export default memo(Index);
