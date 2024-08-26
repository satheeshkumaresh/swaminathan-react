import React, { useEffect, memo } from 'react'
import "./styles.scss";
import { Typography, Stack, Box, TextField } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import FooterLocation from '../../Assets/Clienticons/swaminathan-icons-04.svg';
import FooterMail from '../../Assets/Clienticons/swaminathan-icons-15.svg';
import Footermobile from '../../Assets/Clienticons/swaminathan-icons-18.svg';
import ArrowIcon from '../../Assets/footer/arrow.svg';
import MobileBottomHeader from '../Footer/MobileBottomHeader';
import PopularSearch from './PopularSearch';
import { ACTION_PAGELOADER,ACTION_PAGEMESSAGE,ACTION_UPDATEACCOUTUSERDATA  } from "../../Store/action";
import { isValidEmail, isEmptyValue } from "../../Utilities/Utilities";
import { baseUrl } from "../../Utilities/Constant";
import axios from "axios";

const Index = ({ footerData, headerLoader }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pageMessages } = useSelector(state => {
    return {
      pageMessages: state?.pageMessages,
    }
  })
  const [fieldValue, setfFeldValue] = useState("");
  const [fieldError, setFieldError] = useState("");

  const clickHandler = () => {
    var isError = false;
    if (!fieldValue) {
      setFieldError("Required field.")
      document.getElementById("lg-newsletter")?.focus();
      var isError = true;
    } else if (!isEmptyValue(fieldValue)) {
      setFieldError("Empty spaces are not allowed.")
      document.getElementById("lg-newsletter")?.focus();
      var isError = true;
    } else if (!isValidEmail(fieldValue)) {
      setFieldError("Please enter a valid email address")
      document.getElementById("lg-newsletter")?.focus();
      var isError = true;
    }

    // callAPI
    if (!isError) {
      guestNewsLetter(fieldValue, setfFeldValue, dispatch)
    }
  }
  // Guest News Letter
const guestNewsLetter = async (fieldValue, setfFeldValue, dispatch) => {
  dispatch(ACTION_PAGELOADER(true));
  dispatch(ACTION_PAGEMESSAGE({
      show: false,
      isSuccess: true,
      isError: false,
      isWarning: false,
      message: "",
      showFor: ""
  }))
  try {
      const data = {
          subscriber: {
              subscriber_email: fieldValue
          }
      }
      const Response = await axios({
          method: "post",
          url: `${baseUrl()}guest-newsletter/subscriber`,
          data
      });
      dispatch(ACTION_PAGELOADER(false));
      if (Response?.data[0]?.code === 200) {
          setfFeldValue("")
          dispatch(ACTION_UPDATEACCOUTUSERDATA())
          dispatch(ACTION_PAGEMESSAGE({
              show: true,
              isSuccess: true,
              isError: false,
              isWarning: false,
              message: Response?.data[0]?.message,
              showFor: ""
          }))
      } else {
          dispatch(ACTION_PAGEMESSAGE({
              show: true,
              isSuccess: false,
              isError: true,
              isWarning: false,
              message: Response?.data[0]?.message,
              showFor: ""
          }))
      }
  } catch (err) {
      console.log("Error", err)
      dispatch(ACTION_PAGELOADER(false));
  }
}
  useEffect(() => {
    setfFeldValue("")
  }, [pageMessages?.show])
  useEffect(() => {
    setfFeldValue("")
    setFieldError("")
  }, [location?.pathname])
  return (
    <>
      {
        footerData?.search_terms?.search_data_item?.length ?
          <PopularSearch footerData={footerData} headerLoader={headerLoader}/> : ''
      }
      <Stack className={`${location?.pathname?.slice(1) === "checkout" ? 'new-footer-main checkout_new_footer_main' : 'new-footer-main'}`}>
        <Stack className="footer-container-block">
          <Stack className="footer-block">
            <Box className="column about-column ">
              <Typography variant="h4">{footerData?.footer_about_us?.title}</Typography>
              <Typography className="footer-info first-column" dangerouslySetInnerHTML={{ __html: footerData?.footer_about_us?.content }}></Typography>
            </Box>
            <Box className="column get-touch-section">
              <Typography variant="h4">{footerData?.contact_us?.title}</Typography>

              <Typography className='footer-info address-section'>
                <Typography>
                  <img src={FooterLocation} alt="Location" />
                </Typography>
                <Typography className="footer-info get-touch-location"
                  dangerouslySetInnerHTML={{ __html: footerData?.contact_us?.address }} ></Typography>
              </Typography>

              <Typography className="footer-info last-section" >
                <Typography>
                  <img src={Footermobile} alt="Mobile" />
                </Typography>
                <a href={`tel:${footerData?.mobile_number}`} className="call">{footerData?.mobile_number}</a>
              </Typography>

              <Typography className="footer-info " >
                <span>
                  <img src={FooterMail} alt="Email" />
                </span>
                <a href={`mailto:${footerData?.email_address}`} className="call">{footerData?.email_address}</a>
              </Typography>
              <Stack className='footer-social-link' >
                {footerData?.follow_us?.map((item, ind) => {
                  return (
                    <a className="footer-social" href={item?.link} target="_blank" key={ind}>
                      <img src={item?.footer_image} alt={item?.title} title={item?.title} />
                    </a>
                  )
                })}
              </Stack>

            </Box>
            <Box className="column  overview-section">
              <Typography variant="h4">{footerData?.overview?.title}</Typography>
              <ul> 
              {
                footerData?.overview?.data?.map((item, ind) => {
                  return (
                    <li key={ind}>
                      <Link className="footer-info" to={`/${item?.link}`}>{item?.title}</Link>
                    </li>
                  )
                })
              }
              </ul>
            </Box>
            <Box className="column  payment-section">
              <Typography variant="h4">{footerData?.payment_method?.title}</Typography>
              <Typography className='image'>
                <img src={footerData?.payment_method?.image} alt="Payment" loading="lazy"/>
              </Typography>
            </Box>
            <Box className="column  newsletter-section">
              <Typography variant="h4">Subscribe To Newsletter</Typography>
              <Stack className="input-field newsletter-form common_input_block_section">
                <TextField
                  placeholder="Enter your email address"
                  name="lg-newsletter"
                  id="lg-newsletter"
                  inputProps={{
                    autoComplete: "new-password",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                  value={fieldValue}
                  onChange={(e) => {
                    setfFeldValue(e.target.value)
                    setFieldError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      return clickHandler();
                    }
                  }}
                />
                <Box className="email-button">
                  <img src={ArrowIcon} alt="Subscribe" onClick={() => clickHandler()} />
                </Box>
              </Stack>
              {
                fieldError && <Typography className="field-error-default">{fieldError}</Typography>
              }
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Stack className="primary-footer">
        <Typography variant="h4">{footerData?.copyright}</Typography>
      </Stack>
      <Stack className='header-section-mobile-only'>
        <MobileBottomHeader />
      </Stack>
    </>
  )
}

export default memo(Index);
