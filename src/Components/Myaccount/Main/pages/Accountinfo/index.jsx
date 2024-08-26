import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { ACTION_MYACCOUNTCURRENTPAGE } from "../../APIList";
import { addAccountInfo } from "../../APIList";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  isValidEmail, isValidPassword, isEmptyValue, pressEnterCallFunction, isValidCharacter
} from "../../../../../Utilities/Utilities";
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";


const Index = ({ accountCurrentPage, updateInfo, setUpdateInfo, setAccountInfoUpDateData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, loggedInUserData, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      loggedInUserData: state?.loggedInUserData,
      actionmessage: state?.actionmessage
    }
  })
  const [showMail, setShowMail] = useState(false)
  const [showPswd, setShowPswd] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [changeAccountInfo, setChangeAccountInfo] = useState(false)
  const [isValidForm, setIsValidForm] = useState(false)
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    mobile_valid: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [sendFormValues, setSendFormValues] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    mobile_valid: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    countryCode: ""
  })
  const [formError, setFormError] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    email: "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const handleSubmit = () => {
    var isError = false;
    // firstname
    if (!formValues?.firstname) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Required field."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
      setIsValidForm(false)
    } else if (!isEmptyValue(formValues?.firstname)) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Empty spaces are not allowed."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
      setIsValidForm(false)
    }
    // lastname
    if (!formValues?.lastname) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Required field."
      }))
      document.getElementById("lastname")?.focus();
      var isError = true;
      setIsValidForm(false)
    } else if (!isEmptyValue(formValues?.lastname)) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Empty spaces are not allowed."
      }))
      document.getElementById("lastname")?.focus();
      var isError = true;
      setIsValidForm(false)
    }

    // email
    if (showMail == true) {
      if (!formValues?.email) {
        setFormError((prevState) => ({
          ...prevState,
          email: "Required field."
        }))
        setIsValidForm(false)
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
          email: "Please enter a valid email address."
        }))
        document.getElementById("email")?.focus();
        var isError = true;
      }
    }
    // current_password
    if (showPswd || showMail) {
      if (!formValues?.current_password) {
        setFormError((prevState) => ({
          ...prevState,
          current_password: "Required field."
        }))
        setIsValidForm(false)
        document.getElementById("current_password")?.focus();
        var isError = true;
      } else if (!isEmptyValue(formValues?.current_password)) {
        setFormError((prevState) => ({
          ...prevState,
          current_password: "Empty spaces are not allowed."
        }))
        document.getElementById("current_password")?.focus();
        var isError = true;
      }
    }
    // passwords
    if (showPswd == true) {
      // new_password
      if (!formValues?.new_password) {
        setFormError((prevState) => ({
          ...prevState,
          new_password: "Required field."
        }))
        setIsValidForm(false)
        document.getElementById("new_password")?.focus();
        var isError = true;
      } else if (!isEmptyValue(formValues?.new_password)) {
        setFormError((prevState) => ({
          ...prevState,
          new_password: "Empty spaces are not allowed."
        }))
        setIsValidForm(false)
        document.getElementById("new_password")?.focus();
        var isError = true;
      } else if (!isValidPassword(formValues?.new_password)) {
        setFormError((prevState) => ({
          ...prevState,
          new_password: "Please enter strong password like Admin@123."
        }))
        setIsValidForm(false)
        document.getElementById("new_password")?.focus();
        var isError = true;
      }
      // confirm_password
      if (!formValues?.confirm_password) {
        setFormError((prevState) => ({
          ...prevState,
          confirm_password: "Required field."
        }))
        setIsValidForm(false)
        document.getElementById("confirm_password")?.focus();
        var isError = true;
      } else if (formValues?.new_password !== formValues?.confirm_password) {
        setFormError((prevState) => ({
          ...prevState,
          confirm_password: "Password and confirm password should be same."
        }))
        setIsValidForm(false)
        document.getElementById("confirm_password")?.focus();
        var isError = true;
      }
    }

    // Final valiation
    if (!isError) {
      addAccountInfo(token, dispatch, sendFormValues, setUpdateInfo, setFormValues, navigate, setAccountInfoUpDateData, 'account', actionmessage?.isSesstionTimeOut)
    }
  }
  
  useEffect(() => {
    setFormError((prevState) => ({
      ...prevState,
      email: "",
      new_password: "",
    }))
  }, [showMail])

  useEffect(() => {
    if (showMail) {
      setSendFormValues((prevState) => ({
        ...prevState,
        firstname: formValues?.firstname,
        lastname: formValues?.lastname,
        mobile: formValues?.mobile,
        email: formValues?.email,
        current_password: formValues?.current_password,
        new_password: "",
        confirm_password: "",
      }))
      setChangeAccountInfo(true)
    } else {
      setSendFormValues(formValues)
    }
    if (showPswd) {
      setSendFormValues((prevState) => ({
        ...prevState,
        firstname: formValues?.firstname,
        lastname: formValues?.lastname,
        mobile: formValues?.mobile,
        email: "",
        current_password: formValues?.current_password,
        new_password: formValues?.new_password,
        confirm_password: formValues?.confirm_password,
      }))
      setChangeAccountInfo(true)
    } else {
      setSendFormValues(formValues)
    }
    if (showPswd == false && showMail == false) {
      setSendFormValues((prevState) => ({
        ...prevState,
        firstname: formValues?.firstname,
        lastname: formValues?.lastname,
        mobile: formValues?.mobile,
        email: "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      }))
      setChangeAccountInfo(true)
    } else {
      setSendFormValues(formValues)
    }
  }, [showMail, showPswd, showPass, formValues, loggedInUserData])
  
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("Edit Account Information"))
  }, [])
 
  useEffect(() => {
    setFormValues((prevState) => ({
      ...prevState,
      firstname: loggedInUserData?.firstname,
      lastname: loggedInUserData?.lastname,
      mobile: loggedInUserData?.mobile?loggedInUserData?.mobile:'',
      email: loggedInUserData?.email
    }))
  }, [loggedInUserData])
  useEffect(() => {
    if (location?.state?.from?.showPassword) {
      setShowPswd(true)
    }
  }, [location?.state?.from?.showPassword])
  useEffect(() => {
    if (!showPswd) {
      setFormValues((prevState) => ({
        ...prevState,
        new_password: "",
        confirm_password: ""
      }))
      setFormError((prevState) => ({
        ...prevState,
        new_password: "",
        confirm_password: ""
      }))
    }
    if (!showMail && !showPswd) {
      setFormValues((prevState) => ({
        ...prevState,
        current_password: ""
      }))
      setFormError((prevState) => ({
        ...prevState,
        current_password: ""
      }))
      setShowPass(false)
    }
  }, [showMail, showPswd, showPass])
  
  return (
    <Stack className="account-info-page">
      <Stack className="block">

        <Stack className='account-info'>
          <Stack className='information'>
            {showMail || showPswd ?
              <Box className="header page-title">Edit Account Information</Box> :
              <Box className="header page-title">{accountCurrentPage}</Box>
            }
            <Box className='input-block'>
              <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
              <TextField
                className='input-text'
                name='firstname'
                id='firstname'
                value={formValues?.firstname}
                error={formError?.firstname ? true : false}

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
                onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
              />
              {
                formError?.firstname && <Typography className='form-error-lable field-error'>{formError?.firstname}</Typography>
              }
            </Box>
            <Box className='input-block'>
              <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
              <TextField
                className='input-text'
                name='firstname'
                id='firstname'
                value={formValues?.lastname}
                error={formError?.lastname ? true : false}
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
                onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
              />
              {
                formError?.lastname && <Typography className='form-error-lable field-error'>{formError?.lastname}</Typography>
              }
            </Box>
            {/* purposely commented  */}
            <Box className={`input-block common_input_block_section phone-section ${formError?.mobile ? 'show_error' : ''}`}>
              <Typography className="input_label">Phone Number</Typography>
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
                  open: true
                }}
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
                onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}

              />
              {
                formError?.mobile && <Typography className='form-error-lable field-error'>{formError?.mobile}</Typography>
              }
            </Box>

            <Stack className='Change-email-sec'>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowMail(true)
                    } else {
                      setShowMail(false)
                    }
                  }}
                  checked={showMail ? true : false}
                />}
                  label="Change Email"
                />
              </FormGroup>
            </Stack>
            <Stack className='Change-password-sec'>
              <FormGroup>
                <FormControlLabel control={<Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowPswd(true)
                    } else {
                      setShowPswd(false)
                    }
                  }}
                  checked={showPswd ? true : false}
                />} label="Change Password" />
              </FormGroup>

            </Stack>

          </Stack>
          {showMail || showPswd ?
            <Stack className='Change-email-password'>
              {
                showMail && showPswd ?
                  <Typography variant='h4'>Change Email and Password</Typography> :
                  showMail ? <Typography variant='h4'>Change Email</Typography> :
                    showPswd ? <Typography variant='h4'>Change Password</Typography> : ''
              }
              {showMail ?
                <Box className='input-block'>
                  <Typography className="input_label">Email<Typography variant='span'>*</Typography></Typography>
                  <TextField
                    className='input-text'
                    name='email'
                    id='email'
                    autoComplete="off"
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
                    onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                  />
                  {
                    formError?.email && <Typography className='form-error-lable field-error'>{formError?.email}</Typography>
                  }
                </Box> : ""
              }
              {showPswd || showMail ?
                <>
                  <Box className='input-block'>
                    <Typography className="input_label">Current Password<Typography variant='span'>*</Typography></Typography>
                    <TextField
                      className='input-text'
                      name='current_password'
                      id='current_password'
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                      type={showPass == true ? 'text' : 'password'}
                      value={formValues?.current_password}
                      onChange={(e) => {
                        setFormValues((prevState) => ({
                          ...prevState,
                          current_password: e.target.value
                        }))
                        setFormError((prevState) => ({
                          ...prevState,
                          current_password: ""
                        }))
                      }}
                      onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                    />
                    {
                      formError?.current_password && <Typography className='form-error-lable field-error'>{formError?.current_password}</Typography>
                    }
                  </Box>
                </> : ""
              }
              {showPswd ?
                <>
                  <Box className='input-block'>
                    <Typography className="input_label">New Password<Typography variant='span'>*</Typography></Typography>
                    <TextField
                      className='input-text'
                      name='new_password'
                      id='new_password'
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                      type={showPass == true ? 'text' : 'password'}
                      value={formValues?.new_password}
                      onChange={(e) => {
                        setFormValues((prevState) => ({
                          ...prevState,
                          new_password: e.target.value
                        }))
                        setFormError((prevState) => ({
                          ...prevState,
                          new_password: ""
                        }))
                      }}
                      onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                    />
                    {
                      formError?.new_password && <Typography className='form-error-lable field-error'>{formError?.new_password}</Typography>
                    }
                  </Box>
                  <Box className='input-block'>
                    <Typography className="input_label">Confirm New Password<Typography variant='span'>*</Typography></Typography>
                    <TextField
                      className='input-text'
                      name='confirm_password'
                      id='confirm_password'
                      inputProps={{
                        autoComplete: 'new-password',
                      }}
                      type={showPass == true ? 'text' : 'password'}
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
                      onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                    />
                    {
                      formError?.confirm_password && <Typography className='form-error-lable field-error'>{formError?.confirm_password}</Typography>
                    }
                  </Box>
                </> : ""
              }
              {showPswd || showMail ?
                <>
                  <Stack className='ShowPassword'>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              if (e.target.checked) {
                                setShowPass(true)
                              } else {
                                setShowPass(false)
                              }
                            }}
                          />}
                        checked={showPass ? true : false}
                        label="Show Password"
                      />
                    </FormGroup>
                  </Stack>
                </> : ""
              }

            </Stack>
            : ""}

        </Stack>
      </Stack>
      <Stack className="button-block">
        <Button className='save primary_default_btn' onClick={handleSubmit}>Save</Button>
        <Button className='back primary_default_btn' onClick={() => navigate(-1)}>Back</Button>
      </Stack>
    </Stack >
  )
}

export default Index;