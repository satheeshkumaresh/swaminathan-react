import React from 'react'
import Guestcheckout from '../../../Components/Checkout/Guestcheckout';
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
        <Guestcheckout />
      </div>

    </>
   
  )
}

export default Index
