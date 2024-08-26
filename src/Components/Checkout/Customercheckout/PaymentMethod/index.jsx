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
import { ACTION_CUSTOMERSAMEASSHIPPING, ACTION_SELECTED_PAYMENTMETHOD } from "../../../../Store/action";
import { useDispatch, useSelector } from "react-redux";
import Addressdropdown from "./Select/Addressdropdown";
import { isValidNumber, pressEnterCallFunction, isValidCharacter } from "../../../../Utilities/Utilities";
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/material.css";

const Index = ({
    billingFormValues, setBillingFormValues, formErrorBilling, setFormErrorBilling,
    addNewAddressHandlerBilling, paymentInfoData, selectPaymentMethod,
    setSelectPaymentMethod, allAddress, getShippingBillingAddres, setDisablePlaceOrder,
    disablePlaceOrder, sameAsShippingHandler, isClickedUpdate, setIsClickedUpdate,
    isUncheked, setIsUncheked
}) => {
    const dispatch = useDispatch();
    const { countries, states, customerSameAsShipping, selectedPaymentMethod } = useSelector(state => {
        return {
            countries: state?.countries,
            states: state?.states,
            customerSameAsShipping: state?.customerSameAsShipping,
            selectedPaymentMethod: state?.selectedPaymentMethod
        }
    })
    const [showBillingForm, setShowBillingForm] = useState(false);
    const [showMoreAddressDropDown, setShowMoreAddressDropDown] = useState(false);
    const [addNewAddress, setAddNewAddress] = useState(false);

    const sameAsBillingShippingHandler = () => {
        dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
        setFormErrorBilling((prevState) => ({
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
        }))
    }

    useEffect(() => {
        if (selectedPaymentMethod !== null && selectedPaymentMethod !== undefined && selectedPaymentMethod !== "") {
            setSelectPaymentMethod(selectedPaymentMethod)
        } else {
            setSelectPaymentMethod(paymentInfoData?.[0]?.data?.payment_methods?.[0]?.code)
            dispatch(ACTION_SELECTED_PAYMENTMETHOD(paymentInfoData?.[0]?.data?.payment_methods?.[0]?.code));
        }
    }, [paymentInfoData?.[0]?.data?.payment_methods, selectedPaymentMethod]);

    // payment method conditional rendering
    useEffect(() => {
        if (
            (getShippingBillingAddres?.data?.billing_address?.customer_address_id ==
                getShippingBillingAddres?.data?.shipping_address?.customer_address_id) &&
            (getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null &&
                getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null)
        ) {
            setShowBillingForm(false);
            setShowMoreAddressDropDown(true);
            setAddNewAddress(false);
        } else {
            if (isUncheked) {
                setShowMoreAddressDropDown(true)
                setAddNewAddress(true)
            } else {
                if (
                    (getShippingBillingAddres?.data?.billing_address?.customer_address_id ==
                        getShippingBillingAddres?.data?.shipping_address?.customer_address_id) &&
                    (getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null &&
                        getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null)
                ) {
                    setShowBillingForm(false);
                    setShowMoreAddressDropDown(true);
                    setAddNewAddress(false);
                } else {
                    if (getShippingBillingAddres?.data?.billing_address?.firstname) {
                        setShowBillingForm(false);
                        setShowMoreAddressDropDown(false);
                        setAddNewAddress(false);
                    } else if (!customerSameAsShipping && !getShippingBillingAddres?.data?.billing_address?.firstname) {
                        setShowBillingForm(true);
                        setShowMoreAddressDropDown(false);
                        setAddNewAddress(false);
                    }
                }
            }
        }
    }, [getShippingBillingAddres, customerSameAsShipping, isUncheked])
    useEffect(() => {
        if (customerSameAsShipping) {
            setShowBillingForm(false);
            setDisablePlaceOrder(false)
        }
        if (!customerSameAsShipping) {
            if (showBillingForm || addNewAddress || showMoreAddressDropDown) {
                setDisablePlaceOrder(true)
            } else {
                setDisablePlaceOrder(false)
            }
        }
    }, [showBillingForm, addNewAddress, customerSameAsShipping, showMoreAddressDropDown])
    return (
        <Stack className="payment-method-table-section payment-method-list-section">

            <Stack className='payment-method-list'>
                <Stack className='payment-method-section-title'>
                    <Typography className='payment-title' variant='h4'>Payment Method</Typography>
                </Stack>
                <Stack className='form-block address-section-form fullwidth checkbox-section'>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="My billing and shipping address are the same"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    sameAsBillingShippingHandler()
                                } else {
                                    dispatch(ACTION_CUSTOMERSAMEASSHIPPING(false))
                                    if (
                                        (getShippingBillingAddres?.data?.billing_address?.customer_address_id ==
                                            getShippingBillingAddres?.data?.shipping_address?.customer_address_id) &&
                                        (getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null &&
                                            getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null)
                                    ) {
                                        setBillingFormValues((prevState) => ({
                                            ...prevState,
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
                                            saveInAddressBook: ""
                                        }))
                                    }
                                    else {
                                        if (isClickedUpdate) {
                                            setIsUncheked(true)
                                        }
                                    }
                                }
                            }}
                            checked={customerSameAsShipping ? true : false}
                        />
                    </FormGroup>
                    {
                        !customerSameAsShipping ?
                            <Stack className="update-billing-address-section">
                                {
                                    getShippingBillingAddres?.data?.all_address?.length && showMoreAddressDropDown ?
                                        <Stack className='form-block address-section-form update-address-section'>
                                            <Box className='input-block-section fullwidth'>
                                                <FormControl>
                                                    <Addressdropdown
                                                        clsName="sortby-plp select-options-box"
                                                        data={getShippingBillingAddres?.data?.all_address}
                                                        appyShow="sort"
                                                        setNewEditAddressValues={setBillingFormValues}
                                                        setAddNewAddress={setAddNewAddress}
                                                        addNewAddress={addNewAddress}
                                                        billing_address={getShippingBillingAddres?.data?.billing_address}
                                                    />
                                                </FormControl>
                                            </Box>
                                        </Stack>
                                        : ''
                                }
                                {
                                    showBillingForm || addNewAddress ?
                                        <Stack className='billing-address-form-block-section'>
                                            <Stack className='form-block address-section-form'>
                                                <Box className='input-block-section fullwidth'>
                                                    <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
                                                    <Stack className='form-address-form common_input_block_section'>
                                                        <TextField
                                                            className='input-text'
                                                            name='first_name'
                                                            id='b_first_name'
                                                            value={billingFormValues?.first_name}
                                                            error={formErrorBilling?.first_name ? true : false}
                                                            onChange={(e) => {
                                                                if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
                                                                        first_name: e.target.value
                                                                    }))
                                                                    setFormErrorBilling((prevState) => ({
                                                                        ...prevState,
                                                                        first_name: ""
                                                                    }))
                                                                }
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                        />
                                                        {
                                                            formErrorBilling?.first_name && <Typography className='form-error-lable field-error'>{formErrorBilling?.first_name}</Typography>
                                                        }
                                                    </Stack>

                                                </Box>

                                                <Box className='input-block-section fullwidth'>
                                                    <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
                                                    <Stack className='form-address-form common_input_block_section'>

                                                        <TextField className='input-text common_input_block_section'
                                                            name='last_name'
                                                            id='b_last_name'
                                                            value={billingFormValues?.last_name}
                                                            error={formErrorBilling?.last_name ? true : false}
                                                            onChange={(e) => {
                                                                if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
                                                                        last_name: e.target.value
                                                                    }))
                                                                    setFormErrorBilling((prevState) => ({
                                                                        ...prevState,
                                                                        last_name: ""
                                                                    }))
                                                                }
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                        />
                                                        {
                                                            formErrorBilling?.last_name && <Typography className='form-error-lable field-error'>{formErrorBilling?.last_name}</Typography>
                                                        }
                                                    </Stack>

                                                </Box>
                                            </Stack>
                                            <Stack className='form-block address-section-form fullwidth'>
                                                <Box className='input-block-section'>
                                                    <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
                                                    <Stack className='form-address-form common_input_block_section state-section address-section-block'>

                                                        <TextField className='input-text required-field common_input_block_section '
                                                            name='address1'
                                                            id='b_address1'
                                                            error={formErrorBilling?.address1 ? true : false}
                                                            value={billingFormValues?.address1}
                                                            onChange={(e) => {
                                                                setBillingFormValues((prevState) => ({
                                                                    ...prevState,
                                                                    address1: e.target.value
                                                                }))
                                                                setFormErrorBilling((prevState) => ({
                                                                    ...prevState,
                                                                    address1: ""
                                                                }))
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                        />
                                                        {
                                                            formErrorBilling?.address1 && <Typography className='form-error-lable field-error address1-error'>{formErrorBilling?.address1}</Typography>
                                                        }

                                                        <TextField className='input-text secondary-street '
                                                            name='address2'
                                                            id='b_address2'
                                                            error={formErrorBilling?.address2 ? true : false}
                                                            value={billingFormValues?.address2}
                                                            onChange={(e) => {
                                                                setBillingFormValues((prevState) => ({
                                                                    ...prevState,
                                                                    address2: e.target.value
                                                                }))
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
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
                                                            value={billingFormValues?.display_country}
                                                            name="state_dropdown_list"
                                                            error={formErrorBilling?.country ? true : false}
                                                            onChange={(event, newValue) => {
                                                                setBillingFormValues((prevState) => ({
                                                                    ...prevState,
                                                                    display_country: newValue?.label,
                                                                    country: newValue?.value
                                                                }))
                                                                setFormErrorBilling((prevState) => ({
                                                                    ...prevState,
                                                                    display_country: "",
                                                                    country: ""
                                                                }))
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
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
                                                            formErrorBilling?.country && <Typography className='form-error-lable field-error'>{formErrorBilling?.country}</Typography>
                                                        }
                                                    </FormControl>

                                                </Box>

                                                <Box className={`input-block select input-block-section select fullwidth ${formErrorBilling?.state ? 'show_error' : ''}`}>
                                                    <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
                                                    <FormControl >
                                                        <Autocomplete
                                                            id="states"
                                                            className="sortby-plp select-options-box state-options autocomplete-dropdown"
                                                            value={billingFormValues?.regionValues}
                                                            name="state_dropdown_list"
                                                            error={formErrorBilling?.state ? true : false}
                                                            onChange={(event, newValue) => {
                                                                setBillingFormValues((prevState) => ({
                                                                    ...prevState,
                                                                    display_state: newValue?.title,
                                                                    state: newValue?.value,
                                                                    regionValues: newValue
                                                                }))
                                                                setFormErrorBilling((prevState) => ({
                                                                    ...prevState,
                                                                    display_state: "",
                                                                    state: ""
                                                                }))
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
                                                            formErrorBilling?.state && <Typography className='form-error-lable field-error'>{formErrorBilling?.state}</Typography>
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
                                                                id='b_city'
                                                                error={formErrorBilling?.city ? true : false}
                                                                value={billingFormValues?.city}
                                                                onChange={(e) => {
                                                                    if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                                                        setBillingFormValues((prevState) => ({
                                                                            ...prevState,
                                                                            city: e.target.value
                                                                        }))
                                                                        setFormErrorBilling((prevState) => ({
                                                                            ...prevState,
                                                                            city: ""
                                                                        }))
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                            />
                                                            {
                                                                formErrorBilling?.city && <Typography className='form-error-lable field-error'>{formErrorBilling?.city}</Typography>
                                                            }
                                                        </Stack>

                                                    </FormControl>

                                                </Box>

                                                <Box className='input-block-section fullwidth'>
                                                    <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
                                                    <Stack className='form-address-form common_input_block_section'>

                                                        <TextField className='input-text'
                                                            name='zip_code'
                                                            id='b_zip_code'
                                                            error={formErrorBilling?.zip_code ? true : false}
                                                            value={billingFormValues?.zip_code}
                                                            onChange={(e) => {
                                                                if (e.target.value === '' || isValidNumber(e.target.value)) {
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
                                                                        zip_code: e.target.value
                                                                    }))
                                                                    setFormErrorBilling((prevState) => ({
                                                                        ...prevState,
                                                                        zip_code: ""
                                                                    }))
                                                                }
                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                        />
                                                        {
                                                            formErrorBilling?.zip_code && <Typography className='form-error-lable field-error'>{formErrorBilling?.zip_code}</Typography>
                                                        }
                                                    </Stack>

                                                </Box>
                                            </Stack>

                                            <Stack className='form-block address-section-form fullwidth'>
                                                <Box className={`input-block-section phone-section ${formErrorBilling?.number ? 'show_error' : ''}`}>
                                                    <Typography className="input_label ">Phone Number<Typography variant='span'>*</Typography></Typography>
                                                    <Stack className='form-address-form common_input_block_section'>
                                                        <PhoneInput
                                                            country={'in'}
                                                            id="b_number"
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
                                                            }
                                                            }
                                                            countryCodeEditable={false}
                                                            variant="outlined"
                                                            value={billingFormValues?.number}
                                                            onChange={(e, value, event, formattedValue) => {
                                                                const re = /^[0-9\b]+$/;
                                                                if (e === '' || isValidNumber(e)) {
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
                                                                        number: `+${e}`,
                                                                        mobile_valid: e.slice(value?.dialCode?.length)

                                                                    }))
                                                                    setFormErrorBilling((prevState) => ({
                                                                        ...prevState,
                                                                        number: ""
                                                                    }))
                                                                } else {
                                                                    return false
                                                                }

                                                            }}
                                                            onKeyDown={(e) => pressEnterCallFunction(e, addNewAddressHandlerBilling)}
                                                        />
                                                        {
                                                            formErrorBilling?.number && <Typography className='form-error-lable field-error'>{formErrorBilling?.number}</Typography>
                                                        }
                                                    </Stack>

                                                </Box>
                                            </Stack>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="Save in address book"
                                                    onChange={(e) => {
                                                        if (e.target.checked == true) {
                                                            setBillingFormValues((prevState) => ({
                                                                ...prevState,
                                                                saveInAddressBook: 1
                                                            }))
                                                        } else {
                                                            setBillingFormValues((prevState) => ({
                                                                ...prevState,
                                                                saveInAddressBook: 0
                                                            }))
                                                        }
                                                    }}
                                                    checked={billingFormValues?.saveInAddressBook == "1" ? true : false}
                                                />
                                            </FormGroup>
                                        </Stack>
                                        : ''
                                }
                                {
                                    showBillingForm || showMoreAddressDropDown || addNewAddress ?
                                        <Stack className='payment-billing-address'>
                                            <Typography variant='span' className='cancel-btn-section'>
                                                <Button
                                                    className='sforgot-password'
                                                    onClick={() => {
                                                        setFormErrorBilling((prevState) => ({
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
                                                        }))
                                                        if (
                                                            isClickedUpdate ||
                                                            (getShippingBillingAddres?.data?.billing_address?.customer_address_id ==
                                                                getShippingBillingAddres?.data?.shipping_address?.customer_address_id) &&
                                                            (getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null &&
                                                                getShippingBillingAddres?.data?.shipping_address?.customer_address_id !== null)
                                                        ) {
                                                            dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
                                                            setShowMoreAddressDropDown(false)
                                                            setAddNewAddress(false)
                                                        } else {
                                                            if (addNewAddress) {
                                                                setAddNewAddress(false)
                                                                setShowBillingForm(false);
                                                                setShowMoreAddressDropDown(false);
                                                            } else if (showMoreAddressDropDown) {
                                                                setShowMoreAddressDropDown(false);
                                                            } else {
                                                                if (getShippingBillingAddres?.data?.billing_address?.firstname) {
                                                                    setShowBillingForm(false);
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
                                                                        first_name: "",
                                                                        last_name: "",
                                                                        address1: "",
                                                                        address2: "",
                                                                        display_state: "",
                                                                        state: "",
                                                                        city: "",
                                                                        zip_code: "",
                                                                        number: "",
                                                                        mobile_valid: "",
                                                                        saveInAddressBook: ""
                                                                    }))
                                                                } else {
                                                                    dispatch(ACTION_CUSTOMERSAMEASSHIPPING(true))
                                                                    setShowBillingForm(false);
                                                                    setBillingFormValues((prevState) => ({
                                                                        ...prevState,
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
                                                                        saveInAddressBook: ""
                                                                    }))
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >Cancel</Button>
                                            </Typography>
                                            <Box className='btn_block buynow'>
                                                <Button
                                                    className='secondary_default_btn'
                                                    onClick={() => {
                                                        setIsUncheked(false)
                                                        setIsClickedUpdate(false)
                                                        addNewAddressHandlerBilling()
                                                    }}
                                                >Update</Button>
                                            </Box>
                                        </Stack>
                                        : ''
                                }
                            </Stack>
                            : ''
                    }

                    {
                        getShippingBillingAddres?.data?.billing_address?.firstname && !showBillingForm &&
                            !customerSameAsShipping && !showMoreAddressDropDown && !addNewAddress ?
                            <Box className='billing_address'>
                                <Box className='info-address'>
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.firstname ?
                                            <Typography>
                                                {getShippingBillingAddres?.data?.billing_address?.firstname}
                                                {getShippingBillingAddres?.data?.billing_address?.lastname ? " " : ''}
                                                {getShippingBillingAddres?.data?.billing_address?.lastname},
                                            </Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.street?.[0] ? <Typography>
                                            {getShippingBillingAddres?.data?.billing_address?.street?.[0]},
                                        </Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.street?.[1] ? <Typography>
                                            {getShippingBillingAddres?.data?.billing_address?.street?.[1]},
                                        </Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.city || getShippingBillingAddres?.data?.billing_address?.postcode ?
                                            <Typography>
                                                {getShippingBillingAddres?.data?.billing_address?.city}
                                                {`${getShippingBillingAddres?.data?.billing_address?.postcode ? '-' : ''}`}
                                                {getShippingBillingAddres?.data?.billing_address?.postcode},
                                            </Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.region ?
                                            <Typography>{getShippingBillingAddres?.data?.billing_address?.region},</Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.country_name ?
                                            <Typography>{getShippingBillingAddres?.data?.billing_address?.country_name}.</Typography> : ''
                                    }
                                    {
                                        getShippingBillingAddres?.data?.billing_address?.telephone ?
                                            <Typography>Phone:&nbsp;
                                                <a href={`tel:${getShippingBillingAddres?.data?.billing_address?.telephone}`}>
                                                    {getShippingBillingAddres?.data?.billing_address?.telephone}
                                                </a>
                                            </Typography> : ''
                                    }
                                </Box>
                                <Box
                                    className='edit'
                                    onClick={() => {
                                        setIsUncheked(false)
                                        setIsClickedUpdate(false)
                                        if (
                                            getShippingBillingAddres?.data?.billing_address?.customer_address_id !== null &&
                                            getShippingBillingAddres?.data?.all_address?.length
                                        ) {
                                            setShowMoreAddressDropDown(true);
                                            setAddNewAddress(false)
                                            setShowBillingForm(false);
                                        } else {
                                            if (getShippingBillingAddres?.data?.billing_address?.firstname) {
                                                setBillingFormValues((prevState) => ({
                                                    ...prevState,
                                                    first_name: getShippingBillingAddres?.data?.billing_address?.firstname,
                                                    last_name: getShippingBillingAddres?.data?.billing_address?.lastname,
                                                    address1: getShippingBillingAddres?.data?.billing_address?.street?.[0],
                                                    address2: getShippingBillingAddres?.data?.billing_address?.street?.[1],
                                                    display_country: getShippingBillingAddres?.data?.billing_address?.country_name,
                                                    country: getShippingBillingAddres?.data?.billing_address?.country_id,
                                                    display_state: getShippingBillingAddres?.data?.billing_address?.region,
                                                    state: getShippingBillingAddres?.data?.billing_address?.region_id,
                                                    regionValues: {
                                                        label: getShippingBillingAddres?.data?.billing_address?.region !== null ? getShippingBillingAddres?.data?.billing_address?.region : '',
                                                        value: getShippingBillingAddres?.data?.billing_address?.region_id !== null ? getShippingBillingAddres?.data?.billing_address?.region_id : ''
                                                    },
                                                    city: getShippingBillingAddres?.data?.billing_address?.city,
                                                    zip_code: getShippingBillingAddres?.data?.billing_address?.postcode,
                                                    number: getShippingBillingAddres?.data?.billing_address?.telephone,
                                                    mobile_valid: getShippingBillingAddres?.data?.billing_address?.telephone,
                                                    saveInAddressBook: getShippingBillingAddres?.data?.billing_address?.save_in_address_book,
                                                    customerAddressId: getShippingBillingAddres?.data?.billing_address?.customer_address_id,
                                                }))
                                                setAddNewAddress(true)
                                                setShowMoreAddressDropDown(true);
                                                setShowBillingForm(false);
                                            } else {
                                                if (getShippingBillingAddres?.data?.all_address?.length) {
                                                    setShowMoreAddressDropDown(true);
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <small>Edit Address</small>
                                </Box>
                            </Box>
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

        </Stack >

    )
}

export default Index;