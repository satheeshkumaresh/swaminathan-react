import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";
import { Stack, Box, Typography, Button, TextField, Divider } from '@mui/material';
import Google from '../../../Assets/userauth/google.png';
import { isValidEmail, isValidPassword, isEmptyValue, pressEnterCallFunction, isValidCharacter } from "../../../Utilities/Utilities";
import {
  ACTION_ACTIONMESSAGE, ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_PAGELOADER,
  ACTION_CARTDATA_ADDRESS, ACTION_TOKEN, ACTION_USERDATA, ACTION_ISLOGGEDUSER,
  getCustomerQuoteId, ACTION_IS_ORDER_COMPLETE
} from "../../../Store/action";
import { useDispatch, useSelector } from 'react-redux';
import Recaptcha from 'react-google-invisible-recaptcha';
import { recaptchaKey } from "../../../Utilities/Constant";
import LoopIcon from '@mui/icons-material/Loop';
import Model from "../../../Components/Model";
import Eyepass from "../../../Assets/Clienticons/swaminathan-icons-21.svg";
import EyeHide from "../../../Assets/Clienticons/swaminathan-icons-20.svg";
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { customer, baseUrl } from "../../../Utilities/Constant";

// Login API
const Action_Login = async (userData, dispatch, setFormValues, navigate, setIsValidRecaptcha) => {
  dispatch(ACTION_PAGELOADER(true))
  dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
    loginReg: false,
    forgotPas: false,
    resetPass: false
  }))
  try {
    const Response = await axios.post(`${customer()}logincustomer`, userData);
    dispatch(ACTION_CARTDATA_ADDRESS({
      address: {
        countryId: "",
        display_country: "",
        postcode: "",
        region: "",
        region_id: ""
      },
      shippingMethod: {}
    }))
    dispatch(ACTION_PAGELOADER(false));
    if (Response?.data[0]?.code === 200) {
      setFormValues((prevState) => ({
        ...prevState,
        username: "",
        password: ""
      }))
      dispatch(ACTION_IS_ORDER_COMPLETE({
        orderId: "",
        isCancel: false
      }));
      setIsValidRecaptcha(false);
      dispatch(ACTION_TOKEN(Response?.data[0]?.token))
      dispatch(ACTION_USERDATA(Response?.data[0]?.customer_data))
      dispatch(ACTION_ISLOGGEDUSER(true))
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: true,
        isWarning: false,
        isError: false,
        title: "Login",
        message: Response?.data[0]?.message,
        showPopup: true,
        redirect: "/"
      }))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      getCustomerQuoteId(dispatch, Response?.data[0]?.token, true)
    } else {
      dispatch(ACTION_PAGELOADER(false))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: false,
        isError: true,
        title: "Login failed",
        message: Response?.data[0]?.message,
        showPopup: true
      }))
    }
  } catch (err) {
    console.log(err)
    dispatch(ACTION_PAGELOADER(false))
    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
      loginReg: false,
      forgotPas: false,
      resetPass: false
    }))
  }
}
// RegistrationAPI
const Action_Register = async (formValues, dispatch, setFormValues, navigate, setIsValidRecaptcha) => {
  dispatch(ACTION_PAGELOADER(true))
  dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
    loginReg: false,
    forgotPas: false,
    resetPass: false
  }))
  try {
    const data = {
      customer: {
        firstname: formValues?.firstname,
        lastname: formValues?.lastname,
        email: formValues?.email,
        store_id: formValues?.store_id,
        website_id: formValues?.website_id,
        group_id: formValues?.group_id,
        mobile: formValues?.mobile?.length == formValues?.countryCode?.length + 1 ? "" : formValues?.mobile,
        password: formValues?.password,
        confirm_password: formValues?.confirm_password
      }
    }
    const Response = await axios.post(`${customer()}customer/create`, data);
    dispatch(ACTION_PAGELOADER(false))
    if (Response?.data[0]?.status === true) {
      setFormValues((prevState) => ({
        ...prevState,
        firstname: "",
        lastname: "",
        email: "",
        store_id: 1,
        website_id: 1,
        group_id: 1,
        mobile: "",
        password: "",
        confirm_password: ""
      }))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      setIsValidRecaptcha(false);
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: true,
        isWarning: false,
        isError: false,
        title: "Registration",
        message: Response?.data[0]?.message,
        showPopup: true,
        redirect: "/"
      }))
    } else {
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: false,
        isError: true,
        title: "Registration failed",
        message: Response?.data[0]?.message,
        showPopup: true
      }))
    }
  } catch (err) {
    console.log(err)
    dispatch(ACTION_PAGELOADER(false))
  }
}
// Google signin
const Action_Google_Login = async (userData, dispatch, setFormValues, navigate, setIsValidRecaptcha) => {
  dispatch(ACTION_PAGELOADER(true))
  dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
    loginReg: false,
    forgotPas: false,
    resetPass: false
  }))
  try {
    const loginData = {
      data: userData
    }
    const Response = await axios.post(`${baseUrl()}socialLogin`, loginData);
    dispatch(ACTION_CARTDATA_ADDRESS({
      address: {
        countryId: "",
        display_country: "",
        postcode: "",
        region: "",
        region_id: ""
      },
      shippingMethod: {}
    }))
    dispatch(ACTION_PAGELOADER(false));
    if (Response?.data[0]?.code === 200) {
      setFormValues((prevState) => ({
        ...prevState,
        username: "",
        password: ""
      }))
      setIsValidRecaptcha(false);
      dispatch(ACTION_IS_ORDER_COMPLETE({
        orderId: "",
        isCancel: false
      }));
      dispatch(ACTION_TOKEN(Response?.data[0]?.token))
      dispatch(ACTION_USERDATA(Response?.data[0]?.customer_data))
      dispatch(ACTION_ISLOGGEDUSER(true))
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: true,
        isWarning: false,
        isError: false,
        title: Response?.data[0]?.title,
        message: Response?.data[0]?.message,
        showPopup: true,
        redirect: "/"
      }))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      getCustomerQuoteId(dispatch, Response?.data[0]?.token, true)
    } else {
      dispatch(ACTION_PAGELOADER(false))
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: false,
        isError: true,
        title: "Login failed",
        message: Response?.data[0]?.message,
        showPopup: true
      }))
    }
  } catch (err) {
    console.log(err)
    dispatch(ACTION_PAGELOADER(false))
    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
      loginReg: false,
      forgotPas: false,
      resetPass: false
    }))
  }
}

const Index = ({ formValues, setFormValues, loginFormValues, setLoginFormValues, headerData }) => {
  const { showAuthencationPopup } = useSelector(state => {
    return {
      showAuthencationPopup: state?.showAuthencationPopup
    }
  })
  const [open, setOpen] = useState(true);
  const [loginShowPass, setLoginShowPass] = useState(false)
  const [regShowPass, setRegShowPass] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isValidRecaptcha, setIsValidRecaptcha] = useState(false);
  const recaptcha = useRef(null)
  const focusPopup = useRef();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${access_token}` } },
      );
      Action_Google_Login(userInfo?.data, dispatch, setLoginFormValues, navigate, setIsValidRecaptcha);
    },
    onError: () => {
      dispatch(ACTION_ACTIONMESSAGE({
        isSuccess: false,
        isWarning: false,
        isError: true,
        title: "Login",
        message: "Google login failed",
        showPopup: true
      }))
    }
  });
  const [loginFormError, setLoginFormError] = useState({
    username: "",
    password: ""
  });

  const [formError, setFormError] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    mobile_valid: "",
    password: "",
    confirm_password: ""
  });

  const onResolved = () => {
    setIsValidRecaptcha(true)
  }
  const handleSubmit = () => {
    var isError = false;
    // Password
    if (!loginFormValues?.password) {
      setLoginFormError((prevState) => ({
        ...prevState,
        password: "Required field."
      }))
      document.getElementById("loginpassword")?.focus();
      var isError = true;
    } else if (!isEmptyValue(loginFormValues?.password)) {
      setLoginFormError((prevState) => ({
        ...prevState,
        password: "Empty spaces are not allowed."
      }))
      document.getElementById("loginpassword")?.focus();
      var isError = true;
    }
    // Username
    if (!loginFormValues?.username) {
      setLoginFormError((prevState) => ({
        ...prevState,
        username: "Required field."
      }))
      document.getElementById("loginemail")?.focus();
      var isError = true;
    } else if (!isEmptyValue(loginFormValues?.username)) {
      setLoginFormError((prevState) => ({
        ...prevState,
        username: "Empty spaces are not allowed."
      }))
      document.getElementById("loginemail")?.focus();
      var isError = true;
    } else if (!isValidEmail(loginFormValues?.username)) {
      setLoginFormError((prevState) => ({
        ...prevState,
        username: "Please enter a valid email address"
      }))
      document.getElementById("loginemail")?.focus();
      var isError = true;
    }
    // recaptcha
    if (isValidRecaptcha !== true) {
      setLoginFormError((prevState) => ({
        ...prevState,
        password: "Recaptcha error"
      }))
      var isError = true;
    }

    // Final valiation
    if (!isError && isValidRecaptcha === true) {
      Action_Login(loginFormValues, dispatch, setLoginFormValues, navigate, setIsValidRecaptcha)
    }
  }
  const submitHandler = () => {
    var isError = false;
    // confirm password
    if (!formValues?.confirm_password) {
      setFormError((prevState) => ({
        ...prevState,
        confirm_password: "Required field."
      }))
      document.getElementById("confirm-password")?.focus();
      var isError = true;
    } else if (formValues?.confirm_password?.length < 6) {
      setFormError((prevState) => ({
        ...prevState,
        confirm_password: "Please enter minimum 6 characters."
      }))
      document.getElementById("confirm-password")?.focus();
      var isError = true;
    } else if (!isValidPassword(formValues?.confirm_password)) {
      setFormError((prevState) => ({
        ...prevState,
        confirm_password: "Please enter strong password like (Test@123) without space."
      }))
      document.getElementById("confirm-password")?.focus();
      var isError = true;
    }
    if ((formValues?.password) !== (formValues?.confirm_password)) {
      setFormError((prevState) => ({
        ...prevState,
        confirm_password: "Password and confirm password should be same."
      }))
      document.getElementById("confirm-password")?.focus();
      var isError = true;
    }
    // password
    if (!formValues?.password) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Required field."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.password)) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Empty spaces are not allowed."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    } else if (formValues?.password?.length < 8) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Please enter minimum 8 characters."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    } else if (!isValidPassword(formValues?.password)) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Please enter strong password like (Test@123) without space."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    }
    // mobile
    if (!formValues?.mobile_valid) {
      setFormError((prevState) => ({
        ...prevState,
        mobile: "Required field."
      }))
      document.getElementById("number")?.focus();
      var isError = true;
    } else if (formValues?.mobile_valid?.length > 0) {
      if (formValues?.mobile_valid?.length < 6 || formValues?.mobile_valid?.length > 15) {
        setFormError((prevState) => ({
          ...prevState,
          mobile: "Please enter minimum 6 to 15 digit phone number."
        }))
        document.getElementById("number")?.focus();
        var isError = true;
      } else if (!isEmptyValue(formValues?.mobile)) {
        setFormError((prevState) => ({
          ...prevState,
          mobile: "Empty spaces are not allowed."
        }))
        document.getElementById("number")?.focus();
        var isError = true;
      }

    }
    // email
    if (!formValues?.email) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Required field."
      }))
      document.getElementById("email")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.email)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Empty spaces are not allowed."
      }))
      document.getElementById("email")?.focus();
      var isError = true;
    } else if (!isValidEmail(formValues?.email)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Please enter a valid email address"
      }))
      document.getElementById("email")?.focus();
      var isError = true;
    }
    // last name
    if (!formValues?.lastname) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Required field."
      }))
      document.getElementById("l-name")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.lastname)) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Empty spaces are not allowed."
      }))
      document.getElementById("l-name")?.focus();
      var isError = true;
    }
    // first name
    if (!formValues?.firstname) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Required field."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.firstname)) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Empty spaces are not allowed."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
    }
    // recaptcha
    if (isValidRecaptcha !== true) {
      setFormError((prevState) => ({
        ...prevState,
        confirm_password: "Recaptcha error"
      }))
      var isError = true;
    }

    // Final valiation
    if (!isError && isValidRecaptcha === true) {
      Action_Register(formValues, dispatch, setFormValues, navigate, setIsValidRecaptcha)
    }
  }
  const clearValues = () => {
    setFormValues((prevState) => ({
      ...prevState,
      firstname: "",
      lastname: "",
      email: "",
      store_id: 1,
      website_id: 1,
      group_id: 1,
      mobile: "",
      mobile_valid: "",
      countryCode: "",
      password: "",
      confirm_password: ""
    }))
    setLoginFormValues((prevState) => ({
      ...prevState,
      username: "",
      password: ""
    }))
  }
  useEffect(() => {
    setTimeout(() => recaptcha.current.execute(), 1000)
  }, [formValues, loginFormError, recaptcha.current])

  useEffect(() => {
    focusPopup.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }, [focusPopup.current]);

  return (
    <>
      <Stack className='login-register-popup' ref={focusPopup}>
        {
          open && <Model name="login-reg-popup" cname="login-reg" closePpup={() => {
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
              loginReg: !showAuthencationPopup?.loginReg,
              forgotPas: false,
              resetPass: false
            }))
            clearValues()
          }} data={
            <>
              <Stack className='popup-section'>
                <Stack className='close-section' onClick={() => {
                  dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                    loginReg: !showAuthencationPopup?.loginReg,
                    forgotPas: false,
                    resetPass: false
                  }))
                  clearValues()
                }}>
                  <Box className='close-icon'>
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
                <Stack className='header-content-section'>
                  <Stack className='header-section'>
                    <img src={headerData?.logo} alt='' title='...' />
                  </Stack>
                  <Stack className='content-section'>
                    <Stack className='login-section common-section'>
                      <Stack className='popup-common-section'>
                        <Stack className='title'>
                          <Typography variant='h4' className="header-title-section">Login</Typography>
                          <Typography variant='span' className="sub-title">Enter your login credentials to access your account</Typography>
                        </Stack>
                        <Stack className='form-block'>
                          <Box className='input-block common_input_block_section'>
                            <Typography className="input_label">Email <Typography variant='span'>*</Typography></Typography>
                            <TextField className='input-text'
                              name='loginemail'
                              error={loginFormError?.username ? true : false}
                              id="loginemail"
                              type={'email'}
                              inputProps={{
                                autoComplete: "new-password",
                                form: {
                                  autoComplete: "off",
                                },
                              }}
                              value={loginFormValues?.username}
                              onChange={(e) => {
                                setLoginFormValues((prevState) => ({
                                  ...prevState,
                                  username: e.target.value
                                }))
                                setLoginFormError((prevState) => ({
                                  ...prevState,
                                  username: ""
                                }))
                              }}
                              onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                            />
                            {
                              loginFormError?.username && <Typography className='form-error-lable field-error'>{loginFormError?.username}</Typography>
                            }
                          </Box>
                          <Box className='input-block common_input_block_section input-icon-section'>
                            <Typography className="input_label">Password <Typography variant='span'>*</Typography></Typography>

                            <TextField className='input-text'
                              name='loginpassword'
                              type={loginShowPass ? 'text' : 'password'}
                              error={loginFormError?.password ? true : false}
                              id='loginpassword'
                              inputProps={{
                                autoComplete: "new-password",
                                form: {
                                  autoComplete: "off",
                                },
                              }}
                              value={loginFormValues?.password}
                              onChange={(e) => {
                                setLoginFormValues((prevState) => ({
                                  ...prevState,
                                  password: e.target.value
                                }))
                                setLoginFormError((prevState) => ({
                                  ...prevState,
                                  password: ""
                                }))
                              }}
                              onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                            />
                            <div className='icon-section'>
                              <img src={loginShowPass ? Eyepass : EyeHide} alt="" onClick={() => setLoginShowPass(!loginShowPass)} />
                            </div>
                            {
                              loginFormError?.password && <Typography className='form-error-lable field-error'>{loginFormError?.password}</Typography>
                            }
                          </Box>
                          <Typography variant='span' className='forgotpassword'>
                            <Typography
                              className='forgot-password'
                              onClick={() => {
                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                  loginReg: false,
                                  forgotPas: true,
                                  resetPass: false
                                }))
                              }}
                            >Forgot Password?</Typography>
                          </Typography>
                          <Stack className='button-section'>
                            <Recaptcha
                              ref={recaptcha}
                              sitekey={recaptchaKey()}
                              onResolved={onResolved} />
                            <Button className='primary_default_btn'
                              onClick={() => handleSubmit()}
                              startIcon={isValidRecaptcha === false ? <LoopIcon /> : ""}
                              disabled={isValidRecaptcha === false ? true : false}
                            >Login</Button>
                            <Box className='or'><Divider>Or</Divider></Box>
                            <Button className='google-sign-in' onClick={() => googleLogin()}>
                              <Box className='google-logo'><img src={Google} alt='' /></Box>
                              <Box className='sign-in-text'>Sign In With Google</Box>
                            </Button>
                          </Stack>

                        </Stack>

                      </Stack>
                    </Stack>
                    <Stack className='register-section common-section'>
                      <Stack className='popup-common-section'>
                        <Stack className='title'>
                          <Typography variant='h4' className="header-title-section">Register</Typography>
                          <Typography variant='span' className="sub-title">Register to create your account</Typography>
                        </Stack>
                        <Stack className='form-block'>
                          <Stack className='first-last-name-section common-double-section'>
                            <Box className='input-block common_input_block_section'>
                              <Typography className="input_label">First Name <Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='firstname'
                                id='firstname'
                                error={formError?.firstname ? true : false}
                                value={formValues?.firstname}
                                onChange={(e) => {
                                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      firstname: e.target.value
                                    }))
                                    setFormError((prevState) => ({
                                      ...prevState,
                                      firstname: ""
                                    }))
                                  }
                                }}
                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                              />
                              {
                                formError?.firstname && <Typography className='form-error-lable field-error'>{formError?.firstname}</Typography>
                              }
                            </Box>
                            <Box className='input-block common_input_block_section'>
                              <Typography className="input_label">Last Name <Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='l_name'
                                id='l-name'
                                error={formError?.lastname ? true : false}
                                value={formValues?.lastname}
                                onChange={(e) => {
                                  if (e.target.value === '' || isValidCharacter(e.target.value)) {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      lastname: e.target.value
                                    }))
                                    setFormError((prevState) => ({
                                      ...prevState,
                                      lastname: ""
                                    }))
                                  }
                                }}
                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                              />
                              {
                                formError?.lastname && <Typography className='form-error-lable field-error'>{formError?.lastname}</Typography>
                              }
                            </Box>
                          </Stack>

                          <Box className='input-block common_input_block_section'>
                            <Typography className="input_label">Email <Typography variant='span'>*</Typography></Typography>
                            <TextField className='input-text'
                              name='email'
                              id='email'
                              error={formError?.email ? true : false}
                              value={formValues?.email}
                              onChange={(e) => {
                                setFormValues((prevState) => ({
                                  ...prevState,
                                  email: e.target.value
                                }))
                                setFormError((prevState) => ({
                                  ...prevState,
                                  email: ""
                                }))
                              }}
                              onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                            />
                            {
                              formError?.email && <Typography className='form-error-lable field-error'>{formError?.email}</Typography>
                            }
                          </Box>
                          <Box className={`input-block common_input_block_section phone-section ${formError?.mobile ? 'show_error' : ''}`}
                          >
                            <Typography className="input_label">Phone Number <Typography variant='span'>*</Typography></Typography>

                            <PhoneInput
                              country={'in'}
                              id="number"
                              fullWidth
                              label="Mobile Number"
                              className={`drop_mobile_input input-text `}
                              name="mobile_number"
                              value={formValues?.mobile}
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
                              onChange={(e, value, data) => {
                                setFormValues((prevState) => ({
                                  ...prevState,
                                  mobile: `+${e}`,
                                  mobile_valid: e.slice(value?.dialCode?.length),
                                  countryCode: value?.dialCode
                                }))
                                setFormError((prevState) => ({
                                  ...prevState,
                                  mobile: ""
                                }))

                              }}
                              onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}

                            />
                            {
                              formError?.mobile && <Typography className='form-error-lable field-error'>{formError?.mobile}</Typography>
                            }
                          </Box>
                          <Stack className='pass-confirm-pass-section common-double-section'>
                            <Box className='input-block common_input_block_section input-icon-section'>
                              <Typography className="input_label">Password <Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='password'
                                id="password"
                                type={regShowPass ? 'text' : 'password'}
                                error={formError?.password ? true : false}
                                inputProps={{
                                  autoComplete: "new-password",
                                  form: {
                                    autoComplete: "off",
                                  },
                                }}
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
                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                              />
                              {
                                formError?.password && <Typography className='form-error-lable field-error'>{formError?.password}</Typography>
                              }
                              <div className='icon-section'>
                                <img src={regShowPass ? Eyepass : EyeHide} alt="" onClick={() => setRegShowPass(!regShowPass)} />
                              </div>

                            </Box>
                            <Box className='input-block common_input_block_section'>
                              <Typography className="input_label">Confirm Password <Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='Confirm Password'
                                id='confirm-password'
                                type="password"
                                inputProps={{
                                  autoComplete: "new-password",
                                  form: {
                                    autoComplete: "off",
                                  },
                                }}
                                error={formError?.confirm_password ? true : false}
                                value={formValues?.confirm_password}
                                onChange={(e) => {
                                  setFormValues((prevState) => ({
                                    ...prevState,
                                    confirm_password: e.target.value
                                  }))
                                  setFormError((prevState) => ({
                                    ...prevState,
                                    confirm_password: ""
                                  }))
                                }}
                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                              />
                              {
                                formError?.confirm_password && <Typography className='form-error-lable field-error'>{formError?.confirm_password}</Typography>
                              }
                            </Box>
                          </Stack>

                          <Stack className='button-section'>
                            <Button className='primary_default_btn'
                              onClick={() => submitHandler()}
                              startIcon={isValidRecaptcha === false ? <LoopIcon /> : ""}
                              disabled={isValidRecaptcha === false ? true : false}
                            >Register</Button>
                            <Box className='or'><Divider>Or</Divider></Box>
                            <Button className='google-sign-in' onClick={() => googleLogin()}>
                              <Box className='google-logo'><img src={Google} alt='' /></Box>
                              <Box className='sign-in-text'>Sign Up With Google</Box>
                            </Button>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </>
          } />
        }
      </Stack>
    </>
  )
}

export default Index;