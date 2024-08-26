import { Stack, Typography } from '@mui/material';
import React from 'react';
import "./styles.scss";
import { Data } from "./Data";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Action_Logout } from "../../../Store/action";
import { useDispatch } from 'react-redux';

const Index = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location?.pathname?.split('/')?.[2];
    return (
        <Stack className="account_sidebar">
            <Stack className="sidebar_block">
                {
                    Data?.map((itm, ind) => {
                        return (
                            <Stack className="pages_list_items" key={ind}>
                                {
                                    itm?.link == "logout" ?
                                        <Typography className="pages logout"
                                            onClick={() => {
                                                Action_Logout(dispatch, navigate)
                                            }}
                                        >{itm?.page}</Typography>
                                        :
                                        <Link 
                                        className={`pages ${pathName==itm?.link?'active':''}`}
                                        to={`/account/${itm?.link}`}>{itm?.page}</Link>
                                }
                            </Stack>
                        )
                    })
                }
            </Stack>
        </Stack>
    )
}

export default Index;