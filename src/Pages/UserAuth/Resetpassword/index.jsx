import { Stack, Button, TextField, Typography, Box } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import "./styles.scss";
import { isValidPassword, isEmptyValue, pressEnterCallFunction } from "../../../Utilities/Utilities";
import { customer } from "../../../Utilities/Constant";
import { ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_PAGELOADER, ACTION_ACTIONMESSAGE } from "../../../Store/action";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Recaptcha from 'react-google-invisible-recaptcha';
import { recaptchaKey } from "../../../Utilities/Constant";
import LoopIcon from '@mui/icons-material/Loop';
import Model from "../../../Components/Model";
import Eyepass from "../../../Assets/Clienticons/swaminathan-icons-21.svg";
import EyeHide from "../../../Assets/Clienticons/swaminathan-icons-20.svg";
import axios from 'axios';

const Index = () => {
  const { showAuthencationPopup } = useSelector(state => {
    return {
      showAuthencationPopup: state?.showAuthencationPopup
    }
  })
  const [open, setOpen] = useState(true);
  const [regShowPass, setRegShowPass] = useState(false)
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const recaptcha = useRef(null);
  const [isValidRecaptcha, setIsValidRecaptcha] = useState(false);
  const [formValues, setFormValues] = useState({
    password: "",
    confirm_password: "",
    token: location?.search.replace('?token=', ''),
  });
  const [formError, setFormError] = useState({
    password: "",
    confirm_password: ""
  });
  const onResolved = () => {
    setIsValidRecaptcha(true)
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
    } else if (formValues?.password?.length < 6) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Please enter minimum 6 characters."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    } else if (!isValidPassword(formValues?.password)) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Please enter strong password without space."
      }))
      document.getElementById("password")?.focus();
      var isError = true;
    }
    // recaptcha
    if (isValidRecaptcha !== true) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Recaptcha error"
      }))
      var isError = true;
    }

    // Final valiation
    if (!isError && isValidRecaptcha === true) {
      Action_ResetPassword(formValues, dispatch, setFormValues, navigate, setIsValidRecaptcha)
    }
  }
  // Resetpassword API
  const Action_ResetPassword = async (formValues, dispatch, setFormValues, navigate, setIsValidRecaptcha) => {
    dispatch(ACTION_PAGELOADER(true))
    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
      loginReg: false,
      forgotPas: false,
      resetPass: false
    }))
    try {
      const resetdata = {
        data: formValues
      }
      const Response = await axios.post(`${customer()}reset/password`, resetdata);
      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
        loginReg: false,
        forgotPas: false,
        resetPass: false
      }))
      dispatch(ACTION_PAGELOADER(false))
      if (Response?.data[0]?.code == 200) {
        setFormValues((prevState) => ({
          ...prevState,
          password: "",
          confirm_password: "",
          token: ""
        }))
        setIsValidRecaptcha(false);
        dispatch(ACTION_ACTIONMESSAGE({
          isSuccess: true,
          isWarning: false,
          isError: false,
          title: "Reset password",
          message: Response?.data[0]?.message,
          showPopup: true,
          redirect: ""
        }))
      } else {
        dispatch(ACTION_ACTIONMESSAGE({
          isSuccess: false,
          isWarning: false,
          isError: true,
          title: "Reset password failed",
          message: Response?.data[0]?.message,
          showPopup: true,
          redirect: ""
        }))
      }
    } catch (err) {
      console.log(err)
      dispatch(ACTION_PAGELOADER(false))
    }
  }
  useEffect(() => {
    setTimeout(() => recaptcha.current.execute(), 1000)
  }, [formValues, recaptcha.current])
  return (
    <>
      <Stack className='resetpassword-popup-section'>
        {
          open && <Model
            name="resetpassword-popup"
            cname="resetpass"

            closePpup={() => {
              dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: false,
                forgotPas: false,
                resetPass: !showAuthencationPopup?.forgotPas
              }))
              setFormValues((prevState) => ({
                ...prevState,
                password: "",
                confirm_password: "",
                token: "",
              }))
              navigate("/")
            }}
            data={
              <>
                <Stack className='popup-section'>
                  <Stack
                    className='close-section'
                    onClick={() => {
                      dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                        loginReg: false,
                        forgotPas: false,
                        resetPass: false
                      }))
                      setFormValues((prevState) => ({
                        ...prevState,
                        password: "",
                        confirm_password: "",
                        token: "",
                      }))
                      navigate("/")
                    }}
                  >
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
                            <Typography variant='h4' className="header-title-section">Reset Password</Typography>
                            <Typography variant='span' className="sub-title">Create a new password</Typography>
                          </Stack>
                          <Stack className='form-block'>
                            <Box className='input-block common_input_block_section input-icon-section'>
                              <Typography className="input_label">New Password<Typography variant='span'>*</Typography></Typography>
                              <TextField className='input-text'
                                name='New Password'
                                type={regShowPass ? 'text' : 'password'}
                                id="password"
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
                            <Box className='input-block common_input_block_section '>
                              <Typography className="input_label">Confirm Password<Typography variant='span'>*</Typography></Typography>

                              <Stack className='input-icon-section'>
                                <TextField className='input-text'
                                  name='Confirm New Password'
                                  id="confirm-password"
                                  type='password'
                                  error={formError?.confirm_password ? true : false}
                                  inputProps={{
                                    autoComplete: "confirm-password",
                                    form: {
                                      autoComplete: "off",
                                    },
                                  }}
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

                              </Stack>

                            </Box>

                            <Stack className='button-section'>
                              <Recaptcha
                                ref={recaptcha}
                                sitekey={recaptchaKey()}
                                onResolved={onResolved}
                              />
                              <Button className='primary_default_btn'
                                onClick={submitHandler}
                                startIcon={isValidRecaptcha === false ? <LoopIcon /> : ""}
                                disabled={isValidRecaptcha === false ? true : false}
                              >Reset Password</Button>
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