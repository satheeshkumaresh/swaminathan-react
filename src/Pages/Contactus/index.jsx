import React, { useEffect, useState, useRef } from 'react'
import "./styles.scss";
import { Stack, Box, Typography, Button, TextField } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import LoopIcon from '@mui/icons-material/Loop';
import { useDispatch, useSelector } from 'react-redux';
import Recaptcha from 'react-google-invisible-recaptcha';
import { recaptchaKey } from "../../Utilities/Constant";
import { isValidEmail, isEmptyValue, pressEnterCallFunction ,isValidCharacter} from "../../Utilities/Utilities";
import { ACTION_PAGELOADER, ACTION_ACTIONMESSAGE } from "../../Store/action";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { MarkerF } from '@react-google-maps/api';
import Phone from '../../Assets/contactus/new/phone.svg';
import Mobile from '../../Assets/contactus/new/telephone-fill.svg';
import Mail from '../../Assets/contactus/new/mail.svg';
import { Helmet } from "react-helmet-async";
import Facebook from '../../Assets/contactus/Facebook.svg';
import Twitter from '../../Assets/contactus/Twitter.svg';
import Instagram from '../../Assets/contactus/Instagram.svg';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";
import axios from "axios";
import { customer } from "../../Utilities/Constant";

const containerStyle = {
    width: '100%',
    height: '400px'
};
const center = {
    lat: 10.9678251,
    lng: 79.3827265,
};
const position = {
    lat: 10.9678251,
    lng: 79.3827265,
};
const onLoad = marker => {
    console.log('marker: ', position)
}

const Index = ({ contactData }) => {
    const dispatch = useDispatch();
    const recaptcha = useRef(null);

    const [facebookUrl, setFacebookUrl] = useState();
    const [instaUrl, setInstaUrl] = useState();
    const [twitterUrl, setTwitterUrl] = useState();

    const { userdata } = useSelector(state => {
        return {
            userdata: state?.userdata,
        }
    })
    const [isValidRecaptcha, setIsValidRecaptcha] = useState(false);
    const [formValues, setFormValues] = useState({
        customer_id: userdata?.id == undefined || userdata?.id == "" ? "" : userdata?.id,
        name: "",
        email: "",
        phone: "",
        phone_valid: "",
        message: ""
    });

    const [formError, setFormError] = useState({
        name: "",
        email: "",
        phone: "",
        phone_valid: "",
        message: ""
    });

    const onResolved = () => {
        setIsValidRecaptcha(true)
    }
    const submitHandler = () => {
        var isError = false;
        // message
        if (!formValues?.message) {
            setFormError((prevState) => ({
                ...prevState,
                message: "Required field."
            }))
            recaptcha.current.reset();
            document.getElementById("message")?.focus();
            var isError = true;
        } else if (!isEmptyValue(formValues?.message)) {
            setFormError((prevState) => ({
                ...prevState,
                message: "Empty spaces are not allowed."
            }))
            recaptcha.current.reset();
            document.getElementById("message")?.focus();
            var isError = true;
        }
        // mobile
        if (formValues?.phone.length > 0) {
            if (formValues?.phone_valid?.length < 10 || formValues?.phone_valid?.length > 16) {

                setFormError((prevState) => ({
                    ...prevState,
                    phone: "Please enter minimum 10 to 16 digit phone number."
                }))
                recaptcha.current.reset();
                document.getElementById("phone")?.focus();
                var isError = true;
            }
        } else if (!isEmptyValue(formValues?.phone)) {
            setFormError((prevState) => ({
                ...prevState,
                phone: "Empty spaces are not allowed."
            }))
            recaptcha.current.reset();
            document.getElementById("mobile")?.focus();
            var isError = true;
        }

        if (formValues?.phone?.length == 0) {
            setFormError((prevState) => ({
                ...prevState,
                phone: "Required field."
            }))
            recaptcha.current.reset();
            document.getElementById("mobile")?.focus();
            var isError = true;
        }
        // email
        if (!formValues?.email) {
            setFormError((prevState) => ({
                ...prevState,
                email: "Required field."
            }))
            recaptcha.current.reset();
            document.getElementById("email")?.focus();
            var isError = true;
        } else if (!isEmptyValue(formValues?.email)) {
            setFormError((prevState) => ({
                ...prevState,
                email: "Empty spaces are not allowed."
            }))
            recaptcha.current.reset();
            document.getElementById("email")?.focus();
            var isError = true;
        } else if (!isValidEmail(formValues?.email)) {
            setFormError((prevState) => ({
                ...prevState,
                email: "Please enter a valid email address"
            }))
            recaptcha.current.reset();
            document.getElementById("email")?.focus();
            var isError = true;
        }
        // first name
        if (!formValues?.name) {
            setFormError((prevState) => ({
                ...prevState,
                name: "Required field."
            }))
            recaptcha.current.reset();
            document.getElementById("name")?.focus();
            var isError = true;
        } else if (!isValidCharacter(formValues?.name)) {
            setFormError((prevState) => ({
                ...prevState,
                name: "Name can only contain alphabets."
            }))
            recaptcha.current.reset();
            document.getElementById("name")?.focus();
            var isError = true;
        }
        // recaptcha
        if (isValidRecaptcha !== true) {
            setFormError((prevState) => ({
                ...prevState,
                confirm_password: "Recaptcha error"
            }))
            recaptcha.current.reset();
            var isError = true;
        }

        // Final valiation
        if (!isError && isValidRecaptcha === true) {
            contactUs(formValues, reset, dispatch)
        }
    }

    const reset = () => {
        setFormValues((prevState) => ({
            ...prevState,
            name: "",
            email: "",
            phone: "",
            message: ""
        }))
    }
    // CALL API
    const contactUs = async (formValues, reset, dispatch) => {
        dispatch(ACTION_PAGELOADER(true));
        try {
            const data = {
                data: formValues
            }
            const Response = await axios.post(`${customer()}contactus`, data);
            dispatch(ACTION_PAGELOADER(false));
            if (Response?.data[0]?.code === 200) {
                reset()
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: true,
                    isWarning: false,
                    isError: false,
                    title: "",
                    message: Response?.data[0]?.message,
                    showPopup: true
                }))
            } else {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: true,
                    title: "",
                    message: Response?.data[0]?.message,
                    showPopup: true
                }))
            }
        } catch (err) {
            console.log("Error", err)
            dispatch(ACTION_PAGELOADER(false))
        }
    }
    useEffect(() => {
        setTimeout(() => recaptcha?.current?.execute(), 1000)
    }, [formValues, recaptcha?.current])

    useEffect(() => {
        if (contactData?.follow_us?.length > 0) {
            contactData?.follow_us?.map((value, i) => {
                if (value?.title === "Facebook") {
                    setFacebookUrl(value?.link);
                }
                if (value?.title === "Instagram") {
                    setInstaUrl(value?.link);
                }
                if (value?.title === "Twitter") {
                    setTwitterUrl(value?.link);
                }
            })
        }
    }, [contactData])

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Sri Swaminathan & Co Kumbakonam | Contact Us </title>
                <meta
                    name="description"
                    content="Every block of stone has a statue inside it and it is the task of the sculptor to discover it"
                    data-react-helmet="true"
                />
            </Helmet>
            <Stack className='contact-page-section' >
                <Stack className='container-section'>
                    <Stack className='block'>
                        <Stack className='contact-info-section info-section'>
                            <Stack className='content'>
                                <Stack className='main_title'>
                                    <Typography className='title'>CONTACT US</Typography>
                                    <Typography className='sub-title'>We are here to help you. Please fill out the contact form with your message</Typography>
                                </Stack>
                                <Stack className='content_section'>
                                    <Stack className='info_content visit-us'>
                                        <Typography className='title'>Visit Us</Typography>
                                        <Stack className='info'>
                                            <Typography className="msg" dangerouslySetInnerHTML={{ __html: contactData?.contact_us?.address }}></Typography>
                                        </Stack>

                                    </Stack>
                                    <Stack className='info_content'>
                                        <Typography className='title'>Talk To Us</Typography>
                                        <Stack className='info talk'>
                                            <Stack className='talk_section'>
                                                <img src={Phone} alt='phone' title='phone' />
                                                <a className='msg' href={`tel: 0435-2432260`}> 0435-2432260</a>

                                            </Stack>
                                            <Stack className='talk_section'>
                                                <img src={Mobile} alt='phone' title='phone' />
                                                <a className='msg' href={`tel:${contactData?.mobile_number}`}>{contactData?.mobile_number}</a>
                                            </Stack>
                                            <Stack className='talk_section'>
                                                <img src={Mail} alt='phone' title='phone' />
                                                <a className='msg' href={`mailto:${contactData?.email_address}`} >{contactData?.email_address}</a>
                                            </Stack>

                                        </Stack>

                                    </Stack>

                                    <Stack className='info_content'>
                                        <Typography className='title'>Follow Us</Typography>
                                        <Stack className='info'>
                                            <Stack className='social_icon'>
                                                <a className="footer-social" href={facebookUrl} target="_blank" >
                                                    <img src={Facebook} alt="..." />
                                                </a>
                                                <a className="footer-social" href={twitterUrl} target="_blank" >
                                                    <img src={Twitter} alt="..." />
                                                </a>
                                                <a className="footer-social" href={instaUrl} target="_blank" >
                                                    <img src={Instagram} alt="..." />
                                                </a>
                                            </Stack>

                                        </Stack>

                                    </Stack>


                                </Stack>
                            </Stack>


                        </Stack>
                        <Stack className='contact-get-touch-section info-section'>
                            <Stack className='content'>
                                <Stack className='main_title'>
                                    <Typography className='title'>GET IN TOUCH WITH US</Typography>
                                </Stack>
                                <Stack className='form-block'>
                                    <Stack className='input-block-section'>

                                        <Box className='input-block common_input_block_section'>
                                            <Typography className="input_label">Name<Typography variant='span'>*</Typography></Typography>
                                            <TextField
                                                className='input-text'
                                                name='name'
                                                id='name'
                                                error={formError?.name ? true : false}
                                                value={formValues?.name}
                                                onChange={(e) => {
                                                    if (e.target.value === '' || isValidCharacter(e.target.value)) {

                                                        setFormValues((prevState) => ({
                                                            ...prevState,
                                                            name: e.target.value
                                                        }))
                                                        setFormError((prevState) => ({
                                                            ...prevState,
                                                            name: ""
                                                        }))
                                                    }
                                                }}
                                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                                            />
                                            {
                                                formError?.name && <Typography className='form-error-lable field-error'>{formError?.name}</Typography>
                                            }

                                        </Box>
                                        <Box className='input-block common_input_block_section'>
                                            <Typography className="input_label">Email<Typography variant='span'>*</Typography></Typography>
                                            <TextField
                                                className='input-text'
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
                                        <Box className={`input-block common_input_block_section phone-section ${formError?.phone ? 'show_error' : ''}`}>
                                            <Typography className="input_label">Phone Number<Typography variant='span'>*</Typography></Typography>                                            
                                            <PhoneInput
                                                country={'in'}
                                                id="number"
                                                fullWidth
                                                label="Mobile Number"
                                                className={`drop_mobile_input input-text `}
                                                name="mobile_number"
                                                value={formValues?.phone}
                                                placeholder="Mobile number"
                                                error={formError?.phone ? true : false}
                                                onBlur={formError?.phone ? true : false}
                                                inputProps={{
                                                    label: "Mobile Number",
                                                    required: true,
                                                    name: 'phone',
                                                    open: true
                                                }}
                                                variant="outlined"
                                                onChange={(e, value, data) => {
                                                    setFormValues((prevState) => ({
                                                        ...prevState,
                                                        phone: `+${e}`,
                                                        phone_valid: e.slice(value?.dialCode?.length)
                                                    }))
                                                    setFormError((prevState) => ({
                                                        ...prevState,
                                                        phone: ""
                                                    }))

                                                }}
                                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                                            />
                                            {
                                                formError?.phone && <Typography className='form-error-lable field-error'>{formError?.phone}</Typography>
                                            }

                                        </Box>
                                    </Stack>
                                    <Stack className='text-block-section'>
                                        <Box className='input-block'>
                                            <Typography className="input_label">Message<Typography variant='span'>*</Typography></Typography>
                                            <TextareaAutosize
                                                className={`input-text message ${formError?.message ? 'show_error' : ''}`}
                                                name='message'
                                                id='message'
                                                value={formValues?.message}
                                                error={formError?.message ? true : false}
                                                onChange={(e) => {
                                                    setFormValues((prevState) => ({
                                                        ...prevState,
                                                        message: e.target.value
                                                    }))
                                                    setFormError((prevState) => ({
                                                        ...prevState,
                                                        message: ""
                                                    }))
                                                }}
                                                onKeyDown={(e) => pressEnterCallFunction(e, submitHandler)}
                                            />
                                            {
                                                formError?.message && <Typography className='form-error-lable field-error'>{formError?.message}</Typography>
                                            }

                                        </Box>
                                    </Stack>


                                </Stack>
                                <Recaptcha
                                    ref={recaptcha}
                                    sitekey={recaptchaKey()}
                                    onResolved={onResolved} />
                                <Stack className='button-section'>
                                    <Button
                                        className='primary_default_btn'
                                        onClick={submitHandler}
                                        startIcon={isValidRecaptcha === false ? <LoopIcon /> : ""}
                                        disabled={isValidRecaptcha === false ? true : false}
                                    >Send Message</Button>

                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack className='map-section'>
                        <LoadScript
                            googleMapsApiKey="AIzaSyDw8-7POKl3AdrdvETv1H8u-8v76TNlao4"
                        >
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={20}
                                id="circle-example"
                            >
                                <MarkerF
                                    icon={{
                                        path:
                                            "M24,3A16.52,16.52,0,0,0,7.5,19.5a16.333,16.333,0,0,0,3.324,9.9s-.538-.673-.465-.588L24,45,36.659,30.071c.066-.08.517-.67.517-.67v0A16.328,16.328,0,0,0,40.5,19.5,16.519,16.519,0,0,0,24,3Zm0,22.5a6,6,0,1,1,6-6,6,6,0,0,1-6,6Z",
                                        fillColor: "#d91919",
                                        fillOpacity: 0.9,
                                        scale: 1,
                                        width: "39.75",
                                        height: "52.75",
                                        strokeWeight: 2,

                                    }}
                                    onLoad={onLoad}
                                    position={position}
                                />
                            </GoogleMap>
                        </LoadScript>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

export default Index;