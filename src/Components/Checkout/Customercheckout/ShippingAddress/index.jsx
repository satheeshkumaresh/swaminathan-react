import React, { useState, useEffect } from 'react';
import "./styles.scss";
import {
  Stack, Box,
  Typography, Button, FormControlLabel, FormGroup, Checkbox, TextField, Autocomplete
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MarkIcon from "../../../../Assets/Checkout/MarkAddress.svg";
import { isValidNumber, pressEnterCallFunction, isValidCharacter } from "../../../../Utilities/Utilities";
import { ACTION_CARTDATA_ADDRESS } from "../../../../Store/action";
import {customerEstimateShippingById} from "../APIList";
import Model from "../../../Model";
import { useDispatch, useSelector } from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";

const Index = ({
  shippingFormValues, setShippingFormValues, formErrorShipping, setFormErrorShipping,
  addNewAddressHandlerShipping, allAddress, getShippingBillingAddres, setEstimateShippingData,
  setEstimateShippingLoader, setShippingInformtionData, setUpdateShippingInformationById,
  updateShippingInformationById, setUpdateShippingMethod, updateShippingMethod, setEstimateShipping,
  shippingInformtionData, setIsValidShippingAddress, setIsShippingAddressChnaged
}) => {
  const dispatch = useDispatch();
  const { token, countries, states, cartDataAddress, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      countries: state?.countries,
      states: state?.states,
      cartDataAddress: state?.cartDataAddress,
      actionmessage: state?.actionmessage
    }
  })

  const [open, setOpen] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isMatchingWithAllAddress, setIsMatchingWithAllAddress] = useState(false);
  const [isPostCodeChanged, setIsPostCodeChanged] = useState(false);
  const closeNewEditAddresPopup = () => {
    setOpen(!setOpen)
    setIsEditAddress(false)
    setShippingFormValues((prevState) => ({
      ...prevState,
      first_name: getShippingBillingAddres?.data?.shipping_address?.firstname,
      last_name: getShippingBillingAddres?.data?.shipping_address?.lastname,
      address1: getShippingBillingAddres?.data?.shipping_address?.street?.[0],
      address2: getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : '',
      display_state: getShippingBillingAddres?.data?.shipping_address?.region,
      state: getShippingBillingAddres?.data?.shipping_address?.region_id,
      regionValues: {
        label: getShippingBillingAddres?.data?.shipping_address?.region,
        value: getShippingBillingAddres?.data?.shipping_address?.region_id,
      },
      city: getShippingBillingAddres?.data?.shipping_address?.city,
      zip_code: getShippingBillingAddres?.data?.shipping_address?.postcode,
      number: getShippingBillingAddres?.data?.shipping_address?.telephone,
      mobile_valid: getShippingBillingAddres?.data?.shipping_address?.telephone,
      display_country: getShippingBillingAddres?.data?.shipping_address?.country_name,
      country: getShippingBillingAddres?.data?.shipping_address?.country_id,
      DefaultShipping: "0",
      DefaultBilling: "0",
      save_in_address_book: getShippingBillingAddres?.data?.shipping_address?.save_in_address_book,
      customerAddressId: getShippingBillingAddres?.data?.shipping_address?.address_id,
      same_as_billing: "0"
    }))
    setFormErrorShipping((prevState) => ({
      ...prevState,
      first_name: "",
      last_name: "",
      address1: "",
      address2: "",
      display_country: "",
      country: "",
      display_state: "",
      state: "",
      city: "",
      zip_code: "",
      number: "",
    }))
  }
  useEffect(() => {
    const matchingAddress = getShippingBillingAddres?.data?.all_address?.filter((item) => item?.address_id == getShippingBillingAddres?.data?.shipping_address?.customer_address_id);
    if (matchingAddress?.length) {
      setIsMatchingWithAllAddress(true)
    } else {
      setIsMatchingWithAllAddress(false)
    }
  }, [getShippingBillingAddres]);

  // zipcode
  useEffect(() => {
    const zipCodeInput = document.getElementById('zip_code');
    const delayFn = setTimeout(() => {
      if (isPostCodeChanged) {
        setEstimateShipping((prevState) => ({
          ...prevState,
          postcode: shippingFormValues?.zip_code,
        }))
        dispatch(ACTION_CARTDATA_ADDRESS({
          address: {
            countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
            display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
            postcode: shippingFormValues?.zip_code,
            region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
            region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
          },
          shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
        }))
        if (shippingFormValues?.zip_code) {
          setUpdateShippingMethod(!updateShippingMethod)
        }
        zipCodeInput.blur();
        setIsPostCodeChanged(false)
      }
    }, 800);
    return () => clearTimeout(delayFn);
  }, [shippingFormValues?.zip_code, 350]);

  return (
    <Stack className='shipping-address-block'>
      <Stack className='shipping-address-section-form'>
        <Typography className='shipping-title' variant='h4'>Shipping Address</Typography>
      </Stack>
      {
        !getShippingBillingAddres?.data?.all_address?.length
          ?
          <Stack className='shipping-address-form-block-section'>
            <Stack className='form-block address-section-form'>
              <Box className='input-block-section fullwidth'>
                <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section'>
                  <TextField
                    className='input-text'
                    name='first_name'
                    id='first_name'
                    value={shippingFormValues?.first_name}
                    error={formErrorShipping?.first_name ? true : false}
                    onChange={(e) => {
                      setIsShippingAddressChnaged(true)
                      setIsValidShippingAddress(false)
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        first_name: e.target.value
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          firstname: e.target.value
                        }
                      }))
                      setFormErrorShipping((prevState) => ({
                        ...prevState,
                        first_name: ""
                      }))
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                  {
                    formErrorShipping?.first_name && <Typography className='form-error-lable field-error'>{formErrorShipping?.first_name}</Typography>
                  }
                </Stack>

              </Box>

              <Box className='input-block-section fullwidth'>
                <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section'>

                  <TextField className='input-text common_input_block_section'
                    name='last_name'
                    id='last_name'
                    value={shippingFormValues?.last_name}
                    error={formErrorShipping?.last_name ? true : false}
                    onChange={(e) => {
                      setIsShippingAddressChnaged(true)
                      setIsValidShippingAddress(false)
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        last_name: e.target.value
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          lastname: e.target.value
                        }
                      }))
                      setFormErrorShipping((prevState) => ({
                        ...prevState,
                        last_name: ""
                      }))
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                  {
                    formErrorShipping?.last_name && <Typography className='form-error-lable field-error'>{formErrorShipping?.last_name}</Typography>
                  }
                </Stack>

              </Box>
            </Stack>
            <Stack className='form-block address-section-form fullwidth'>
              <Box className='input-block-section'>
                <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section address-section-block'>

                  <TextField className='input-text required-field common_input_block_section '
                    name='address1'
                    id='address1'
                    error={formErrorShipping?.address1 ? true : false}
                    value={shippingFormValues?.address1}
                    onChange={(e) => {
                      setIsShippingAddressChnaged(true)
                      setIsValidShippingAddress(false)
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        address1: e.target.value
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          street: [e.target.value, shippingInformtionData?.shipping_address?.street?.[1]]
                        }
                      }))
                      setFormErrorShipping((prevState) => ({
                        ...prevState,
                        address1: ""
                      }))
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                  {
                    formErrorShipping?.address1 && <Typography className='form-error-lable field-error address1-error'>{formErrorShipping?.address1}</Typography>
                  }
                  <TextField className='input-text secondary-street'
                    name='address2'
                    id='address2'
                    error={formErrorShipping?.address2 ? true : false}
                    value={shippingFormValues?.address2}
                    onChange={(e) => {
                      setIsShippingAddressChnaged(true)
                      setIsValidShippingAddress(false)
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        address2: e.target.value
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          street: [shippingInformtionData?.shipping_address?.street?.[0], e.target.value]
                        }
                      }))
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                </Stack>

              </Box>
            </Stack>

            <Stack className='form-block address-section-form'>
              <Box className='input-block-section select fullwidth'>
                <Typography className="input_label">Country<Typography variant='span'>*</Typography></Typography>
                <FormControl>
                  <Autocomplete
                    id="country_id"
                    className="sortby-plp select-options-box state-options autocomplete-dropdown"
                    value={shippingFormValues?.display_country}
                    name="state_dropdown_list"
                    error={formErrorShipping?.country ? true : false}
                    onChange={(event, newValue) => {
                      setIsShippingAddressChnaged(true)
                      setIsValidShippingAddress(false)
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        display_country: newValue?.label,
                        country: newValue?.value
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          countryId: newValue?.value
                        }
                      }))
                      setFormErrorShipping((prevState) => ({
                        ...prevState,
                        display_country: "",
                        country: ""
                      }))
                      if (newValue !== null) {
                        setTimeout(() => {
                          setUpdateShippingMethod(!updateShippingMethod)
                        }, 200);
                      }
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                    options={countries?.length ? countries : []}
                    disabled={true}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="inputfield-box"
                        placeholder="Country"
                        InputLabelProps={{
                          shrink: false,
                        }}
                      />
                    )}
                  />
                  {
                    formErrorShipping?.country && <Typography className='form-error-lable field-error'>{formErrorShipping?.country}</Typography>
                  }
                </FormControl>
              </Box>

              <Box className={`input-block select input-block-section select fullwidth ${formErrorShipping?.state ? 'show_error' : ''}`}>
                <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
                <FormControl >
                  <Autocomplete
                    id="states"
                    className="sortby-plp select-options-box state-options autocomplete-dropdown"
                    value={shippingFormValues?.regionValues}
                    name="state_dropdown_list"
                    error={formErrorShipping?.state ? true : false}
                    onChange={(event, newValue) => {
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        display_state: newValue?.title,
                        state: newValue?.value,
                        regionValues: newValue
                      }))
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          regionId: newValue?.value,
                          regionCode: newValue?.value,
                          region: newValue?.title,
                        }
                      }))
                      setFormErrorShipping((prevState) => ({
                        ...prevState,
                        display_state: "",
                        state: ""
                      }))
                      dispatch(ACTION_CARTDATA_ADDRESS({
                        address: {
                          countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
                          display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
                          postcode: cartDataAddress?.address?.postcode ? cartDataAddress?.address?.postcode : '',
                          region: newValue?.title,
                          region_id: newValue?.value
                        },
                        shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
                      }))
                      setEstimateShipping((prevState) => ({
                        ...prevState,
                        region: newValue?.title,
                        region_id: newValue?.value,
                      }))
                      if (newValue !== null) {
                        setTimeout(() => {
                          setUpdateShippingMethod(!updateShippingMethod)
                        }, 200);
                      }
                    }}
                    options={states?.length ? states : []}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="inputfield-box"
                        placeholder="State"
                        InputLabelProps={{
                          shrink: false,
                        }}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password',
                        }}
                      />
                    )}
                  />
                  {
                    formErrorShipping?.state && <Typography className='form-error-lable field-error'>{formErrorShipping?.state}</Typography>
                  }
                </FormControl>
              </Box>
            </Stack>

            <Stack className='form-block address-section-form'>
              <Box className='input-block-section fullwidth'>
                <Typography className="input_label">City<Typography variant='span'>*</Typography></Typography>
                <FormControl >
                  <Stack className='form-address-form common_input_block_section'>
                    <TextField className='input-text'
                      name='city'
                      id='city'
                      error={formErrorShipping?.city ? true : false}
                      value={shippingFormValues?.city}
                      onChange={(e) => {
                        setIsValidShippingAddress(false)
                        setIsShippingAddressChnaged(true)
                        setShippingFormValues((prevState) => ({
                          ...prevState,
                          city: e.target.value
                        }))
                        setShippingInformtionData((prevState) => ({
                          ...prevState,
                          shipping_address: {
                            ...prevState.shipping_address,
                            city: e.target.value
                          }
                        }))
                        setFormErrorShipping((prevState) => ({
                          ...prevState,
                          city: ""
                        }))
                      }}
                      onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                    />
                    {
                      formErrorShipping?.city && <Typography className='form-error-lable field-error'>{formErrorShipping?.city}</Typography>
                    }
                  </Stack>
                </FormControl>
              </Box>

              <Box className='input-block-section fullwidth'>
                <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section'>

                  <TextField className='input-text'
                    name='zip_code'
                    id='zip_code'
                    error={formErrorShipping?.zip_code ? true : false}
                    value={shippingFormValues?.zip_code}
                    inputProps={{
                      autoComplete: "new-password",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                    onChange={(e) => {
                      if (e.target.value === '' || isValidNumber(e.target.value)) {
                        setIsPostCodeChanged(true)
                        setShippingFormValues((prevState) => ({
                          ...prevState,
                          zip_code: e.target.value
                        }))
                        setShippingInformtionData((prevState) => ({
                          ...prevState,
                          shipping_address: {
                            ...prevState.shipping_address,
                            postcode: e.target.value
                          }
                        }))
                        setFormErrorShipping((prevState) => ({
                          ...prevState,
                          zip_code: ""
                        }))
                      }
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                  {
                    formErrorShipping?.zip_code && <Typography className='form-error-lable field-error'>{formErrorShipping?.zip_code}</Typography>
                  }
                </Stack>

              </Box>
            </Stack>

            <Stack className='form-block address-section-form fullwidth'>
              <Box className={`input-block-section phone-section ${formErrorShipping?.number ? 'show_error' : ''}`}>
                <Typography className="input_label ">Phone Number<Typography variant='span'>*</Typography></Typography>
                <Stack className='form-address-form common_input_block_section'>
                  <PhoneInput
                    country={'in'}
                    id="number"
                    name="number"
                    fullWidth
                    label="Mobile Number"
                    className={`drop_mobile_input input-text required phone-number-section`}
                    placeholder="Mobile number"
                    inputProps={{
                      label: "Mobile Number",
                      required: true,
                      name: 'phone',
                      open: true,
                      id: "number"
                    }
                    }
                    variant="outlined"
                    countryCodeEditable={false}
                    value={shippingFormValues?.number}
                    onChange={(e, value, event, formattedValue) => {
                      if (e === '' || isValidNumber(e)) {
                        setIsValidShippingAddress(false)
                        setIsShippingAddressChnaged(true)
                        setShippingFormValues((prevState) => ({
                          ...prevState,
                          number: `+${e}`,
                          mobile_valid: e.slice(value?.dialCode?.length)
                        }))
                        setShippingInformtionData((prevState) => ({
                          ...prevState,
                          shipping_address: {
                            ...prevState.shipping_address,
                            telephone: `+${e}`,
                          }
                        }))
                        setFormErrorShipping((prevState) => ({
                          ...prevState,
                          number: ""
                        }))
                      } else {
                        return false
                      }
                    }}
                    onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                  />
                  {
                    formErrorShipping?.number && <Typography className='form-error-lable field-error'>{formErrorShipping?.number}</Typography>
                  }
                </Stack>
              </Box>
            </Stack>
          </Stack>
          : ''
      }

      <>
        <Stack className='shipping-address-parent-section'>
          <Stack className='shipping-address-table-content-section'>
            {
              (getShippingBillingAddres?.data?.shipping_address?.region !== null ||
                getShippingBillingAddres?.data?.shipping_address?.postcode !== null) &&
                getShippingBillingAddres?.data?.all_address?.length &&
                !isMatchingWithAllAddress &&
                getShippingBillingAddres?.data?.shipping_address?.customer_address_id == null ?
                <Stack className="shipping-address-table-list">
                  <Stack className="shipping-address-table-info active">
                    <img src={MarkIcon} alt="" />
                    <Typography variant='span' className='product-name data-value'>
                      {getShippingBillingAddres?.data?.shipping_address?.firstname}
                      {getShippingBillingAddres?.data?.shipping_address?.lastname ? ' ' : ''}
                      {getShippingBillingAddres?.data?.shipping_address?.lastname},
                    </Typography>
                    <Typography variant='span' className="mobileprice-section">{getShippingBillingAddres?.data?.shipping_address?.street?.[0]},</Typography>
                    {
                      getShippingBillingAddres?.data?.shipping_address?.street?.[1] ?
                        <Typography variant='span' className="mobileprice-section">{getShippingBillingAddres?.data?.shipping_address?.street?.[1]},</Typography>
                        : ''
                    }
                    <Typography variant='span' className="mobileprice-section">{getShippingBillingAddres?.data?.shipping_address?.city}-{getShippingBillingAddres?.data?.shipping_address?.postcode},</Typography>
                    <Typography variant='span' className="mobileprice-section">{getShippingBillingAddres?.data?.shipping_address?.region},</Typography>
                    <Typography variant='span' className="mobileprice-section">{getShippingBillingAddres?.data?.shipping_address?.country_name}.</Typography>
                    <Typography variant='span' className="mobileprice-section">Phone: {getShippingBillingAddres?.data?.shipping_address?.telephone}</Typography>
                  </Stack>
                  <Typography
                    className='edit'
                    onClick={() => {
                      setShippingFormValues((prevState) => ({
                        ...prevState,
                        customerAddressId: getShippingBillingAddres?.data?.shipping_address?.address_id,
                        first_name: getShippingBillingAddres?.data?.shipping_address?.firstname,
                        last_name: getShippingBillingAddres?.data?.shipping_address?.lastname,
                        address1: getShippingBillingAddres?.data?.shipping_address?.street?.[0],
                        address2: getShippingBillingAddres?.data?.shipping_address?.street?.[1] ? getShippingBillingAddres?.data?.shipping_address?.street?.[1] : '',
                        display_country: getShippingBillingAddres?.data?.shipping_address?.country_name,
                        country: getShippingBillingAddres?.data?.shipping_address?.country_id,
                        display_state: getShippingBillingAddres?.data?.shipping_address?.region,
                        state: getShippingBillingAddres?.data?.shipping_address?.region_id,
                        regionValues: {
                          label: getShippingBillingAddres?.data?.shipping_address?.region,
                          value: getShippingBillingAddres?.data?.shipping_address?.region_id,
                        },
                        city: getShippingBillingAddres?.data?.shipping_address?.city,
                        zip_code: getShippingBillingAddres?.data?.shipping_address?.postcode,
                        number: getShippingBillingAddres?.data?.shipping_address?.telephone,
                        mobile_valid: getShippingBillingAddres?.data?.shipping_address?.telephone,
                        save_in_address_book: getShippingBillingAddres?.data?.shipping_address?.save_in_address_book
                      }))
                      setOpen(!open)
                    }}
                  >Edit Address</Typography>
                </Stack>
                : ''
            }
            {/* inactive address section */}
            {getShippingBillingAddres?.data?.all_address?.map((item, ind) => {
              return (
                <Stack className="shipping-address-table-list" key={ind}>
                  <Stack
                    className={`shipping-address-table-info ${item?.address_id == getShippingBillingAddres?.data?.shipping_address?.customer_address_id ? 'active' : ''}`}
                    onClick={() => {
                      setShippingInformtionData((prevState) => ({
                        ...prevState,
                        shipping_address: {
                          ...prevState.shipping_address,
                          customerAddressId: item?.address_id,
                          countryId: item?.country_id,
                          regionId: item?.region_id ? item?.region_id : null,
                          regionCode: item?.region_id ? item?.region_id : null,
                          region: item?.region,
                          street: [
                            item?.streetaddress?.[0],
                            item?.streetaddress?.[1] ? item?.streetaddress?.[1] : '',
                          ],
                          company: item?.company,
                          telephone: item?.phone,
                          postcode: item?.zip_code,
                          city: item?.city,
                          firstname: item?.firstname,
                          lastname: item?.lastname,
                          email: "",
                          same_as_billing: 0,
                          save_in_address_book: 0
                        },
                        address_from: "old"
                      }))
                      customerEstimateShippingById(
                        dispatch, token, item?.address_id, setEstimateShippingData,
                        setEstimateShippingLoader, setUpdateShippingInformationById, updateShippingInformationById, actionmessage?.isSesstionTimeOut
                      );
                    }}
                  >
                    <img src={MarkIcon} alt="" />
                    <Typography variant='span' className='product-name data-value'>{item?.firstname} {item?.lastname},</Typography>
                    <Typography variant='span' className="mobileprice-section">{item?.streetaddress?.[0]},</Typography>
                    {
                      item?.streetaddress?.[1] ?
                        <Typography variant='span' className="mobileprice-section">{item?.streetaddress?.[1]},</Typography>
                        : ''
                    }
                    <Typography variant='span' className="mobileprice-section">{item?.city}-{item?.zip_code},</Typography>
                    <Typography variant='span' className="mobileprice-section">{item?.region},</Typography>
                    <Typography variant='span' className="mobileprice-section">{item?.country_name}.</Typography>
                    <Stack className='editaddress_mobile'>
                      <Typography variant='span' className="mobileprice-section">{item?.phone}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
        {
          getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null &&
            ((getShippingBillingAddres?.data?.shipping_address?.region !== null && getShippingBillingAddres?.data?.shipping_address?.region !== undefined) ||
              (getShippingBillingAddres?.data?.shipping_address?.postcode !== null && getShippingBillingAddres?.data?.shipping_address?.postcode !== undefined))
            ?
            <Box className="new-shipping-address-form-btn">
              <Button
                className='secondary_default_btn'
                onClick={() => {
                  setShippingFormValues((prevState) => ({
                    ...prevState,
                    country: getShippingBillingAddres?.data?.shipping_address?.country_id,
                    display_country: getShippingBillingAddres?.data?.shipping_address?.country_name,
                    first_name: "",
                    last_name: "",
                    address1: "",
                    address2: "",
                    display_state: "",
                    state: "",
                    regionValues: {
                      label: "",
                      value: ""
                    },
                    city: "",
                    zip_code: "",
                    number: "",
                    mobile_valid: "",
                    DefaultShipping: "0",
                    DefaultBilling: "0",
                    save_in_address_book: 0,
                    customerAddressId: null,
                    same_as_billing: "0"
                  }))
                  setOpen(!open)
                }}
              >Add New Address</Button>
            </Box>
            : ''
        }

        {
          open && <Model
            name="new-address-popup"
            cname="newaddress"
            closePpup={() => closeNewEditAddresPopup()}
            data={
              <>
                <Stack className='address-popup-section'>
                  <Stack className='close-section'>
                    <Box className='close-icon' onClick={() => closeNewEditAddresPopup()}>
                      <svg id="Group_3123" data-name="Group 3123" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <rect id="Rectangle_2261" data-name="Rectangle 2261" width="24" height="24" fill="#fff" />
                        <g id="close" transform="translate(5.337 5.337)">
                          <g id="Group_2837" data-name="Group 2837">
                            <path id="Path_11420" data-name="Path 11420" d="M10.517,9.29a.868.868,0,1,0-1.228,1.228L14.3,15.534,9.288,20.549a.868.868,0,1,0,1.228,1.228l5.016-5.015,5.015,5.015a.868.868,0,1,0,1.228-1.228l-5.015-5.015,5.015-5.015A.868.868,0,1,0,20.548,9.29l-5.015,5.015L10.517,9.29Z" transform="translate(-9.034 -9.036)" fill="#898d94" />
                          </g>
                        </g>
                      </svg>
                    </Box>
                  </Stack>
                  <Stack className='popup-section'>
                    <Typography variant='span' className='header-title-section'>{isEditAddress ? 'Edit address' : 'Add New Shipping Address'}</Typography>
                    <Stack className='add-address-section-block'>
                      <Stack className='new-shipping-address-form-block-section'>
                        <Stack className='form-block address-section-form'>
                          <Box className='input-block-section fullwidth'>
                            <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section'>
                              <TextField
                                className='input-text'
                                name='first_name'
                                id='first_name'
                                value={shippingFormValues?.first_name}
                                error={formErrorShipping?.first_name ? true : false}
                                onChange={(e) => {
                                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                    setShippingFormValues((prevState) => ({
                                      ...prevState,
                                      first_name: e.target.value
                                    }))
                                    setFormErrorShipping((prevState) => ({
                                      ...prevState,
                                      first_name: ""
                                    }))
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                              />
                              {
                                formErrorShipping?.first_name && <Typography className='form-error-lable field-error'>{formErrorShipping?.first_name}</Typography>
                              }
                            </Stack>

                          </Box>

                          <Box className='input-block-section fullwidth'>
                            <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section'>

                              <TextField className='input-text common_input_block_section'
                                name='last_name'
                                id='last_name'
                                value={shippingFormValues?.last_name}
                                error={formErrorShipping?.last_name ? true : false}
                                onChange={(e) => {
                                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                    setShippingFormValues((prevState) => ({
                                      ...prevState,
                                      last_name: e.target.value
                                    }))
                                    setFormErrorShipping((prevState) => ({
                                      ...prevState,
                                      last_name: ""
                                    }))
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                              />
                              {
                                formErrorShipping?.last_name && <Typography className='form-error-lable field-error'>{formErrorShipping?.last_name}</Typography>
                              }
                            </Stack>

                          </Box>
                        </Stack>
                        <Stack className='form-block address-section-form fullwidth'>
                          <Box className='input-block-section'>
                            <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section address-section-block'>

                              <TextField className='input-text required-field common_input_block_section '
                                name='address1'
                                id='address1'
                                error={formErrorShipping?.address1 ? true : false}
                                value={shippingFormValues?.address1}
                                onChange={(e) => {
                                  setShippingFormValues((prevState) => ({
                                    ...prevState,
                                    address1: e.target.value
                                  }))
                                  setFormErrorShipping((prevState) => ({
                                    ...prevState,
                                    address1: ""
                                  }))
                                }}
                                onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerShipping)}
                              />
                              {
                                formErrorShipping?.address1 && <Typography className='form-error-lable field-error address1-error'>{formErrorShipping?.address1}</Typography>
                              }

                              <TextField className='input-text secondary-street'
                                name='address2'
                                id='address2'
                                error={formErrorShipping?.address2 ? true : false}
                                value={shippingFormValues?.address2}
                                onChange={(e) => {
                                  setShippingFormValues((prevState) => ({
                                    ...prevState,
                                    address2: e.target.value
                                  }))
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                              />
                            </Stack>

                          </Box>
                        </Stack>

                        <Stack className='form-block address-section-form'>
                          <Box className='input-block-section fullwidth'>
                            <Typography className="input_label">Country<Typography variant='span'>*</Typography></Typography>
                            <FormControl>
                              <Autocomplete
                                id="country_id"
                                className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                value={shippingFormValues?.display_country}
                                name="state_dropdown_list"
                                error={formErrorShipping?.country ? true : false}
                                onChange={(event, newValue) => {
                                  setShippingFormValues((prevState) => ({
                                    ...prevState,
                                    display_country: newValue?.label,
                                    country: newValue?.value
                                  }))
                                  setFormErrorShipping((prevState) => ({
                                    ...prevState,
                                    display_country: "",
                                    country: ""
                                  }))
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                                options={countries?.length ? countries : []}
                                disabled={true}
                                fullWidth
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="inputfield-box"
                                    placeholder="Country"
                                    InputLabelProps={{
                                      shrink: false,
                                    }}
                                  />
                                )}
                              />
                              {
                                formErrorShipping?.country && <Typography className='form-error-lable field-error'>{formErrorShipping?.country}</Typography>
                              }
                            </FormControl>
                          </Box>

                          <Box className={`input-block select input-block-section select fullwidth ${formErrorShipping?.state ? 'show_error' : ''}`}>
                            <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
                            <FormControl >
                              <Autocomplete
                                id="states"
                                className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                value={shippingFormValues?.regionValues}
                                name="state_dropdown_list"
                                error={formErrorShipping?.state ? true : false}
                                onChange={(event, newValue) => {
                                  setShippingFormValues((prevState) => ({
                                    ...prevState,
                                    display_state: newValue?.title,
                                    state: newValue?.value,
                                    regionValues: newValue
                                  }))
                                  setFormErrorShipping((prevState) => ({
                                    ...prevState,
                                    display_state: "",
                                    state: ""
                                  }))
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                options={states?.length ? states : []}
                                inputProps={{
                                  autoComplete: "new-password",
                                  form: {
                                    autoComplete: "off",
                                  },
                                }}
                                fullWidth
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="inputfield-box"
                                    placeholder="State"
                                    InputLabelProps={{
                                      shrink: false,
                                    }}
                                    inputProps={{
                                      ...params.inputProps,
                                      autoComplete: 'new-password',
                                    }}
                                  />
                                )}
                              />
                              {
                                formErrorShipping?.state && <Typography className='form-error-lable field-error'>{formErrorShipping?.state}</Typography>
                              }
                            </FormControl>

                          </Box>
                        </Stack>

                        <Stack className='form-block address-section-form'>
                          <Box className='input-block-section fullwidth'>
                            <Typography className="input_label">City<Typography variant='span'>*</Typography></Typography>
                            <FormControl >
                              <Stack className='form-address-form common_input_block_section'>

                                <TextField className='input-text'
                                  name='city'
                                  id='city'
                                  error={formErrorShipping?.city ? true : false}
                                  value={shippingFormValues?.city}
                                  onChange={(e) => {
                                    if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                      setShippingFormValues((prevState) => ({
                                        ...prevState,
                                        city: e.target.value
                                      }))
                                      setFormErrorShipping((prevState) => ({
                                        ...prevState,
                                        city: ""
                                      }))
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      addNewAddressHandlerShipping(setOpen, true)
                                    }
                                  }}
                                />
                                {
                                  formErrorShipping?.city && <Typography className='form-error-lable field-error'>{formErrorShipping?.city}</Typography>
                                }
                              </Stack>

                            </FormControl>

                          </Box>

                          <Box className='input-block-section fullwidth'>
                            <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section'>

                              <TextField className='input-text'
                                name='zip_code'
                                id='zip_code'
                                error={formErrorShipping?.zip_code ? true : false}
                                value={shippingFormValues?.zip_code}
                                onChange={(e) => {
                                  if (e.target.value === '' || isValidNumber(e.target.value)) {
                                    setShippingFormValues((prevState) => ({
                                      ...prevState,
                                      zip_code: e.target.value
                                    }))
                                    setFormErrorShipping((prevState) => ({
                                      ...prevState,
                                      zip_code: ""
                                    }))
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                              />
                              {
                                formErrorShipping?.zip_code && <Typography className='form-error-lable field-error'>{formErrorShipping?.zip_code}</Typography>
                              }
                            </Stack>

                          </Box>
                        </Stack>

                        <Stack className='form-block address-section-form fullwidth'>
                          <Box className={`input-block-section phone-section ${formErrorShipping?.number ? 'show_error' : ''}`}>
                            <Typography className="input_label ">Phone Number<Typography variant='span'>*</Typography></Typography>
                            <Stack className='form-address-form common_input_block_section'>
                              <PhoneInput
                                country={'in'}
                                name="number"
                                fullWidth
                                label="Mobile Number"
                                className={`drop_mobile_input input-text required phone-number-section`}
                                placeholder="Mobile number"
                                inputProps={{
                                  label: "Mobile Number",
                                  required: true,
                                  name: 'phone',
                                  open: true,
                                  id: "number"
                                }
                                }
                                variant="outlined"
                                countryCodeEditable={false}
                                value={shippingFormValues?.number}
                                onChange={(e, value, event, formattedValue) => {
                                  const re = /^[0-9\b]+$/;
                                  if (e === '' || isValidNumber(e)) {
                                    setShippingFormValues((prevState) => ({
                                      ...prevState,
                                      number: `+${e}`,
                                      mobile_valid: e.slice(value?.dialCode?.length)

                                    }))
                                    setFormErrorShipping((prevState) => ({
                                      ...prevState,
                                      number: ""
                                    }))
                                  } else {
                                    return false
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    addNewAddressHandlerShipping(setOpen, true)
                                  }
                                }}
                              />
                              {
                                formErrorShipping?.number && <Typography className='form-error-lable field-error'>{formErrorShipping?.number}</Typography>
                              }
                            </Stack>

                          </Box>
                        </Stack>

                      </Stack>
                      <Stack className='form-block address-section-form fullwidth checkbox-section'>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Save in address book"
                            onChange={(e) => {
                              if (e.target.checked == true) {
                                setShippingFormValues((prevState) => ({
                                  ...prevState,
                                  save_in_address_book: 1
                                }))
                              } else {
                                setShippingFormValues((prevState) => ({
                                  ...prevState,
                                  save_in_address_book: 0
                                }))
                              }
                            }}
                            checked={shippingFormValues?.save_in_address_book == "1" ? true : false}
                          />
                        </FormGroup>
                      </Stack>
                      <div className="btn-section">
                        <Button
                          className='outlined_default_btn'
                          onClick={() => closeNewEditAddresPopup()}
                        >Cancel</Button>
                        <Button
                          className='primary_default_btn'
                          onClick={() => {
                            addNewAddressHandlerShipping(setOpen, true)
                          }}
                        >Save Address</Button>
                      </div>
                    </Stack>
                  </Stack>
                </Stack>
              </>
            } />
        }
      </>
    </Stack>
  )
}

export default Index;
