import { Stack, Box } from '@mui/material';
import React, { useState } from 'react';
import "./styles.scss";
import Sidebar from "../../Components/Myaccount/Sidebar";
import Main from "../../Components/Myaccount/Main";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Pageloader from "../../Components/Loader/Pageloader";

const Index = () => {
  const { accountCurrentPage } = useSelector(state => {
    return {
      accountCurrentPage: state?.accountCurrentPage
    }
  })
  const [viewOrderLoader, setViewOrderLoader] = useState(false);
  const [myOrderLoader, setMyOrderLoader] = useState(false);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sri Swaminathan & Co Kumbakonam | My Account</title>
        <meta
          name="description"
          content="Every block of stone has a statue inside it and it is the task of the sculptor to discover it"
          data-react-helmet="true"
        />
      </Helmet>
      <Stack className="myaccount_container">
        <Stack className="account_section">
          <Box className='pagelayout'>
            <Sidebar />
            <Main
              accountCurrentPage={accountCurrentPage}
              setViewOrderLoader={setViewOrderLoader}
              setMyOrderLoader={setMyOrderLoader}
            />
          </Box>
        </Stack>
      </Stack>
      {viewOrderLoader && <Pageloader />}
      {myOrderLoader && <Pageloader />}
    </>
  )
}

export default Index;