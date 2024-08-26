import { Button, Stack, Typography, Box } from '@mui/material';
import React, { useEffect } from 'react';
import "./styles.scss";
import OrderSuccessIcon from '../../../Assets/Order/OrderSuccessIcon.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACTION_GET_MINICARTDATA, ACTION_UPDATECART } from "../../../Store/action";
import { useDispatch } from 'react-redux';

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        if (location?.state?.info === "order") {
            dispatch(ACTION_GET_MINICARTDATA({
                code: 200,
                message: "You have no items in your shopping cart."
            }));
            dispatch(ACTION_UPDATECART());
        }
        if (location?.state?.orderid == null) {
            navigate("/")
        }
    }, [location?.state]);
    // GTM
    // useEffect(() => {
    //     window.dataLayer.push({
    //       event: "purchase",
    //       pagePath: window.location.pathname,
    
    //       ecommerce: {
    //         orderid: location?.state?.orderid,
    //         currency: location?.state?.productDetails?.total?.base_currency_code,
    //         subtotal: location?.state?.productDetails?.total?.subtotal,
    //         grandtotal: location?.state?.productDetails?.total?.grand_total,
    //         value:location?.state?.productDetails?.total?.grand_total,
    //         total:location?.state?.productDetails?.total?.grand_total,
    //         taxAmount: location?.state?.productDetails?.total?.tax_amount,
    //         discount_amount:
    //           location?.state?.productDetails?.total?.discount_amount,
    //         subtotalincludeTax:
    //           location?.state?.productDetails?.total?.subtotal_incl_tax,
    //           customerDetails: {
    //             firstName: location?.state.userDetails?.billing_address?.firstname ? location?.state.userDetails?.billing_address?.firstname:location?.state.userDetails?.firstname,
    //             lastName: location?.state.userDetails?.billing_address?.lastname ? location?.state.userDetails?.billing_address?.lastname:location?.state.userDetails?.lastname,
    //             Email: location?.state.userDetails?.billing_address?.email ? location?.state.userDetails?.billing_address?.email:location?.state?.userDetails?.email,
    //             Telephone: location?.state.userDetails?.billing_address?.telephone ?location?.state.userDetails?.billing_address?.telephone:location?.state.userDetails?.telephone,
    //             street: `${
    //               location?.state.userDetails?.billing_address?.street[0]
    //                 ? location.state.userDetails?.billing_address?.street[0] 
    //                 : location?.state?.userDetails?.street[0]
    //             }`,
    //             //  ${
    //             //   location?.state.userDetails?.billing_address?.street[1]
    //             //     ? location?.state?.userDetails?.billing_address?.street[1] 
    //             //     : location?.state?.userDetails?.street[1]
    //             // }`,
    //             city: location?.state?.userDetails?.billing_address?.city ?  location?.state?.userDetails?.billing_address?.city: location?.state?.userDetails?.city,
    //           },
    //           items: location?.state?.productDetails?.total?.items.map((item) => ({
    //             item_id: item?.product_id,
    //             item_sku:item?.sku,
    //             item_name: item?.name,
    //             item_category:item?.category_name,
    //             price: item?.price,
    //             quantity: item?.qty,

    //             // item_category:
    //           })),
    //       },
         
    //     });
    //   }, []);
    return (
        <Stack className='common-container order-success-container'>
            <Stack className='common-container'>
                <Box className="success-icon">
                    <img src={OrderSuccessIcon} />
                </Box>
                <Typography variant='h2' className='title'>Order Placed</Typography>
                <Box className='info'>
                    <Typography>Thank You For Shopping</Typography>
                    <Typography>Your Order Number Is:
                        <Typography variant='span' className='order-number'>{location?.state?.orderid}</Typography>
                    </Typography>
                    <Typography>
                        We'll Email You An Order Confirmation With Details And Tracking Info.
                    </Typography>
                </Box>
                <Box className='common_button_block'>
                    <Button className='primary_default_btn ' onClick={() => navigate("/")}>Continue Shopping</Button>
                </Box>
            </Stack>
        </Stack>
    )
}

export default Index;