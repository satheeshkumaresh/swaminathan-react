import { Typography, Stack } from '@mui/material';
import React, { useRef, useEffect, useState } from 'react';
import "./styles.scss";
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_PAGEMESSAGE } from "../../Store/action";
import warningMessage from "../../Assets/Clienticons/swaminathan-icons-19.svg"

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [messageHeight, setMessageHeight] = useState(0);

    const headerElement = document.getElementById("header");
    const MessageblockHeight = document.getElementById("c_message_block");
    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
            setHeaderHeight(headerElement?.offsetHeight);
            setMessageHeight(MessageblockHeight?.offsetHeight);
        }
        window.addEventListener("scroll", updatePosition);
        updatePosition();
        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return { headerHeight, scrollPosition, messageHeight };
};

const Index = () => {
    const dispatch = useDispatch();
    const { headerHeight, scrollPosition, messageHeight } = useScrollPosition();
    const { pageMessages: { isSuccess, isError, isWarning, message, show, multipleMessages, showFor } } = useSelector(state => {
        return {
            pageMessages: state?.pageMessages
        }
    })
    const focusImage = useRef();
    const timeoutRef = useRef();
    const closeMessagesBox = () => {
        dispatch(ACTION_PAGEMESSAGE({
            show: false,
            isSuccess: false,
            isError: false,
            isWarning: false,
            message: "",
            showFor: "",
            multipleMessages: {}
        }))
    }
    
    useEffect(() => {
        timeoutRef.current = window.setTimeout(() => {
            closeMessagesBox()
        }, 5000);
        return () => clearInterval(timeoutRef.current);
    }, [show])
    return (
        show && isSuccess || isError || isWarning || multipleMessages?.added_cart ||
            multipleMessages?.unavailable || multipleMessages?.grouped_product || true ?
            <Stack
                className={`page-message-block ${scrollPosition > headerHeight ? 'fixed_message_block' : ''} ${showFor == 'quickview' ? 'quickview_view' : ''}`}
                id="c_message_block"
                ref={focusImage}
                sx={{
                    bottom: scrollPosition > headerHeight ? 'auto' : `-${messageHeight}px`,
                    top: scrollPosition > headerHeight ? '0px' : 'auto'
                }}
            >
                {
                    isSuccess ?
                        <Stack className='block success'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.516" height="12.516" viewBox="0 0 12.516 12.516">
                                    <path id="check" d="M6.342,0A6.258,6.258,0,1,0,12.6,6.258,6.258,6.258,0,0,0,6.342,0Zm2.9,4.527-3,4.582,0,0a.57.57,0,0,1-.044.072.562.562,0,0,1-.094.068l-.024.017a.507.507,0,0,1-.153.064c-.018,0-.034.009-.053.013a.528.528,0,0,1-.131,0,.518.518,0,0,1-.092-.014A.553.553,0,0,1,5.56,9.3a.625.625,0,0,1-.075-.03.346.346,0,0,1-.041-.041c-.006-.005-.014-.007-.02-.013L3.678,7.6a.548.548,0,1,1,.743-.8L5.684,7.963l2.64-4.036a.548.548,0,1,1,.917.6Z" transform="translate(-0.084)" fill="#fff" />
                                </svg>
                            </Stack>
                            <Typography className='message'>{message}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.added_cart ?
                        <Stack className='block success'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16.722" height="16.722" viewBox="0 0 16.722 16.722">
                                    <path id="check" d="M8.445,0a8.361,8.361,0,1,0,8.361,8.361A8.361,8.361,0,0,0,8.445,0Zm3.873,6.048-4,6.121s0,0,0,0a.762.762,0,0,1-.059.1.751.751,0,0,1-.125.091l-.032.023a.677.677,0,0,1-.2.086c-.024.006-.046.013-.071.017a.705.705,0,0,1-.176,0,.692.692,0,0,1-.122-.019.74.74,0,0,1-.12-.048.835.835,0,0,1-.1-.04.462.462,0,0,1-.055-.055c-.008-.007-.019-.009-.027-.017L4.885,10.152a.732.732,0,1,1,.993-1.074l1.688,1.562,3.527-5.392a.732.732,0,1,1,1.225.8Z" transform="translate(-0.084)" fill="#5a960b" />
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.added_cart}</Typography>
                        </Stack>
                        : ''
                }
                {
                    isError ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.189" height="15.189" viewBox="0 0 15.189 15.189">
                                    <path id="Icon_ionic-md-information-circle" data-name="Icon ionic-md-information-circle" d="M10.97,3.375a7.595,7.595,0,1,0,7.595,7.595A7.6,7.6,0,0,0,10.97,3.375Zm.767,11.392H10.2V10.2h1.534Zm0-6.061H10.2V7.172h1.534Z" transform="translate(-3.375 -3.375)" fill="#fff" />
                                </svg>
                            </Stack>
                            <Typography className='message'>{message}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.grouped_product ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.grouped_product}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.orderid_validation ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.orderid_validation}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.stock_error ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.stock_error}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.unavailable ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.unavailable}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.qty_unavailable ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.qty_unavailable}</Typography>
                        </Stack>
                        : ''
                }
                {
                    multipleMessages?.salableQty ?
                        <Stack className='block error'>
                            <Stack className='icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.883" height="15.883" viewBox="0 0 15.883 15.883">
                                    <g id="error-standard-solid" transform="translate(-2.667 -2.8)">
                                        <path id="Path_6265" data-name="Path 6265" d="M10.608,2.8a7.941,7.941,0,1,0,7.941,7.941A7.941,7.941,0,0,0,10.608,2.8ZM9.913,6.125a.695.695,0,0,1,1.39,0v5.956a.695.695,0,1,1-1.39,0Zm.695,9.828a.893.893,0,1,1,.893-.893A.893.893,0,0,1,10.608,15.953Z" transform="translate(0 0)" fill="#842121" />
                                    </g>
                                </svg>
                            </Stack>
                            <Typography className='message'>{multipleMessages?.salableQty}</Typography>
                        </Stack>
                        : ''
                }
                {
                    isWarning ?
                        <Stack className='block warning'>
                            <Stack className='icon'>
                                <img src={warningMessage} alt='WarningMessage' />
                            </Stack>
                            <Typography className='message'>{message}</Typography>
                        </Stack>
                        : ''
                }
            </Stack> : ''
    )
}

export default Index;