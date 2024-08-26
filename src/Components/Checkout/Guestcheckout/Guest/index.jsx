import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';
import './styles.scss';
import Tooltip from "../../../Tooltip";
import Question from "../../../../Assets/Clienticons/swaminathan-icons-16.svg";
import Eyepass from "../../../../Assets/Clienticons/swaminathan-icons-21.svg";
import EyeHide from "../../../../Assets/Clienticons/swaminathan-icons-20.svg";
import { isValidEmail, isEmptyValue, pressEnterCallFunction } from "../../../../Utilities/Utilities";
import { ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_GUESTSHIPPING } from "../../../../Store/action";
import { isExitedEmail, Action_Checkout_Login } from "../APIList";
import { useDispatch, useSelector } from 'react-redux';
import LoopIcon from '@mui/icons-material/Loop';

const Index = ({
  guestShipping, setGuestShipping, shippingFormError, setShippingFormError,
  addGuestNewAddressHandlerShipping, setIsShippingAddressChnaged
}) => {
  const dispatch = useDispatch();
  const { guestShippingAddress } = useSelector(state => {
    return {
      guestShippingAddress: state?.guestShippingAddress
    }
  })
  const [openMyAccount, setOpenMyaccount] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const [showPassword, setshowPassword] = useState(false)
  const [formValues, setFormValues] = useState({
    username: "",
    password: ""
  });
  const [formError, setFormError] = useState({
    username: "",
    password: ""
  });
  const verifyEmail = () => {
    var isError = false;
    // Email
    if (!formValues?.username) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Required field."
      }))
      var isError = true;
    } else if (!isEmptyValue(formValues?.username)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Empty spaces are not allowed."
      }))
      var isError = true;
    } else if (!isValidEmail(formValues?.username)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Please enter valid email."
      }))
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      if (validatePassword) {
        Action_Checkout_Login(formValues, dispatch, setFormValues, setOpenMyaccount)
      } else {
        isExitedEmail(dispatch, formValues?.username, setFormValues, setFormError, setValidatePassword)
      }
    }
  }
  useEffect(() => {
    if (guestShippingAddress?.email) {
      setFormValues((prevState) => ({
        ...prevState,
        username: guestShippingAddress?.email
      }))
    }
  }, [guestShippingAddress])
  return (
    <Stack className='guest-signin-section'>
      <Stack className='form-block'>
        <Box className='input-block'>
          <Typography className="input_label">Email<Typography variant='span'>*</Typography></Typography>
          <Stack className='form-address-form common_input_block_section'>
            <TextField className='input-text'
              name='guestemail'
              id='guestemail'
              value={guestShipping?.email}
              error={formError?.email ? true : false}
              onChange={(e) => {
                setIsShippingAddressChnaged(true)
                setGuestShipping((prevState) => ({
                  ...prevState,
                  email: e.target.value
                }))
                dispatch(ACTION_GUESTSHIPPING({
                  ...guestShippingAddress,
                  email: e.target.value
                }))
                setShippingFormError((prevState) => ({
                  ...prevState,
                  email: ""
                }))
                setFormValues((prevState) => ({
                  ...prevState,
                  username: e.target.value
                }))
                setFormError((prevState) => ({
                  ...prevState,
                  email: ""
                }))
              }}
              onKeyDown={(e) => {
                pressEnterCallFunction(e, verifyEmail)
              }}
              onBlur={() => {
                if (validatePassword) {
                  isExitedEmail(dispatch, formValues?.username, setFormValues, setFormError, setValidatePassword)
                } else {
                  verifyEmail()
                }
              }}
            />
            {
              shippingFormError?.email ?
                shippingFormError?.email && <Typography className='form-error-lable field-error'>{shippingFormError?.email}</Typography>
                :
                formError?.email && <Typography className='form-error-lable field-error'>{formError?.email}</Typography>
            }
            <div className='question-section'>
              <img src={Question} alt="" />
              <Box className='tool-display'><Tooltip value={"We'll send your order confirmation to this email"} /></Box>
            </div>
          </Stack>
        </Box>
        {
          !validatePassword ?
            <Typography className='account-after-checkout'>You can create an account after checkout.</Typography>
            : ''
        }
        {
          validatePassword ?
            <>
              <Box className='input-block password-section'>
                <Typography className="input_label">Password</Typography>
                <Stack className='form-address-form common_input_block_section'>
                  <Stack className='input-icon-section'>
                    <TextField className='input-text'
                      name='password'
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      error={formError?.password ? true : false}
                      value={formValues?.password}
                      onChange={(e) => {
                        setFormValues((prevState) => ({
                          ...prevState,
                          password: e.target.value
                        }))
                        setFormError((prevState) => ({
                          ...prevState,
                          password: ""
                        }))
                      }}
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                      onKeyDown={(e) => pressEnterCallFunction(e, verifyEmail)}
                    />
                    <div className='icon-section'>
                      <img src={showPassword ? Eyepass : EyeHide} alt=""
                        onClick={() => setshowPassword(!showPassword)}
                      />
                    </div>
                    {
                      formError?.password && <Typography className='form-error-lable field-error'>{formError?.password}</Typography>
                    }



                  </Stack>

                </Stack>
              </Box>
              <Typography className='account-with-us'>You already have an account with us. Sign in or continue as guest.</Typography>
              <Box className='checkout-signin-btn'>
                <Stack className='button-section'>
                  <Button className='login-button secondary_default_btn'
                    startIcon={rotate === true ? <LoopIcon /> : ""}
                    disabled={rotate === true ? true : false}
                    onClick={() => verifyEmail()}
                  >Sign In</Button>
                </Stack>
                <Typography
                  variant='span'
                  className='forgot-password'
                  onClick={() => {
                    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                      loginReg: false,
                      forgotPas: true,
                      resetPass: false
                    }))
                  }}
                >
                  Forgot Password?
                </Typography>
              </Box>
            </>
            : ''
        }
      </Stack>
    </Stack>
  )
}

export default Index;
