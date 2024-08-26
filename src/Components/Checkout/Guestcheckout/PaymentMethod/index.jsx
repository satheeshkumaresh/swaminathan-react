import React, { useEffect, useState } from "react";
import "./styles.scss";
import {
    Stack, Box,
    Typography, Button, FormControlLabel, Radio,
    TextField, Autocomplete
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import payment from '../../../../Assets/Checkout/CheckoutPayment.png';
import {
    pressEnterCallFunction, isValidCharacter
} from "../../../../Utilities/Utilities";
import { useDispatch, useSelector } from "react-redux";
import {
    ACTION_GUESTSAMEASSHIPPINGBILLING, ACTION_SELECTED_PAYMENTMETHOD
} from "../../../../Store/action";
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";

const Index = ({
    guestBilling, setGuestBilling, billingFormError, setBillingFormError,
    addGuestNewBillingAddressHandler, paymentInfoData, selectPaymentMethod,
    setSelectPaymentMethod, getShippingBillingAddres, setSameAsBillingShipping,
    sameAsBillingShipping, setDisablePlaceOrder, disablePlaceOrder,
    setIsShippingAddressChnaged, setShippingInformtionData,
    isClickedUpdate, setIsClickedUpdate
}) => {
    const dispatch = useDispatch();
    const {
        guestShippingAddress, guestBillingAddress,
        countries, states, guestSameAsShipping,
        selectedPaymentMethod
    } = useSelector(state => {
        return {
            guestShippingAddress: state?.guestShippingAddress,
            guestBillingAddress: state?.guestBillingAddress,
            countries: state?.countries,
            states: state?.states,
            guestSameAsShipping: state?.guestSameAsShipping,
            selectedPaymentMethod: state?.selectedPaymentMethod
        }
    })
    const [isEditBillingAddress, setIsEditBillingAddress] = useState(false);
    const [showBillingForm, setShowBillingForm] = useState(false);
    const sameAsBillingShippingHandler = () => {
        setShippingInformtionData((prevState) => ({
            ...prevState,
            shipping_address: {
                ...prevState.shipping_address,
                countryId: guestShippingAddress?.country,
                regionId: guestShippingAddress?.state ? guestShippingAddress?.state : null,
                regionCode: guestShippingAddress?.state ? guestShippingAddress?.state : null,
                region: guestShippingAddress?.display_state,
                postcode: guestShippingAddress?.zip_code,
                street: [
                    guestShippingAddress?.address1,
                    guestShippingAddress?.address2 ? guestShippingAddress?.address2 : '',
                ],
                company: guestShippingAddress?.company,
                telephone: guestShippingAddress?.number,
                city: guestShippingAddress?.city,
                firstname: guestShippingAddress?.first_name,
                lastname: guestShippingAddress?.last_name,
                email: guestShippingAddress?.email,
            },
            billing_address: {
                ...prevState.billing_address,
                countryId: guestShippingAddress?.country,
                regionId: guestShippingAddress?.state ? guestShippingAddress?.state : null,
                regionCode: guestShippingAddress?.state ? guestShippingAddress?.state : null,
                region: guestShippingAddress?.display_state,
                postcode: guestShippingAddress?.zip_code,
                street: [
                    guestShippingAddress?.address1,
                    guestShippingAddress?.address2 ? guestShippingAddress?.address2 : '',
                ],
                company: guestShippingAddress?.company,
                telephone: guestShippingAddress?.number,
                city: guestShippingAddress?.city,
                firstname: guestShippingAddress?.first_name,
                lastname: guestShippingAddress?.last_name,
                saveInAddressBook: null
            }
        }))
        // sameAsShippingHandler(data)
        dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
        setBillingFormError((prevState) => ({
            ...prevState,
            first_name: "",
            last_name: "",
            address1: "",
            address2: "",
            country: "",
            state: "",
            city: "",
            zip_code: "",
            number: "",
            email: ""
        }))
    }
    useEffect(() => {
        if (guestSameAsShipping) {
            setShowBillingForm(false)
        } else if (!guestSameAsShipping && !guestBillingAddress?.first_name) {
            setShowBillingForm(true)
        } else if (!guestSameAsShipping && guestBillingAddress?.first_name && isEditBillingAddress) {
            setShowBillingForm(true)
        } else if (!guestSameAsShipping && guestBillingAddress?.first_name) {
            setShowBillingForm(false)
        }
        setBillingFormError((prevState) => ({
            ...prevState,
            first_name: "",
            last_name: "",
            address1: "",
            address2: "",
            country: "",
            state: "",
            city: "",
            zip_code: "",
            number: "",
            email: ""
        }))
    }, [guestSameAsShipping, guestBillingAddress, isEditBillingAddress])
    useEffect(() => {
        if (isEditBillingAddress) {
            setIsEditBillingAddress(false)
        }
    }, [guestBillingAddress]);
    useEffect(() => {
        if (selectedPaymentMethod !== null && selectedPaymentMethod !== undefined && selectedPaymentMethod !== "") {
            setSelectPaymentMethod(selectedPaymentMethod)
        } else {
            setSelectPaymentMethod(paymentInfoData?.[0]?.data?.payment_methods?.[0]?.code)
            dispatch(ACTION_SELECTED_PAYMENTMETHOD(paymentInfoData?.[0]?.data?.payment_methods?.[0]?.code));
        }
    }, [paymentInfoData, selectedPaymentMethod])
    useEffect(() => {
        if (showBillingForm) {
            setDisablePlaceOrder(true)
        } else {
            setDisablePlaceOrder(false)
        }
    }, [showBillingForm])
    return (
        <Stack className="payment-method-table-section payment-method-list-section">

            <Stack className='payment-method-list'>
                <Stack className='payment-method-section-title'>
                    <Typography className='payment-title' variant='h4'>Payment Method</Typography>
                </Stack>
                <Stack className='form-block address-section-form fullwidth checkbox-section'>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            label="My billing and shipping address are the same"
                            checked={guestSameAsShipping ? true : false}
                            onChange={(e) => {
                                setIsShippingAddressChnaged(true)
                                if (e.target.checked == true) {
                                    sameAsBillingShippingHandler()
                                } else {
                                    setIsClickedUpdate(true)
                                    setIsEditBillingAddress(true)
                                    dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(false))
                                    setShippingInformtionData((prevState) => ({
                                        ...prevState,
                                        billing_address: {
                                            ...prevState.billing_address,
                                            countryId: guestBillingAddress?.country,
                                            regionId: guestBillingAddress?.state ? guestBillingAddress?.state : null,
                                            regionCode: guestBillingAddress?.state ? guestBillingAddress?.state : null,
                                            region: guestBillingAddress?.display_state,
                                            street: [
                                                guestBillingAddress?.address1,
                                                guestBillingAddress?.address2 ? guestBillingAddress?.address2 : ''
                                            ],
                                            company: guestBillingAddress?.company,
                                            telephone: guestBillingAddress?.number,
                                            postcode: guestBillingAddress?.zip_code,
                                            city: guestBillingAddress?.city,
                                            firstname: guestBillingAddress?.first_name,
                                            lastname: guestBillingAddress?.last_name,
                                            saveInAddressBook: null
                                        }
                                    }))
                                    if (disablePlaceOrder) {
                                        setDisablePlaceOrder(false)
                                    }
                                }
                            }}
                        />
                    </FormGroup>
                    {
                        guestBillingAddress?.first_name && !isEditBillingAddress &&
                            !guestSameAsShipping ?
                            <Box className='billing_address'>
                                <Box className='info-address'>
                                    {
                                        guestBillingAddress?.first_name ?
                                            <Typography>
                                                {guestBillingAddress?.first_name}
                                                {guestBillingAddress?.last_name ? ` ${guestBillingAddress?.last_name}` : ''},
                                            </Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.address1 ? <Typography>
                                            {guestBillingAddress?.address1},
                                        </Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.address2 ? <Typography>
                                            {guestBillingAddress?.address2},
                                        </Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.city || guestBillingAddress?.city ?
                                            <Typography>
                                                {guestBillingAddress?.city}
                                                {`${guestBillingAddress?.zip_code ? '-' : ''}`}
                                                {guestBillingAddress?.zip_code},
                                            </Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.display_state ?
                                            <Typography>{guestBillingAddress?.display_state},</Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.display_country ?
                                            <Typography>{guestBillingAddress?.display_country}.</Typography> : ''
                                    }
                                    {
                                        guestBillingAddress?.number ?
                                            <Typography>Phone:&nbsp;
                                                <a href={`tel:${guestBillingAddress?.number}`}>
                                                    {guestBillingAddress?.number}
                                                </a>
                                            </Typography> : ''
                                    }
                                </Box>
                                <Box className='edit'>
                                    <small
                                        onClick={() => {
                                            setIsClickedUpdate(false)
                                            setIsEditBillingAddress(true)
                                            setGuestBilling((prevState) => ({
                                                ...prevState,
                                                country: guestBillingAddress?.country,
                                                display_country: guestBillingAddress?.display_country,
                                                state: guestBillingAddress?.state,
                                                display_state: guestBillingAddress?.display_state,
                                                regionValues: {
                                                    label: guestBillingAddress?.display_state,
                                                    value: guestBillingAddress?.state,
                                                },
                                                first_name: guestBillingAddress?.first_name,
                                                last_name: guestBillingAddress?.last_name,
                                                address1: guestBillingAddress?.address1,
                                                address2: guestBillingAddress?.address2,
                                                city: guestBillingAddress?.city,
                                                zip_code: guestBillingAddress?.zip_code,
                                                number: guestBillingAddress?.number,
                                                mobile_valid: guestBillingAddress?.mobile_valid,
                                                company: guestBillingAddress?.company,
                                            }))
                                        }}
                                    >Edit Address</small>
                                </Box>
                            </Box>
                            : ''
                    }
                    {
                        showBillingForm ?
                            <>
                                <Stack className="update-billing-address-section">
                                    <Stack className='billing-address-form-block-section'>
                                        <Stack className='form-block address-section-form'>
                                            <Box className='input-block-section fullwidth'>
                                                <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
                                                <Stack className='form-address-form common_input_block_section'>
                                                    <TextField
                                                        className='input-text'
                                                        name='first_name'
                                                        id='b_first_name'
                                                        value={guestBilling?.first_name}
                                                        error={billingFormError?.first_name ? true : false}
                                                        onChange={(e) => {
                                                            if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                setGuestBilling((prevState) => ({
                                                                    ...prevState,
                                                                    first_name: e.target.value
                                                                }))
                                                                setBillingFormError((prevState) => ({
                                                                    ...prevState,
                                                                    first_name: ""
                                                                }))
                                                            }
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                    />
                                                    {
                                                        billingFormError?.first_name && <Typography className='form-error-lable field-error'>{billingFormError?.first_name}</Typography>
                                                    }
                                                </Stack>

                                            </Box>

                                            <Box className='input-block-section fullwidth'>
                                                <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
                                                <Stack className='form-address-form common_input_block_section'>
                                                    <TextField className='input-text'
                                                        name='last_name'
                                                        id='b_last_name'
                                                        value={guestBilling?.last_name}
                                                        error={billingFormError?.last_name ? true : false}
                                                        onChange={(e) => {
                                                            if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                setGuestBilling((prevState) => ({
                                                                    ...prevState,
                                                                    last_name: e.target.value
                                                                }))
                                                                setBillingFormError((prevState) => ({
                                                                    ...prevState,
                                                                    last_name: ""
                                                                }))
                                                            }
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                    />
                                                    {
                                                        billingFormError?.last_name && <Typography className='form-error-lable field-error'>{billingFormError?.last_name}</Typography>
                                                    }
                                                </Stack>

                                            </Box>
                                        </Stack>
                                        <Stack className='form-block address-section-form fullwidth'>
                                            <Box className='input-block-section'>
                                                <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
                                                <Stack className='form-address-form common_input_block_section address-section-block'>
                                                    <TextField className='input-text required-field'
                                                        name='address1'
                                                        id='b_address1'
                                                        value={guestBilling?.address1}
                                                        error={billingFormError?.address1 ? true : false}
                                                        onChange={(e) => {
                                                            setGuestBilling((prevState) => ({
                                                                ...prevState,
                                                                address1: e.target.value
                                                            }))
                                                            setBillingFormError((prevState) => ({
                                                                ...prevState,
                                                                address1: ""
                                                            }))
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                    />
                                                    {
                                                        billingFormError?.address1 && <Typography className='form-error-lable field-error required-position address1-error'>{billingFormError?.address1}</Typography>
                                                    }
                                                    <TextField className='input-text secondary-street'
                                                        name='address2'
                                                        id='b_address2'
                                                        value={guestBilling?.address2}
                                                        error={billingFormError?.address2 ? true : false}
                                                        onChange={(e) => {
                                                            setGuestBilling((prevState) => ({
                                                                ...prevState,
                                                                address2: e.target.value
                                                            }))
                                                            setBillingFormError((prevState) => ({
                                                                ...prevState,
                                                                address2: ""
                                                            }))
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                    />
                                                </Stack>

                                            </Box>
                                        </Stack>

                                        <Stack className='form-block address-section-form'>
                                            <Box className='input-block-section select fullwidth'>
                                                <Typography className="input_label">Country<Typography variant='span'>*</Typography></Typography>
                                                <FormControl>
                                                    <Autocomplete
                                                        id="b_country"
                                                        className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                                        value={guestBilling?.display_country}
                                                        name="state_dropdown_list"
                                                        error={billingFormError?.country ? true : false}
                                                        onChange={(event, newValue) => {
                                                            setGuestBilling((prevState) => ({
                                                                ...prevState,
                                                                display_country: newValue?.label,
                                                                country: newValue?.value
                                                            }))
                                                            setBillingFormError((prevState) => ({
                                                                ...prevState,
                                                                display_country: "",
                                                                country: ""
                                                            }))
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
                                                    billingFormError?.country && <Typography className='form-error-lable field-error'>{billingFormError?.country}</Typography>
                                                }
                                            </Box>

                                            <Box className={`input-block select input-block-section select fullwidth ${billingFormError?.state ? 'show_error' : ''}`}>
                                                <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
                                                <FormControl >
                                                    <Autocomplete
                                                        id="b_state"
                                                        className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                                        value={guestBilling?.regionValues}
                                                        name="state_dropdown_list"
                                                        error={billingFormError?.state ? true : false}
                                                        onChange={(event, newValue) => {
                                                            setGuestBilling((prevState) => ({
                                                                ...prevState,
                                                                display_state: newValue?.title,
                                                                state: newValue?.value,
                                                                regionValues: newValue
                                                            }))
                                                            setBillingFormError((prevState) => ({
                                                                ...prevState,
                                                                display_state: "",
                                                                state: ""
                                                            }))
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
                                                    billingFormError?.state && <Typography className='form-error-lable field-error'>{billingFormError?.state}</Typography>
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
                                                            id='b_city'
                                                            value={guestBilling?.city}
                                                            error={billingFormError?.city ? true : false}
                                                            onChange={(e) => {
                                                                if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                    setGuestBilling((prevState) => ({
                                                                        ...prevState,
                                                                        city: e.target.value
                                                                    }))
                                                                    setBillingFormError((prevState) => ({
                                                                        ...prevState,
                                                                        city: ""
                                                                    }))
                                                                }
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                        />
                                                    </Stack>
                                                </FormControl>
                                                {
                                                    billingFormError?.city && <Typography className='form-error-lable field-error'>{billingFormError?.city}</Typography>
                                                }

                                            </Box>

                                            <Box className='input-block-section fullwidth'>
                                                <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
                                                <Stack className='form-address-form common_input_block_section'>
                                                    <TextField className='input-text'
                                                        name='zip_code'
                                                        id='b_zip_code'
                                                        value={guestBilling?.zip_code}
                                                        error={billingFormError?.zip_code ? true : false}
                                                        onChange={(e) => {
                                                            const re = /^[0-9\b]+$/;
                                                            if (e.target.value === '' || re.test(e.target.value)) {
                                                                setGuestBilling((prevState) => ({
                                                                    ...prevState,
                                                                    zip_code: e.target.value
                                                                }))
                                                                setBillingFormError((prevState) => ({
                                                                    ...prevState,
                                                                    zip_code: ""
                                                                }))
                                                            } else {
                                                                return false
                                                            }
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}
                                                    />
                                                    {
                                                        billingFormError?.zip_code && <Typography className='form-error-lable field-error'>{billingFormError?.zip_code}</Typography>
                                                    }
                                                </Stack>

                                            </Box>
                                        </Stack>

                                        <Stack className='form-block address-section-form fullwidth phone-section'>
                                            <Box className={`input-block-section phone-section ${billingFormError?.number ? 'show_error' : ''}`}>
                                                <Typography className="input_label ">Phone Number<Typography variant='span'>*</Typography></Typography>
                                                <Stack className='form-address-form common_input_block_section phone-number-section'>
                                                    <PhoneInput
                                                        country={'in'}
                                                        id="number"
                                                        name="b_number"
                                                        fullWidth
                                                        label="Mobile Number"
                                                        className={`drop_mobile_input input-text required`}
                                                        placeholder="Mobile number"
                                                        inputProps={{
                                                            label: "Mobile Number",
                                                            required: true,
                                                            name: 'phone',
                                                            open: true,
                                                        }
                                                        }
                                                        variant="outlined"
                                                        countryCodeEditable={false}
                                                        value={guestBilling?.number}
                                                        onChange={(e, value, event, formattedValue) => {
                                                            const re = /^[0-9\b]+$/;
                                                            if (e === '' || re.test(e)) {
                                                                setGuestBilling((prevState) => ({
                                                                    ...prevState,
                                                                    number: `+${e}`,
                                                                    mobile_valid: e.slice(value?.dialCode?.length)

                                                                }))
                                                                setBillingFormError((prevState) => ({
                                                                    ...prevState,
                                                                    number: ""
                                                                }))
                                                            } else {
                                                                return false
                                                            }
                                                        }}
                                                        onKeyDown={(e) => pressEnterCallFunction(e, addGuestNewBillingAddressHandler)}

                                                    />

                                                    {
                                                        billingFormError?.number && <Typography className='form-error-lable field-error'>{billingFormError?.number}</Typography>
                                                    }
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                {/* action buttons */}
                                <Stack className='payment-billing-address'>
                                    <Typography variant='span' className='cancel-btn-section'>
                                        <Button
                                            className='sforgot-password'
                                            onClick={() => {
                                                if (isClickedUpdate) {
                                                    dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
                                                    setShowBillingForm(false)
                                                } else if (showBillingForm && !guestBillingAddress?.first_name) {
                                                    dispatch(ACTION_GUESTSAMEASSHIPPINGBILLING(true))
                                                    setShowBillingForm(false)
                                                } else {
                                                    setIsEditBillingAddress(false)
                                                }
                                            }}
                                        >Cancel</Button>
                                    </Typography>
                                    <Box className='btn_block buynow'>
                                        <Button
                                            className='secondary_default_btn'
                                            onClick={() => {
                                                addGuestNewBillingAddressHandler()
                                            }}
                                        >Update</Button>
                                    </Box>
                                </Stack>
                            </>
                            : ''
                    }

                </Stack>
                <Stack className="payment-method-block-grid">
                    {
                        paymentInfoData?.[0]?.data?.payment_methods?.map((item, ind) => {
                            return (
                                <Box className='input-block' key={ind}>
                                    <FormControl>
                                        <Stack className="radio-btn-group">
                                            <Stack className="radio-section-group">
                                                <FormControlLabel
                                                    control={<Radio />}
                                                    value={item?.code}
                                                    onClick={() => {
                                                        dispatch(ACTION_SELECTED_PAYMENTMETHOD(item?.code));
                                                    }}
                                                    checked={selectedPaymentMethod == item?.code ? true : false}
                                                />
                                                {
                                                    item?.code == "razorpay" ? <img src={payment} alt="" title={item?.title} />
                                                        :
                                                        <Typography>{item?.title}</Typography>
                                                }
                                            </Stack>
                                        </Stack>
                                    </FormControl>
                                </Box>
                            )
                        })
                    }
                </Stack>
            </Stack>

        </Stack>

    )
}

export default Index;