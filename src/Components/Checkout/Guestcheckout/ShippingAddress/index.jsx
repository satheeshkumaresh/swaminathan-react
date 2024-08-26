import React, { useState, useEffect } from 'react';
import "./styles.scss";
import { Stack, Box, Typography, TextField, Autocomplete } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import {
  pressEnterCallFunction, isValidCharacter, isNumber, isValidNumber
} from "../../../../Utilities/Utilities";
import { ACTION_GUESTSHIPPING, ACTION_CARTDATA_ADDRESS } from "../../../../Store/action";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/material.css";

const Index = ({
  guestShipping, setGuestShipping, shippingFormError, setShippingFormError,
  addGuestNewAddressHandlerShipping, setUpdateShippingMethod, updateShippingMethod,
  setEstimateShipping, setIsValidShippingAddress, setIsShippingAddressChnaged
}) => {
  const dispatch = useDispatch();
  const {
    countries, states, cartDataAddress, guestShippingAddress
  } = useSelector(state => {
    return {
      countries: state?.countries,
      states: state?.states,
      cartDataAddress: state?.cartDataAddress,
      guestShippingAddress: state?.guestShippingAddress,
    }
  })
  const [isPostCodeChanged, setIsPostCodeChanged] = useState(false);
  // zipcode
  useEffect(() => {
    const zipCodeInput = document.getElementById('zip_code');
    const delayFn = setTimeout(() => {
      if (isPostCodeChanged && isNumber.test(guestShipping?.zip_code)) {
        setEstimateShipping((prevState) => ({
          ...prevState,
          postcode: guestShipping?.zip_code,
        }))
        dispatch(ACTION_CARTDATA_ADDRESS({
          address: {
            countryId: cartDataAddress?.address?.countryId ? cartDataAddress?.address?.countryId : '',
            display_country: cartDataAddress?.address?.display_country ? cartDataAddress?.address?.display_country : '',
            postcode: guestShipping?.zip_code,
            region: cartDataAddress?.address?.region ? cartDataAddress?.address?.region : '',
            region_id: cartDataAddress?.address?.region_id ? cartDataAddress?.address?.region_id : ''
          },
          shippingMethod: cartDataAddress?.shippingMethod ? cartDataAddress?.shippingMethod : {}
        }))
        dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, zip_code: guestShipping?.zip_code }))
        if (guestShipping?.zip_code) {
          setUpdateShippingMethod(!updateShippingMethod)
        }
        zipCodeInput.blur();
        setIsPostCodeChanged(false)
      }
    }, 800);
    return () => clearTimeout(delayFn);
  }, [guestShipping?.zip_code, 350]);

  return (
    <Stack className='shipping-address-block'>
      <Stack className='shipping-address-section-form'>
        <Typography className='shipping-title' variant='h4'>Shipping Address</Typography>
      </Stack>
      <Stack className='shipping-address-form-block-section'>
        <Stack className='form-block address-section-form'>
          <Box className='input-block-section fullwidth'>
            <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
            <Stack className='form-address-form common_input_block_section'>
              <TextField
                className='input-text'
                name='first_name'
                id='first_name'
                error={shippingFormError?.first_name ? true : false}
                value={guestShipping?.first_name}
                onChange={(e) => {
                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                    setIsValidShippingAddress(false)
                    setIsShippingAddressChnaged(true)
                    setGuestShipping((prevState) => ({
                      ...prevState,
                      first_name: e.target.value
                    }))
                    dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, first_name: e.target.value }))
                    setShippingFormError((prevState) => ({
                      ...prevState,
                      first_name: ""
                    }))
                  }
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.first_name && <Typography className='form-error-lable field-error'>{shippingFormError?.first_name}</Typography>
              }
            </Stack>

          </Box>

          <Box className='input-block-section fullwidth'>
            <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
            <Stack className='form-address-form common_input_block_section'>
              <TextField className='input-text'
                name='last_name'
                id='last_name'
                value={guestShipping?.last_name}
                error={shippingFormError?.last_name ? true : false}
                onChange={(e) => {
                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                    setIsValidShippingAddress(false)
                    setIsShippingAddressChnaged(true)
                    setGuestShipping((prevState) => ({
                      ...prevState,
                      last_name: e.target.value
                    }))
                    dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, last_name: e.target.value }))
                    setShippingFormError((prevState) => ({
                      ...prevState,
                      last_name: ""
                    }))
                  }
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.last_name && <Typography className='form-error-lable field-error'>{shippingFormError?.last_name}</Typography>
              }
            </Stack>

          </Box>
        </Stack>
        <Stack className='form-block address-section-form fullwidth'>
          <Box className='input-block-section'>
            <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
            <Stack className='form-address-form common_input_block_section address-section-block'>
              <TextField className='input-text required-field '
                name='address1'
                id='address1'
                value={guestShipping?.address1}
                error={shippingFormError?.address1 ? true : false}

                onChange={(e) => {
                  setIsValidShippingAddress(false)
                  setIsShippingAddressChnaged(true)
                  setGuestShipping((prevState) => ({
                    ...prevState,
                    address1: e.target.value
                  }))
                  dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, address1: e.target.value }))
                  setShippingFormError((prevState) => ({
                    ...prevState,
                    address1: ""
                  }))
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.address1 && <Typography className='form-error-lable field-error required-position address1-error'>{shippingFormError?.address1}</Typography>
              }
              <TextField className='input-text  secondary-street'
                name='address2'
                id='address2'
                error={shippingFormError?.address2 ? true : false}
                value={guestShipping?.address2}
                onChange={(e) => {
                  setIsValidShippingAddress(false)
                  setIsShippingAddressChnaged(true)
                  setGuestShipping((prevState) => ({
                    ...prevState,
                    address2: e.target.value
                  }))
                  dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, address2: e.target.value }))
                  setShippingFormError((prevState) => ({
                    ...prevState,
                    address2: ""
                  }))
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.address2 && <Typography className='form-error-lable field-error required-position'>{shippingFormError?.address2}</Typography>
              }
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
                value={guestShipping?.display_country}
                name="state_dropdown_list"
                error={shippingFormError?.country ? true : false}
                onChange={(event, newValue) => {
                  setIsValidShippingAddress(false)
                  setIsShippingAddressChnaged(true)
                  setGuestShipping((prevState) => ({
                    ...prevState,
                    display_country: newValue?.label,
                    country: newValue?.value
                  }))
                  dispatch(ACTION_GUESTSHIPPING({
                    ...guestShippingAddress,
                    display_country: newValue?.label,
                    country: newValue?.value
                  }))
                  setEstimateShipping((prevState) => ({
                    ...prevState,
                    country_id: newValue?.value,
                    display_country: newValue?.label,
                  }))
                  setShippingFormError((prevState) => ({
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

            </FormControl>
            {
              shippingFormError?.country && <Typography className='form-error-lable field-error'>{shippingFormError?.country}</Typography>
            }
          </Box>

          <Box className={`input-block input-block-section select fullwidth ${shippingFormError?.state ? 'show_error' : ''}`}>
            <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
            <FormControl >
              <Autocomplete
                id="states"
                className="sortby-plp select-options-box state-options autocomplete-dropdown"
                value={guestShipping?.regionValues}
                name="state_dropdown_list"
                error={shippingFormError?.state ? true : false}
                onChange={(event, newValue) => {
                  setGuestShipping((prevState) => ({
                    ...prevState,
                    display_state: newValue?.title,
                    state: newValue?.value,
                    regionValues: newValue
                  }))
                  dispatch(ACTION_GUESTSHIPPING({
                    ...guestShippingAddress,
                    display_state: newValue?.title,
                    state: newValue?.value,
                    regionValues: newValue
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
                  setShippingFormError((prevState) => ({
                    ...prevState,
                    display_state: "",
                    state: ""
                  }))
                  if (newValue !== null) {
                    setTimeout(() => {
                      setUpdateShippingMethod(!updateShippingMethod)
                    }, 200);
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={states?.length ? states : []}
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
            </FormControl>
            {
              shippingFormError?.state && <Typography className='form-error-lable field-error'>{shippingFormError?.state}</Typography>
            }
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
                  error={shippingFormError?.city ? true : false}
                  value={guestShipping?.city}
                  onChange={(e) => {
                    if (e.target.value === '' || isValidCharacter(e.target.value)) {
                      setIsValidShippingAddress(false)
                      setIsShippingAddressChnaged(true)
                      setGuestShipping((prevState) => ({
                        ...prevState,
                        city: e.target.value
                      }))
                      dispatch(ACTION_GUESTSHIPPING({ ...guestShippingAddress, city: e.target.value }))
                      setShippingFormError((prevState) => ({
                        ...prevState,
                        city: ""
                      }))
                    }
                  }}
                  onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
                />
              </Stack>

            </FormControl>
            {
              shippingFormError?.city && <Typography className='form-error-lable field-error'>{shippingFormError?.city}</Typography>
            }
          </Box>

          <Box className='input-block-section fullwidth'>
            <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
            <Stack className='form-address-form common_input_block_section'>
              <TextField className='input-text'
                name='zip_code'
                id='zip_code'
                error={shippingFormError?.zip_code ? true : false}
                value={guestShipping?.zip_code}
                onChange={(e) => {
                  if (e.target.value === '' || isValidNumber(e.target.value)) {
                    setIsPostCodeChanged(true)
                    setGuestShipping((prevState) => ({
                      ...prevState,
                      zip_code: e.target.value
                    }))
                    setShippingFormError((prevState) => ({
                      ...prevState,
                      zip_code: ""
                    }))
                  } else {
                    return false
                  }
                }}
                inputProps={{
                  autoComplete: "new-password",
                  form: {
                    autoComplete: "off",
                  },
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.zip_code && <Typography className='form-error-lable field-error'>{shippingFormError?.zip_code}</Typography>
              }
            </Stack>

          </Box>
        </Stack>

        <Stack className='form-block address-section-form fullwidth'>
          <Box className={`input-block-section phone-section ${shippingFormError?.number ? 'show_error' : ''}`}>
            <Typography className="input_label ">Phone Number<Typography variant='span'>*</Typography></Typography>
            <Stack className='form-address-form common_input_block_section phone-number-section'>
              <PhoneInput
                country={'in'}
                name="number"
                fullWidth
                label="Mobile Number"
                className={`drop_mobile_input input-text required`}
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
                value={guestShipping?.number}
                onChange={(e, value, event, formattedValue) => {
                  const re = /^[0-9\b]+$/;
                  if (e === '' || re.test(e)) {
                    setIsValidShippingAddress(false)
                    setIsShippingAddressChnaged(true)
                    setGuestShipping((prevState) => ({
                      ...prevState,
                      number: `+${e}`,
                      mobile_valid: e.slice(value?.dialCode?.length)
                    }))
                    dispatch(ACTION_GUESTSHIPPING({
                      ...guestShippingAddress,
                      number: `+${e}`,
                      mobile_valid: e.slice(value?.dialCode?.length)
                    }))
                    setShippingFormError((prevState) => ({
                      ...prevState,
                      number: ""
                    }))
                  } else {
                    return false
                  }
                }}
                onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewAddressHandlerShipping)}
              />
              {
                shippingFormError?.number && <Typography className='form-error-lable field-error'>{shippingFormError?.number}</Typography>
              }
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Index;
