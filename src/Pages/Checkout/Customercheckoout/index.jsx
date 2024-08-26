import React from 'react'
import Customercheckout from '../../../Components/Checkout/Customercheckout';
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
       <Helmet>
        <meta charSet="utf-8" />
        <title>Sri Swaminathan & Co Kumbakonam | Checkout</title>
        <meta
          name="description"
          content="Every block of stone has a statue inside it and it is the task of the sculptor to discover it"
          data-react-helmet="true"
        />
      </Helmet>
      <div>
        <Customercheckout />
      </div>
    </>
  
  )
}

export default Index
