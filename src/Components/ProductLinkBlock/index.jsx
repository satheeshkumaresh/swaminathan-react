import React from 'react'
import "./styles.scss";
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { ACTION_PLPFILTERPARAMS, ACTION_UPDATEFILTER } from "../../Store/action";

const Index = ({btn_name,btn_link}) => {
    const dispatch = useDispatch();
    return (
        <Stack className='product-link-block'>
            <Stack className='product-link-title'>
                <Link 
                className='link-section seeall_btn' 
                to={btn_link}
                onClick={() => {
                    dispatch(ACTION_PLPFILTERPARAMS({
                      url_key: btn_link,
                    }))
                    dispatch(ACTION_UPDATEFILTER())
                  }}
                >{btn_name}</Link>
            </Stack>
        </Stack>
    )
}

export default Index;
