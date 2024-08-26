import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { ACTION_MYACCOUNTCURRENTPAGE, viewOrder } from "../../APIList";
import Table from "../../../../../Components/Table";
import { TableFooter, TableRow } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, getDataFormat } from "../../../../../Utilities/Utilities";
import { url } from "../../../../../Utilities/Constant";

const Index = ({ setViewOrderLoader }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      actionmessage: state?.actionmessage
    }
  })
  const [viewOrderData, setViewOrderData] = useState({})

  const printOrderHandler = (EVENT) => {
    // Open the PDF URL in a new window
    const win = window.open(`${url}printorder/index/printpdf?order_id=${viewOrderData?.order_details?.id}`, '_blank');
    // Wait for the PDF to load before printing
    win.onload = () => {
      win.print();
    };
  }

  useEffect(() => {
    viewOrder(token, dispatch, location?.state, setViewOrderData, setViewOrderLoader, actionmessage?.isSesstionTimeOut)
  }, [])
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("View Order"))
  }, [])

  const columns = [
    {
      name: "Product_name",
      label: "Product Name",
      options: {
        customBodyRender: (value, data) => {
          const values = data?.rowData;
          return (
            <Stack className="product-name-sec">
              <Stack className="product-image">
                <Stack className="img_block">
                  <img src={values?.[7]} alt="" />
                </Stack>
              </Stack>
              <Stack className="product_item_info_section">
                <Typography className='product-name'>{values?.[0]}</Typography>
                {
                  values?.[4] ?
                    <Stack className='product-color'>
                      <Box className='data'>Color: </Box>
                      <Box className='value'>{values?.[4]}</Box>
                    </Stack> : ''
                }
                {
                  values?.[5] ?
                    <Stack className='product-size'>
                      <Box className='data'>Weight (Kg): </Box>
                      <Box className='value'>{values?.[5]}</Box>
                    </Stack>
                    : ''
                }
              </Stack>
              <Stack className='mobile-productdetail'>
                <Stack className='mobile-view product-color'>
                  <Box className='productcolor'>Color: </Box>
                  <Box className='value'>{values?.[4]}</Box>
                </Stack>
                <Stack className='mobile-view '>
                  <Box className='productsize'>Weight (Kg): </Box>
                  <Box className='value'>{values?.[5]}</Box>
                </Stack>
                <Stack className='mobile-view sku-sec'>
                  <Box className='sku'>SKU: </Box>
                  <Box className='sku-value'>{values?.[1]}</Box>
                </Stack>
                <Stack className='mobile-view price-sec'>
                  <Box className='price'>Price:</Box>
                  <Box className='offer-price'>{formatCurrency?.format(values?.[2])}</Box>
                </Stack>
                <Stack className='mobile-view qty-sec'>
                  <Box className='qty'>Qty:</Box>
                  <Box className='qty-value'>{values?.[3]}</Box>
                </Stack>
                <Stack className='mobile-view subtotal-sec'>
                  <Box className='subtotal'>Subtotal:</Box>
                  <Box className='subtotal-value'>{formatCurrency?.format(values?.[6])}</Box>
                </Stack>
              </Stack>
            </Stack>
          );
        },
      },
    },
    {
      name: "Sku",
      label: "SKU",
    },
    {
      name: "price",
      label: "Price",
      options: {
        customBodyRender: (value, data) => {
          return (
            value ? <Typography className='price'>{formatCurrency?.format(value)}</Typography> : ''
          );
        },
      },
    },
    {
      name: "qty",
      label: "Qty",
    },
    {
      name: "color",
      label: "",
      options: {
        display: false
      }
    },
    {
      name: "weight_in_kg",
      label: "",
      options: {
        display: false
      }
    },
    {
      name: "row_total",
      label: "Subtotal",
      options: {
        customBodyRender: (value, data) => {
          return (
            value ? <Typography className='price'>{formatCurrency?.format(value)}</Typography> : ''
          );
        },
      },
    },
    {
      name: "image",
      label: "image",
      options: {
        display: false
      },
    }

  ];


  const options = {
    filter: false,
    filterType: "textField",
    responsive: "vertical",
    pagination: false,
    selectableRows: false,
    download: false,
    print: false,
    sort: false,
    viewColumns: false,
    search: false,
  };

  return (
    <>
      <Stack className="orderdetail-page">
        <Box className='title-printorder-sec'>
          <Stack className="header page-title" >ORDER # {viewOrderData?.order_details?.increment_id}</Stack>
          <Stack className='track__print__block'>
            {
              viewOrderData?.order_details?.DTDC || viewOrderData?.order_details?.professional ?
                <Stack className='print'>
                  <small onClick={() => window.open(viewOrderData?.order_details?.DTDC ? viewOrderData?.order_details?.DTDC : viewOrderData?.order_details?.professional, '_blank')}>Track Order</small>
                </Stack>
                : <></>
            }
            <Stack className='print'>
              <small onClick={(EVENT) => printOrderHandler(EVENT)}>Print Order</small>
            </Stack>
          </Stack>
        </Box>
        <Stack className='orderdetail-sec'>
          <Stack className='order-status'>
            <Stack className='date-status'>
              <Stack className='date'>
                <Typography variant='h4'>Order Date:</Typography>
                <Typography><small>{getDataFormat(viewOrderData?.order_details?.Date)}</small></Typography>
              </Stack>
              <Stack className='status'>
                <Typography variant='h4'>Status:</Typography>
                <Typography><small>{viewOrderData?.order_details?.status}</small></Typography>
              </Stack>
            </Stack>

          </Stack>
          <Stack className='item-table'>
            <Stack className='items-ordered'>
              <Typography variant='h4'>Items Ordered</Typography>
            </Stack>
            <Stack className='table-sec'>
              <Table
                columns={columns}
                data={viewOrderData?.product}
                options={options}
              />
              <TableFooter>
                <Stack className='table-footer'>
                  <Stack className='right'>
                    <TableRow>
                      <Box className='total'>Subtotal</Box>
                      <Typography variant='span'>{formatCurrency?.format(viewOrderData?.total_amount?.display_subTotal)}</Typography>
                    </TableRow>
                    <TableRow>
                      <Box className='total'>Tax</Box>
                      <Typography variant='span'>{formatCurrency?.format(viewOrderData?.total_amount?.display_tax)}</Typography>
                    </TableRow>
                    <TableRow>
                      <Box className='total'>Shipping</Box>
                      <Typography variant='span'>{formatCurrency?.format(viewOrderData?.total_amount?.display_shipping)}</Typography>
                    </TableRow>
                    <TableRow>
                      <Box className='total'>Discount</Box>
                      <Typography variant='span'>{formatCurrency?.format(viewOrderData?.total_amount?.display_discount_amount)}</Typography>
                    </TableRow>
                    <TableRow>
                      <Box className='total grand'>Grand Total</Box>
                      <Typography variant='span' className='grand-total'>{formatCurrency?.format(viewOrderData?.total_amount?.display_grandTotal)}</Typography>
                    </TableRow>
                  </Stack>
                </Stack>
              </TableFooter>
            </Stack>
          </Stack>
        </Stack>
        <Stack className="main_block">
          <Stack className='order-details'>
            <Typography variant='h4' className='order-info'>Order Information</Typography>
            <Stack className='billing-shipping'>
              <Box className='shipping'>
                <Stack className='shipping-address'>
                  <Typography variant='h4'>SHIPPING ADDRESS</Typography>
                  <Box className='info-address'>
                    {
                      viewOrderData?.shipping_address?.firstname ?
                        <Typography>{viewOrderData?.shipping_address?.firstname} {viewOrderData?.shipping_address?.lastname},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.shipping_address?.shippingstreet?.[0] ?
                        <Typography>{viewOrderData?.shipping_address?.shippingstreet?.[0]}{viewOrderData?.shipping_address?.shippingstreet?.[1] ? ',' : ''}</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.shipping_address?.shippingstreet?.[1] ?
                        <Typography>{viewOrderData?.shipping_address?.shippingstreet?.[1]},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.shipping_address?.shippingcity || viewOrderData?.shipping_address?.shippingpostcode ?
                        <Typography>
                          {viewOrderData?.shipping_address?.shippingcity} {viewOrderData?.shipping_address?.shippingpostcode},
                        </Typography>
                        : ''
                    }
                    {
                      viewOrderData?.shipping_address?.region ?
                        <Typography>{viewOrderData?.shipping_address?.region},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.shipping_address?.country_name ?
                        <Typography>{viewOrderData?.shipping_address?.country_name}.</Typography>
                        : ''
                    }
                  </Box>
                </Stack>

                <Stack className='shipping-method'>
                  <Typography variant='h4'>Shipping Method</Typography>
                  <Box className='edit'><small>{viewOrderData?.method?.shippingMethod}</small></Box>
                </Stack>

              </Box>
              <Box className='billing'>
                <Stack className='billing-address'>
                  <Typography variant='h4'>BILLING ADDRESS</Typography>
                  <Box className='info-address'>
                    {
                      viewOrderData?.billing_address?.firstname ?
                        <Typography>{viewOrderData?.billing_address?.firstname} {viewOrderData?.billing_address?.lastname},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.billing_address?.billingstreet?.[0] ?
                        <Typography>{viewOrderData?.billing_address?.billingstreet?.[0]}{viewOrderData?.billing_address?.billingstreet?.[1] ? ',' : ''}</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.billing_address?.billingstreet?.[1] ?
                        <Typography>{viewOrderData?.billing_address?.billingstreet?.[1]},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.billing_address?.billingcity || viewOrderData?.billing_address?.billingpostcode ?
                        <Typography>
                          {viewOrderData?.billing_address?.billingcity} {viewOrderData?.billing_address?.billingpostcode},
                        </Typography>
                        : ''
                    }
                    {
                      viewOrderData?.billing_address?.region ?
                        <Typography>{viewOrderData?.billing_address?.region},</Typography>
                        : ''
                    }
                    {
                      viewOrderData?.billing_address?.country_name ?
                        <Typography>{viewOrderData?.billing_address?.country_name}.</Typography>
                        : ''
                    }
                  </Box>
                </Stack>

                <Stack className='payment-method'>
                  <Typography variant='h4'>Payment Method</Typography>
                  {
                    viewOrderData?.payment_information?.info ?
                      <Box className='edit'><small>{viewOrderData?.payment_information?.info}</small></Box>
                      : ''
                  }
                </Stack>

              </Box>

            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack className='back-button'>
        <Button
          className='primary_default_btn'
          onClick={() => navigate(-1)}
        >Back</Button>
      </Stack>
    </>

  )
}

export default Index;