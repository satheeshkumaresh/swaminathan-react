import React, { useEffect } from 'react';
import "./styles.scss";
import { Stack, Typography, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Table from "../../../Table";
import { formatCurrency } from "../../../../Utilities/Utilities";
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_CARTDATA_ADDRESS } from "../../../../Store/action";

const Index = ({
  estimateShippingData, setShippingInformtionData, setSelectedShippingMethod,
  shippingFormValues, getShippingBillingAddres, setIsShippingAddressChnaged
}) => {
  const dispatch = useDispatch();
  const { cartDataAddress } = useSelector(state => {
    return {
      cartDataAddress: state?.cartDataAddress,
    }
  })
  useEffect(() => {
    if (!cartDataAddress?.shippingMethod?.carrier_code || cartDataAddress?.shippingMethod?.carrier_code == undefined) {
      dispatch(ACTION_CARTDATA_ADDRESS({
        address: {
          countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
          display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
          postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
          region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
          region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
        },
        shippingMethod: {
          amount: estimateShippingData?.[0]?.amount,
          method_title: estimateShippingData?.[0]?.method_title,
          carrier_title: estimateShippingData?.[0]?.carrier_title,
          carrier_code: estimateShippingData?.[0]?.carrier_code,
          method_code: estimateShippingData?.[0]?.method_code,
        }
      }))
    }
  }, [estimateShippingData]);
  useEffect(() => {
    if (cartDataAddress?.shippingMethod?.carrier_code) {
      setShippingInformtionData((prevState) => ({
        ...prevState,
        shipping_method_code: cartDataAddress?.shippingMethod?.method_code,
        shipping_carrier_code: cartDataAddress?.shippingMethod?.carrier_code
      }));
    }
  }, [cartDataAddress]);
  const columns = [
    {
      name: "amount",
      label: false,
      options: {
        customHeadRender: () => null,
        customBodyRender: (value, data) => {
          return (
            <div className='checkout-price-box-section edit-section-cart'>

              <FormControl>
                <RadioGroup
                  className='product-item'
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    className='sub-title'
                    control={<Radio />}
                    value={data?.rowData?.[3]}
                    onClick={() => {
                      setIsShippingAddressChnaged(false)
                      dispatch(ACTION_CARTDATA_ADDRESS({
                        address: {
                          countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
                          display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
                          postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
                          region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
                          region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
                        },
                        shippingMethod: {
                          amount: data?.rowData?.[0],
                          method_title: data?.rowData?.[1],
                          carrier_title: data?.rowData?.[2],
                          carrier_code: data?.rowData?.[3],
                          method_code: data?.rowData?.[4],
                        }
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          countryId: shippingFormValues?.country,
                          regionId: shippingFormValues?.state ? shippingFormValues?.state : null,
                          regionCode: shippingFormValues?.state ? shippingFormValues.state : null,
                          region: shippingFormValues?.display_state,
                          street: [
                            shippingFormValues?.address1,
                            shippingFormValues?.address2 ? shippingFormValues?.address2 : '',
                          ],
                          company: shippingFormValues?.company,
                          telephone: shippingFormValues?.number,
                          postcode: shippingFormValues?.zip_code,
                          city: shippingFormValues?.city,
                          firstname: shippingFormValues?.first_name,
                          lastname: shippingFormValues?.last_name,
                          email: shippingFormValues.email,
                          same_as_billing: (getShippingBillingAddres?.data?.billing_address?.firstname && getShippingBillingAddres?.data?.billing_address?.firstname !== null) ? 0 : 1,
                          save_in_address_book: shippingFormValues.save_in_address_book
                        },
                        shipping_method_code: data?.rowData?.[4],
                        shipping_carrier_code: data?.rowData?.[3],
                      }))
                    }}
                    checked={cartDataAddress?.shippingMethod?.carrier_code == data?.rowData?.[3] ? true : false}
                  />

                </RadioGroup>
              </FormControl>


              <div className="sub-total-desktop">{formatCurrency?.format(value)}</div>
            </div>
          );
        },
      },
    },
    {
      name: "method_title",
      label: false,
      options: {
        customHeadRender: () => null,
        customBodyRender: (value) => {
          return <div className="sub-total-desktop">{value}</div>;
        },
      },
    },
    {
      name: "carrier_title",
      label: false,
      options: {
        customHeadRender: () => null,
        customBodyRender: (value) => {
          return <div className="sub-total-desktop">{value}</div>;
        },
      },
    },
    {
      name: "carrier_code",
      label: false,
      options: {
        display: false
      }
    },
    {
      name: "method_code",
      label: false,
      options: {
        display: false
      }
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
    textLabels: {
      body: {
        noMatch: 'Please enter the shipping address to view the shipping methods.',
      }
    }
  };
  return (
    <Stack className="shipping-method-table-section">
      <Stack className='shipping-method-section'>
        <Typography className='shipping-title' variant='h4'>Shipping Method</Typography>
      </Stack>

      <Table
        className={"shipping-method-table-section"}
        columns={columns}
        data={estimateShippingData}
        options={options}
      />

    </Stack>
  )
}

export default Index;