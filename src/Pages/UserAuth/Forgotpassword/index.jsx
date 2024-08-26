import { Stack, Button, TextField, Typography, Box } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";
import { isValidEmail, isEmptyValue, pressEnterCallFunction } from "../../../Utilities/Utilities";
import { customer } from "../../../Utilities/Constant";
import { ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_PAGELOADER, ACTION_ACTIONMESSAGE } from "../../../Store/action";
import { useDispatch, useSelector } from 'react-redux';
import Recaptcha from 'react-google-invisible-recaptcha';
import { recaptchaKey } from "../../../Utilities/Constant";
import LoopIcon from '@mui/icons-material/Loop';
import Model from "../../../Components/Model";
import axios from 'axios';

const Index = ({ email, setEmail }) => {
  const { showAuthencationPopup } = useSelector(state => {
    return {
      showAuthencationPopup: state?.showAuthencationPopup
    }
  })
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recaptcha = useRef(null);
  const [isValidRecaptcha, setIsValidRecaptcha] = useState(false);
  const [emailError, setEmailError] = useState("");

  const onResolved = () => {
    setIsValidRecaptcha(true)
  }

  const submitHandler = () => {
    var isError = false;
    if (!email) {
      setEmailError("Required field.")
      document.getElementById("email")?.focus();
      var isError = true;
    } else if (!isEmptyValue(email)) {
      setEmailError("Empty spaces are not allowed.")
      document.getElementById("email")?.focus();
      var isError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      document.getElementById("email")?.focus();
      var isError = true;
    }
    // recaptcha
    if (isValidRecaptcha !== true) {
      setEmailError("Recaptcha error")
      var isError = true;
    }

    // Final valiation
    if (!isError && isValidRecaptcha === true) {
      Action_ForgotPassword(email, dispatch, setEmail, navigate, setIsValidRecaptcha)
    }
  }

  // Forgotpassword API
  const Action_ForgotPassword = async (email, dispatch, setEmail, navigate, setIsValidRecaptcha) => {
    dispatch(ACTION_PAGELOADER(true))
    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
      loginReg: false,
      forgotPas: false,
      resetPass: false
    }))
    try {
      const forgotdata = {
        data: {
          email: email
        }
      }
      const Response = await axios.post(`${customer()}forgotpassword`, forgotdata);
      dispatch(ACTION_PAGELOADER(false))
      if (Response?.data[0]?.code === 200) {
        setEmail("")
        setIsValidRecaptcha(false);
        dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
          loginReg: false,
          forgotPas: false,
          resetPass: false
        }))
        dispatch(ACTION_ACTIONMESSAGE({
          isSuccess: true,
          isWarning: false,
          isError: false,
          title: "Forgot password",
          message: Response?.data[0]?.message,
          showPopup: true,
          redirect: ""
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
          title: "Forgot password failed",
          message: Response?.data[0]?.message,
          showPopup: true
        }))
      }
    } catch (err) {
      console.log(err)
      dispatch(ACTION_PAGELOADER(false))
    }
  }
  useEffect(() => {
    setTimeout(() => recaptcha.current.execute(), 1000)
  }, [email, recaptcha.current])
  return (
    <>
      <Stack className='forgetpassword-popup-section'>
        {
          open && <Model
            name="forgetpassword-popup"
            cname="forgetpass"
            closePpup={() => {
              dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: false,
                forgotPas: !showAuthencationPopup?.forgotPas,
                resetPass: false
              }))
              setEmail("")
            }}
            data={
              <>
                <Stack className='popup-section'>
                  <Stack
                    className='close-section'
                    onClick={() => {
                      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                        loginReg: false,
                        forgotPas: !showAuthencationPopup?.forgotPas,
                        resetPass: false
                      }))
                      setEmail("")
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

                    <Stack className='content-section'>
                      <Stack className='common-section'>
                        <Stack className='popup-common-section'>
                          <Stack className='title'>
                            <Typography variant='h4' className="header-title-section">Forgot Password ?</Typography>
                            <Typography variant='span' className="sub-title">Enter your E-mail address to receive a link to reset Password.</Typography>
                          </Stack>
                          <Stack className='form-block'>
                            <Box className='input-block common_input_block_section'>
                              <Typography className="input_label">Email<Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='email'
                                id='email'
                                error={emailError ? true : false}
                                value={email}
                                inputProps={{
                                  autoComplete: "password",
                                  form: {
                                    autoComplete: "off",
                                  },
                                }}
                                onFocus={() => recaptcha.current.execute()}
                                onChange={(e) => {
                                  setEmail(e.target.value)
                                  setEmailError("")
                                }}
                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                              />
                              {
                                emailError && <Typography className='form-error-lable field-error'>{emailError}</Typography>
                              }
                            </Box>
                            <Stack className='button-section'>
                              <Recaptcha
                                ref={recaptcha}
                                sitekey={recaptchaKey()}
                                onResolved={onResolved} />
                              <Button className='primary_default_btn'
                                onClick={() => submitHandler()}
                                startIcon={isValidRecaptcha === false ? <LoopIcon /> : ""}
                                disabled={isValidRecaptcha === false ? true : false}
                              >Get Reset Link</Button>
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