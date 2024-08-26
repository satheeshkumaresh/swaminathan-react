import React, { useState, useRef, useEffect } from 'react';
import "../styles.scss";
import { Box, Stack, Typography } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Index = ({ data, clsName, setShow, appliedShow, totalData }) => {
    const [isActive, setisActive] = useState(false);
    const [selectedcategory, setSelectedcategory] = useState("");
    const ref = useRef();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        setSelectedcategory(appliedShow)
    }, [appliedShow])
    return (
        <ClickAwayListener onClickAway={() => setisActive(false)}>
            <Stack className={`form-select ${clsName} myaccount`}>
                <Box className='select-dropdown'>
                    <Box className='custom-dropdown' ref={ref}>
                        <Box className="dropdown-btn"
                            onClick={
                                () => {
                                    setisActive(!isActive)
                                }
                            }
                        >
                            <Typography variant='span' className='labelname'>
                                {selectedcategory?.length ? selectedcategory : data?.[0]?.label}
                            </Typography>
                            <Typography variant='span' className='drop-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12.257" height="6.54" viewBox="0 0 12.257 6.54">
                                    <path id="_1acaf6b70816ed66265a220e44035b82" data-name="1acaf6b70816ed66265a220e44035b82" d="M.733.121a.446.446,0,0,0-.611,0,.446.446,0,0,0,0,.611L5.515,6.126.121,11.52a.446.446,0,0,0,0,.611.421.421,0,0,0,.306.126.421.421,0,0,0,.306-.126l5.681-5.7a.51.51,0,0,0,.126-.306.51.51,0,0,0-.126-.306Z" transform="translate(12.257) rotate(90)" />
                                </svg>
                            </Typography>
                        </Box>
                        {
                            isActive &&

                            <Box className="dropdown-content">
                                {
                                    data?.map((item, ind) =>
                                        <Typography className='dropdown-item' value={item?.value} key={ind}
                                            onClick={
                                                () => {
                                                    const pageCount = Math.ceil(totalData / parseInt(item?.value));
                                                    const current_Page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
                                                    setSelectedcategory(item?.label)
                                                    setisActive(false)
                                                    if (current_Page > pageCount) {
                                                        navigate(
                                                            {
                                                                search: `&show=${item?.value}${searchParams.get('page') ? `&page=${pageCount}` : ''}`,
                                                            }
                                                        )
                                                    } else {
                                                        navigate(
                                                            {
                                                                search: `&show=${item?.value}${searchParams.get('page') ? `&page=${searchParams.get('page')}` : ''}`,
                                                            }
                                                        )
                                                    }
                                                }
                                            }
                                        >{item?.label}</Typography>)
                                }
                            </Box>
                        }
                    </Box>
                </Box>
            </Stack>
        </ClickAwayListener>
    )
}

export default Index;