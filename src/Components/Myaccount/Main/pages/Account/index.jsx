import { Stack } from '@mui/material';
import React, { useEffect } from 'react';
import "./styles.scss";
import { ACTION_MYACCOUNTCURRENTPAGE } from "../../APIList";
import { useDispatch } from "react-redux";
import AccountData from "./Accountaddress";
import RecentOrder from "./RecentOrder";

const Index = ({ accountCurrentPage, shippingBillingAddress, getAaddress, myRecentOrderData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("My Account"))
  }, [])
  return (
    <Stack className="account-page">
      <Stack className="main_block">
        <AccountData
          accountCurrentPage={accountCurrentPage}
          shippingBillingAddress={shippingBillingAddress}
          getAaddress={getAaddress}
        />
        {
          myRecentOrderData?.length ?
            <RecentOrder
              myRecentOrderData={myRecentOrderData}
            /> : ''
        }
      </Stack>
    </Stack>
  )
}

export default Index;