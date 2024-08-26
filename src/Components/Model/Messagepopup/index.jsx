import React, { useEffect, useRef } from "react";
import "./styles.scss";
import Successgif from "../../../Assets/SuccessGif.gif";
import Failedif from "../../../Assets/FailIcon.gif";
import { Stack, Typography, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { ACTION_ACTIONMESSAGE, ACTION_SHOWAUTHENTICATIONPOPUP, SessionExpiredLogout } from "../../../Store/action";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { actionmessage: { isSuccess, title, message, isError, isWarning, action, close,
        redirect, refreshPage, showPopup, isSesstionTimeOut
    } } = useSelector(state => {
        return {
            actionmessage: state?.actionmessage
        }
    })
    const timeoutRefpop = useRef();
    const closePopup = () => {
        if (location?.pathname == "/resetpassword") {
            navigate("/")
        }
        if (isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
            if (redirect) {
                navigate(redirect)
            }
        } else {
          
            if (location?.pathname !== "/checkout" && title == "Login failed") {
                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                    loginReg: true,
                    forgotPas: false,
                    resetPass: false
                }))
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: false,
                    title: "",
                    message: "",
                    showPopup: false,
                    isSesstionTimeOut: false
                }))
            } else {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: false,
                    title: "",
                    message: "",
                    showPopup: false,
                    isSesstionTimeOut: false
                }))
                if (redirect) {
                    navigate(redirect)
                }
            }
            if(location?.pathname == "/myquote" && title=="Login failed"){
                // alert("Message pppup")
                                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                                    loginReg: false,
                                    forgotPas: false,
                                    resetPass: false
                                }))
                            }
        }
    }
    useEffect(() => {
        if (refreshPage == true) {
            window.location.reload();
        }
    }, [refreshPage])
    useEffect(() => {
        timeoutRefpop.current = window.setTimeout(() => {
            closePopup()
        }, 5000);
        return () => clearInterval(timeoutRefpop.current);
    }, [showPopup])
    return (
        <Stack className={`action-message-popup ${isWarning == true ? "logout-popup" : "action-message-popup"}`}>
            <Stack className="container">
                {
                    !isSesstionTimeOut ?
                        <Box className="close-btn" onClick={() => closePopup()}>
                            <svg id="Group_3123" data-name="Group 3123" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <rect id="Rectangle_2261" data-name="Rectangle 2261" width="24" height="24" fill="#fff" />
                                <g id="close" transform="translate(5.337 5.337)">
                                    <g id="Group_2837" data-name="Group 2837">
                                        <path id="Path_11420" data-name="Path 11420" d="M10.517,9.29a.868.868,0,1,0-1.228,1.228L14.3,15.534,9.288,20.549a.868.868,0,1,0,1.228,1.228l5.016-5.015,5.015,5.015a.868.868,0,1,0,1.228-1.228l-5.015-5.015,5.015-5.015A.868.868,0,1,0,20.548,9.29l-5.015,5.015L10.517,9.29Z" transform="translate(-9.034 -9.036)" fill="#898d94" />
                                    </g>
                                </g>
                            </svg>
                        </Box>
                        : ''
                }
                {
                    isSuccess &&
                    <Stack className="block success">
                        <Box className="image-section">
                            <img src={Successgif} alt="..." />
                        </Box>
                        <Typography className="success title">{title}</Typography>
                        <Typography className="info" dangerouslySetInnerHTML={{ __html: message }}></Typography>
                    </Stack>
                }
                {
                    isError &&
                    <Stack className="block danger">
                        <Box className="image-section">
                            <img src={Failedif} alt="..." />
                        </Box>
                        <Typography className="failed title">{title}</Typography>
                        <Typography className="info" dangerouslySetInnerHTML={{ __html: message }}></Typography>
                    </Stack>
                }
                {
                    isWarning &&
                    <Stack className="block warning">
                        <Typography className="info" dangerouslySetInnerHTML={{ __html: message }}></Typography>
                        <Stack className="btn-block">
                            <Button className='primary_default_btn' onClick={action}>Yes</Button>
                            <Button className='outlined_default_btn' onClick={close}>Cancel</Button>
                        </Stack>
                    </Stack>
                }
            </Stack>
        </Stack>
    )
}

export default Index;