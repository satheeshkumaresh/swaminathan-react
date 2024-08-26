import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Stack, Typography, Box } from '@mui/material';
import { ACTION_PAGELOADER, ACTION_ACTIONMESSAGE  } from "../../../Store/action";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACTION_SHOWAUTHENTICATIONPOPUP } from "../../../Store/action";
import axios from "axios";
import {customer} from "../../../Utilities/Constant";

const Index = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmKey, setConfirmKey] = useState({
        confirmationKey: location?.search.replace('?key=', '')
    })
    // Confirmail API
    const Action_Confirmail = async (confirmKey, dispatch, setConfirmKey, setIsSuccess) => {
        dispatch(ACTION_PAGELOADER(true))
        try {
            const Response = await axios.post(`${customer()}confirm/email`, confirmKey);
            dispatch(ACTION_PAGELOADER(false))
            if (Response?.data[0]?.code == 200) {
                setConfirmKey((prevState) => ({
                    ...prevState,
                    confirmKey: ""
                }))
                setIsSuccess(true);
            } else {
                dispatch(ACTION_ACTIONMESSAGE({
                    isSuccess: false,
                    isWarning: false,
                    isError: true,
                    title: "Account create",
                    message: Response?.data[0]?.message,
                    showPopup: true,
                    redirect: "/"
                }))
            }
        } catch (err) {
            console.log(err)
            dispatch(ACTION_PAGELOADER(false))
        }
    }
    useEffect(() => {
        Action_Confirmail(confirmKey, dispatch, setConfirmKey, setIsSuccess)
    }, [])
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                    loginReg: true,
                    forgotPas: false,
                    resetPass: false
                }))
            }, 4000)
        }
    }, [isSuccess])
    return (
        <Stack className="accountsuccess">
            <Stack className='container'>
                <Stack className='row'>
                    <Box className="imagesection">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50.82" height="50.82" viewBox="0 0 50.82 50.82">
                            <path id="_48116925ae3a82eb626852f6dfabe743" data-name="48116925ae3a82eb626852f6dfabe743" d="M73.41,48A25.41,25.41,0,1,0,98.82,73.41,25.406,25.406,0,0,0,73.41,48ZM69.488,82.413a1.685,1.685,0,0,1-1.075.538,1.761,1.761,0,0,1-1.087-.55L60.485,75.56l2.175-2.174,5.766,5.766L83.672,63.8l2.138,2.211Z" transform="translate(-48 -48)" fill="#1c9c17" />
                        </svg>
                    </Box>
                    <Typography variant='h4' className="title">Thank you for registering with Sri Swaminathan & Co.</Typography>
                    <Typography className="success-message">Your account has been successfully created.</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Index