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
 
  return (
    <Stack className='common-container order-success-container'>
      <Stack className='common-container'>
        <Box className="success-icon">
          <img src={OrderSuccessIcon} />
        </Box>
        <Typography variant='h2' className='title'>Thank You for Submitting your quote!</Typography>
        <Box className='info'>
          {/* <Typography>Thank You For Shopping</Typography> */}
          {/* <Typography>Your Product ID Is:
            <Typography variant='span' className='order-number'>{location?.state?.orderid}</Typography>
            
          </Typography>
          <Typography>Your product Name Is:
            <Typography variant='span' className='order-number'>{location?.state?.productDetails}</Typography>
            
          </Typography> */}
          <Typography>
            Our team will review your request and get in touch with you as soon as possible.
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