import { Stack, Typography } from '@mui/material';
import React from 'react'
import "./styles.scss";
import ProductTitleBlock from '../../ProductTitleBlock';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../Utilities/Utilities';

const Index = ({ cross_sell_data }) => {

  return (
    <Stack className='cart-additional-product-section'>
      <Stack className='block'>
        <Stack className='producttitleblock'>
          <ProductTitleBlock title="You May Also Like" fromTitle="other"/>
        </Stack>
        <Stack className='product-content-block'>
          {
            cross_sell_data?.map((item, ind) => {
              return (
                <Stack className='content' key={ind}>
                  <Stack className='section'>
                    <Stack className='image-sec'>
                      <Link className='product-image' to={`/${item?.product_url}`}>
                        <img src={item?.image} alt="image" />
                      </Link>
                    </Stack>
                    <Stack className='info-sec'>
                      <Link className='product-name' to={`/${item?.product_url}`}>{item?.name}</Link>
                      {/* price start*/}
                      {
                        item?.starting_from_price || item?.starting_to_price ?
                          <Stack className='price_block grouped_price'>
                            <Typography className='label'>From</Typography>
                            <Stack className='grouped-price-section'>
                              {
                                item?.starting_from_price ?
                                  <Typography className='special-price'>{formatCurrency?.format(item?.starting_from_price)}</Typography>
                                  : ''
                              }
                              {
                                item?.starting_to_price ?
                                  <>
                                    <Typography className='special-price symbol'> - </Typography>
                                    <Typography className='special-price'>{formatCurrency?.format(item?.starting_to_price)}</Typography>
                                  </>
                                  : ''
                              }
                            </Stack>
                          </Stack>
                          :
                          <Stack className='price_block'>
                            {
                              item?.special_price ?
                                <Stack className='price_block'>
                                  {
                                    item?.special_price ?
                                      <Typography className='special-price'>{formatCurrency?.format(item?.special_price)}</Typography>
                                      : ''
                                  }
                                  {
                                    item?.price ?
                                      <Typography className='price'>{formatCurrency?.format(item?.price)}</Typography>
                                      : ''
                                  }
                                </Stack>
                                :
                                item?.price ?
                                  <Stack className='price_block'>
                                    <Typography className='special-price'>{formatCurrency?.format(item?.price)}</Typography>
                                  </Stack>
                                  : ''
                            }
                          </Stack>
                      }
                    </Stack>
                  </Stack>
                </Stack>
              )
            })
          }
        </Stack>
      </Stack>
    </Stack>

  )
}

export default Index;