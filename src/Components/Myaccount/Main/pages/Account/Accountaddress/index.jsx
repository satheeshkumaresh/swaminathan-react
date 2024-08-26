import { Box, Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import "./styles.scss";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Index = ({
    accountCurrentPage, getAaddress
}) => {
    const { loggedInUserData } = useSelector(state => {
        return {
            loggedInUserData: state?.loggedInUserData
        }
    })

    return (
        <Stack className="accountdata-page">
            <Box className="header page-title">{accountCurrentPage}</Box>
            <Stack className='block'>
                <Stack className='info-newsletter'>
                    <Box className='contact-info'>
                        <Typography variant='h4'>CONTACT INFORMATION</Typography>
                        <Box className='info-address'>
                            <Stack className='name-sec'>
                                {
                                    loggedInUserData?.firstname ? <Typography>{loggedInUserData?.firstname} </Typography> : ''
                                }
                                {
                                    loggedInUserData?.lastname ? <Typography>{loggedInUserData?.lastname},</Typography> : ''
                                }
                            </Stack>
                            {
                                loggedInUserData?.email ? <Typography>
                                    <a href={`mailto:${loggedInUserData?.email}`}>{loggedInUserData?.email}</a>
                                    ,</Typography> : ''
                            }
                            {
                                loggedInUserData?.mobile ? <Typography>
                                    <a href={`tel:${loggedInUserData?.mobile}`}>{loggedInUserData?.mobile}.</a>
                                </Typography> : ''
                            }
                        </Box>
                        {
                            loggedInUserData?.firstname || loggedInUserData?.lastname ||
                                loggedInUserData?.email || loggedInUserData?.mobile ?
                                <Stack className='edit-password'>
                                    <Box className='edit'><small>
                                        <Link to="/account/accountinformation">Edit</Link>
                                    </small></Box>
                                    <Box className='password'><small>
                                        <Link to="/account/accountinformation" state={{ from: { showPassword: true } }}>Change Password</Link>
                                    </small></Box>
                                </Stack>
                                : ''
                        }
                    </Box>
                    <Box className='newsletter'>
                        <Typography variant='h4' className='header'>NEWSLETTERS</Typography>
                        {
                            loggedInUserData?.is_subscriber ?
                                <Typography>You are subscribed to "General Subscription".</Typography>
                                :
                                <Typography>You aren't subscribed to our newsletter.</Typography>
                        }
                        <Typography className='subscribe'>
                            <small>
                                {
                                    loggedInUserData?.is_subscriber ?
                                        <Link to="/account/newsletter-subscription">Edit</Link>
                                        :
                                        <Link to="/account/newsletter-subscription">Edit</Link>
                                }
                            </small>
                        </Typography>
                    </Box>
                </Stack>
                <Divider />
                <Stack className='address-book'>
                    <Typography variant='h4' className='address-header'>ADDRESS BOOK</Typography>
                    <Stack className='billing-shipping'>
                        <Box className='billing'>
                            <Typography variant='h4'>DEFAULT BILLING ADDRESS</Typography>
                            {
                                getAaddress?.data?.billing_address?.length ?
                                    <>
                                        <Box className='info-address'>
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.firstname ?
                                                    <Typography>
                                                        {getAaddress?.data?.billing_address?.[0]?.firstname} &nbsp;
                                                        {getAaddress?.data?.billing_address?.[0]?.lastname ? getAaddress?.data?.billing_address?.[0]?.lastname : ''},
                                                    </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.streetaddress?.[0] ? <Typography>
                                                    {getAaddress?.data?.billing_address?.[0]?.streetaddress?.[0]},
                                                </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] ? <Typography>
                                                    {getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1]},
                                                </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.city ? <Typography>{getAaddress?.data?.billing_address?.[0]?.city} {getAaddress?.data?.billing_address?.[0]?.post_code},</Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.region ? <Typography>{getAaddress?.data?.billing_address?.[0]?.region},</Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.billing_address?.[0]?.country_name ? <Typography>{getAaddress?.data?.billing_address?.[0]?.country_name}.</Typography> : ''
                                            }
                                        </Box>
                                    </>
                                    :
                                    <Typography>You have not set a default billing address.</Typography>
                            }
                            {
                                getAaddress?.data?.billing_address?.length ?
                                    <>
                                        <Box className='edit'><small>
                                            <Link
                                                to="/account/addressbook/editbilling"
                                                state={{
                                                    addressId: getAaddress?.data?.billing_address?.[0]?.address_id
                                                }}
                                            >Edit Address</Link>
                                        </small></Box>
                                    </> :
                                    <>
                                        <Box className='edit'><small>
                                            <Link to="/account/addressbook">Add Address</Link>
                                        </small></Box>
                                    </>

                            }


                        </Box>
                        <Box className='shipping'>
                            <Typography variant='h4'>DEFAULT SHIPPING ADDRESS</Typography>
                            {
                                getAaddress?.data?.shipping_address?.length ?
                                    <>
                                        <Box className='info-address'>
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.firstname ?
                                                    <Typography>
                                                        {getAaddress?.data?.shipping_address?.[0]?.firstname} &nbsp;
                                                        {getAaddress?.data?.shipping_address?.[0]?.lastname},
                                                    </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0] ? <Typography>
                                                    {getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0]},
                                                </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] ? <Typography>
                                                    {getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1]},
                                                </Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.city ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.city} {getAaddress?.data?.shipping_address?.[0]?.post_code},</Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.region ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.region},</Typography> : ''
                                            }
                                            {
                                                getAaddress?.data?.shipping_address?.[0]?.country_name ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.country_name}.</Typography> : ''
                                            }
                                        </Box>
                                    </>
                                    :
                                    <Typography>You have not set a default shipping address.</Typography>
                            }
                            {
                                getAaddress?.data?.shipping_address?.length ?
                                    <>
                                        <Box className='edit'><small>
                                            <Link
                                                to="/account/addressbook/editshipping"
                                                state={{
                                                    addressId: getAaddress?.data?.shipping_address?.[0]?.address_id
                                                }}
                                            >Edit Address</Link>
                                        </small></Box>
                                    </> :
                                    <>
                                        <Box className='edit'><small>
                                            <Link to="/account/addressbook">Add Address</Link>
                                        </small></Box>
                                    </>
                            }

                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Index; 