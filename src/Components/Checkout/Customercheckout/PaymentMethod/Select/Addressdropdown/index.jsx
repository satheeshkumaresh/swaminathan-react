import React, { useState, useRef, useEffect } from 'react';
import "../styles.scss";
import { Box, Stack, Typography } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useSelector } from 'react-redux';

const Index = ({
    clsName, setNewEditAddressValues, data, setAddNewAddress,
    billing_address, addNewAddress
}) => {
    const { countries } = useSelector(state => {
        return {
            countries: state?.countries
        }
    })
    const [isActive, setisActive] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const ref = useRef();
    useEffect(() => {
        if (billing_address?.firstname) {
            setSelectedValue(`
            ${billing_address?.firstname} ${billing_address?.lastname},
            ${billing_address?.street?.[0] ? `${billing_address?.street?.[0]},` : ''}
            ${billing_address?.street?.[1] ? `${billing_address?.street?.[1]},` : ''}
            ${billing_address?.city} - ${billing_address?.postcode},
            ${billing_address?.region},
            ${billing_address?.country_name}
            `)
        } else {
            setSelectedValue(`
            ${data?.[0]?.firstname} ${data?.[0]?.lastname},
            ${data?.[0]?.streetaddress?.[0] ? `${data?.[0]?.streetaddress?.[0]},` : ''}
            ${data?.[0]?.streetaddress?.[1] ? `${data?.[0]?.streetaddress?.[1]},` : ''}
            ${data?.[0]?.city} - ${data?.[0]?.zip_code},
            ${data?.[0]?.region},
            ${data?.[0]?.country_name}
            `)
        }
    }, [data, billing_address])

    // setEstimate shipping
    useEffect(() => {
        if (addNewAddress) {
            const defaultCountry = countries?.filter((item) => item?.value == "IN");
            setNewEditAddressValues((prevState) => ({
                ...prevState,
                country: defaultCountry?.[0]?.value,
                display_country: defaultCountry?.[0]?.label
            }))
            setSelectedValue("New Address")
        }
    }, [addNewAddress])
    return (
        <ClickAwayListener onClickAway={() => setisActive(false)}>
            <Stack className={`form-select ${clsName}`}>
                <Box className='select-dropdown'>
                    <Box className='custom-dropdown' ref={ref}>
                        <Box className="dropdown-btn"
                            onClick={
                                () => {
                                    setisActive(!isActive)
                                }
                            }
                        >
                            <Typography variant='span' className='labelname'>
                                {selectedValue}
                            </Typography>
                            <Typography variant='span' className='drop-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.257" height="6.54" viewBox="0 0 12.257 6.54">
                                    <path id="_1acaf6b70816ed66265a220e44035b82" data-name="1acaf6b70816ed66265a220e44035b82" d="M.733.121a.446.446,0,0,0-.611,0,.446.446,0,0,0,0,.611L5.515,6.126.121,11.52a.446.446,0,0,0,0,.611.421.421,0,0,0,.306.126.421.421,0,0,0,.306-.126l5.681-5.7a.51.51,0,0,0,.126-.306.51.51,0,0,0-.126-.306Z" transform="translate(12.257) rotate(90)" />
                                </svg>
                            </Typography>
                        </Box>
                        {
                            isActive ?

                                <Box className="dropdown-content">
                                    {
                                        data?.map((item, ind) =>
                                            <Typography className='dropdown-item' value={item?.value} key={ind}
                                                onClick={
                                                    () => {
                                                        setAddNewAddress(false)
                                                        setSelectedValue(`
                                                        ${item?.firstname} ${item?.lastname},
                                                        ${item?.streetaddress?.[0] ? `${item?.streetaddress?.[0]},` : ''}
                                                        ${item?.streetaddress?.[1] ? `${item?.streetaddress?.[1]},` : ''}
                                                        ${item?.city} - ${item?.zip_code},
                                                        ${item?.region_id},
                                                        ${item?.country_name}
                                                        `)
                                                        setisActive(false)
                                                        setNewEditAddressValues((prevState) => ({
                                                            ...prevState,
                                                            first_name: item?.firstname,
                                                            last_name: item?.lastname,
                                                            address1: item?.streetaddress?.[0] ? item?.streetaddress?.[0] : '',
                                                            address2: item?.streetaddress?.[1] ? item?.streetaddress?.[1] : '',
                                                            display_country: item?.country_name,
                                                            country: item?.country_id,
                                                            display_state: item?.region,
                                                            state: item?.region_id,
                                                            regionValues: {
                                                                label: item?.region,
                                                                value: item?.region_id,
                                                            },
                                                            city: item?.city,
                                                            zip_code: item?.zip_code,
                                                            number: item?.phone,
                                                            mobile_valid: item?.phone,
                                                            DefaultShipping: "0",
                                                            DefaultBilling: "1",
                                                            customerAddressId: item?.address_id,
                                                        }))
                                                    }
                                                }
                                            >
                                                {item?.firstname} {item?.lastname},
                                                {item?.streetaddress?.[0] ? `${item?.streetaddress?.[0]},` : ''}
                                                {item?.streetaddress?.[1] ? `${item?.streetaddress?.[1]},` : ''}
                                                {item?.city}-{item?.zip_code},
                                                {item?.region},
                                                {item?.country_name}
                                            </Typography>)
                                    }
                                    <Typography
                                        className='dropdown-item'
                                        onClick={() => {
                                            setAddNewAddress(true)
                                            setisActive(false)
                                            setSelectedValue("New Address")
                                            setNewEditAddressValues((prevState) => ({
                                                ...prevState,
                                                first_name: "",
                                                last_name: "",
                                                address1: "",
                                                address2: "",
                                                display_state: "",
                                                state: "",
                                                regionValues: {
                                                    label: "",
                                                    value: "",
                                                },
                                                city: "",
                                                zip_code: "",
                                                number: "91",
                                                mobile_valid: "",
                                                saveInAddressBook: "",
                                                customerAddressId: null,
                                                same_as_billing: "0"
                                            }))
                                        }}
                                    >
                                        New Address
                                    </Typography>
                                </Box> : ''
                        }
                    </Box>
                </Box>
            </Stack>
        </ClickAwayListener>
    )
}

export default Index;