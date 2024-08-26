import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./styles.scss";
import Account from "./pages/Account";
import Accountinfo from "./pages/Accountinfo";
import Addressbook from "./pages/Addressbook";
import Myorders from "./pages/Myorders";
import Mywishlist from "./pages/Mywishlist";
import Newsletterunt from "./pages/Newsletter";
import Orderdetails from "./pages/Orderdetails";
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, getMyRecentOrders } from "./APIList";

const Index = ({
    accountCurrentPage, setViewOrderLoader, setMyOrderLoader
}) => {
    const location = useLocation();
    const dispatch = useDispatch();
    let [searchParams, setSearchParams] = useSearchParams();
    const url = location?.pathname?.split('/');
    const pathName = location?.pathname?.split('/')?.[2];
    const pathName1 = location?.pathname?.split('/')?.[3];
    const { token,actionmessage } = useSelector(state => {
        return {
            token: state?.token,
            actionmessage: state?.actionmessage
        }
    })
    const [show, setShow] = useState(15);
    const [postPage, setPostPage] = useState(0);
    const [updateInfo, setUpdateInfo] = useState(false)
    const [getAaddress, setGetAaddress] = useState({});
    const [updateAddress, setUpdateAddress] = useState(false);
    const [myRecentOrderData, setMyRecentOrderData] = useState([]);
    
    useEffect(() => {
        getAddress(
            token,
            dispatch,
            searchParams?.get('page'),
            searchParams?.get('show'),
            "0",
            setGetAaddress,
            actionmessage?.isSesstionTimeOut
        )
        
    }, [updateAddress, location])
    useEffect(() => {
        getMyRecentOrders(token, dispatch, setMyRecentOrderData, actionmessage?.isSesstionTimeOut)
    }, [])

    return (
        <>
            <Stack className="account_main_container">
                <Stack className="main_block">
                    {
                        url?.length == 3 ? <>
                            {
                                pathName == "dashboard" ?
                                    <Account
                                        accountCurrentPage={accountCurrentPage}
                                        getAaddress={getAaddress}
                                        myRecentOrderData={myRecentOrderData}
                                    />
                                    : ''
                            }
                            {
                                pathName == "accountinformation" ?
                                    <Accountinfo
                                        accountCurrentPage={accountCurrentPage}
                                        updateInfo={updateInfo}
                                        setUpdateInfo={setUpdateInfo}
                                    /> : ''
                            }
                            {
                                pathName == "addressbook" ?
                                    <Addressbook
                                        accountCurrentPage={accountCurrentPage}
                                        getAaddress={getAaddress}
                                        setUpdateAddress={setUpdateAddress}
                                        updateAddress={updateAddress}
                                        setShow={setShow}
                                        show={show}
                                        setPostPage={setPostPage}
                                        postPage={postPage}
                                    /> : ''
                            }
                            {
                                pathName == "myorders" ? <Myorders accountCurrentPage={accountCurrentPage} setMyOrderLoader={setMyOrderLoader} /> : ''
                            }
                            {
                                pathName == "mywishlist" ? <Mywishlist accountCurrentPage={accountCurrentPage} /> : ''
                            }
                            {
                                pathName == "newsletter-subscription" ? <Newsletterunt accountCurrentPage={accountCurrentPage} /> : ''
                            }
                        </> : <>
                            {
                                pathName1 == "vieworder" ? <Orderdetails setViewOrderLoader={setViewOrderLoader} /> : ''
                            }
                            {
                                location?.pathname == "/account/addressbook/editshipping" ||
                                    location?.pathname == "/account/addressbook/editbilling" ||
                                    location?.pathname == "/account/addressbook/editAddress" ||
                                    location?.pathname == "/account/addressbook/addAddress" ?
                                    <Addressbook
                                        accountCurrentPage={accountCurrentPage}
                                        getAaddress={getAaddress}
                                        setUpdateAddress={setUpdateAddress}
                                        updateAddress={updateAddress}
                                        setShow={setShow}
                                        show={show}
                                        setPostPage={setPostPage}
                                        postPage={postPage}
                                    /> : ''
                            }
                        </>
                    }
                </Stack>
            </Stack>
        </>
    )
}

export default Index;