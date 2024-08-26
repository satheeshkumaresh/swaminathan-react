import React, { useEffect, useRef, useState, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme";
import { persister } from './Store/store';
import { PersistGate } from 'redux-persist/integration/react';
import './App.scss';
import "slick-carousel/slick/slick.css";
import "./slick-theme.css";
import {
  ACTION_QUICKVIEW, getCutomerCartItems,
  getGuestQuoteToken,
  getGuestCartToken, getGuestCart,
  getGuestQuote,
  getCountry, getStates, getAccountInfo,
  getHeaderFooter, customerMergeCart, addWishList,
  SessionExpiredLogout
} from "./Store/action";
import CircularProgress from "@mui/material/CircularProgress";
// Store data
import { useSelector, useDispatch } from 'react-redux';
import { Stack } from "@mui/material";
import Pageloader from "./Components/Loader/Pageloader";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SmoothScroll from "./Components/SmoothScroll";
import Messagepopup from "./Components/Model/Messagepopup";
import Quickview from "./Components/Quickview";
import AppRoutes from "./AppRoutes";

const App = (condition = true) => {
  const dispatch = useDispatch();
  const isCalledRef = useRef(false);
  const { pageloader, actionmessage, quickView,
    token, guestCartToken, updateCart,
    isCountrySelected, countryCode,
    isloggeduser, updateUserData, createCartId, isGuestCartData,
    userdata, wilistProductId, isOrderComplete
  } = useSelector(state => {
    return {
      pageloader: state?.pageloader,
      actionmessage: state?.actionmessage,
      quickView: state?.quickView,
      token: state?.token,
      guestCartToken: state?.guestCartToken,
      updateCart: state?.updateCart,
      isCountrySelected: state?.isCountrySelected,
      countryCode: state?.countryCode,
      isloggeduser: state?.isloggeduser,
      updateUserData: state?.updateUserData,
      createCartId: state?.createCartId,
      isGuestCartData: state?.isGuestCartData,
      userdata: state?.userdata,
      wilistProductId: state?.wilistProductId,
      isOrderComplete: state?.isOrderComplete
    }
  })
  const [headerLoader, setHeaderLoader] = useState(true);
  const [cartItemLoader, setCartItemLoader] = useState(false);
  const [headerFooterData, setGetHeaderFooterData] = useState({})
  const countryRef = useRef(0);
  const statesRef = useRef(0);
  const headerFooterRef = useRef(0);
  const getCartRef = useRef(0);

  const quickViewAction = () => {
    dispatch(ACTION_QUICKVIEW())
  }
  useEffect(() => {
    if (condition && !isCalledRef.current) {
      isCalledRef.current = true;
      if (token == "" && guestCartToken == "") {
        getGuestCartToken(dispatch, true)
        getGuestCartToken(dispatch,true)
      }
    }
  }, [condition])
  useEffect(() => {
    if (!getCartRef.current && !isOrderComplete?.isCancel && !isOrderComplete?.orderId) {
      getCartRef.current = 1;
      if (token) {
        setTimeout(()=>{
          getGuestQuote(dispatch, guestCartToken, setCartItemLoader)
        },1000)
        // getGuestQuote(dispatch, guestCartToken, setCartItemLoader)
        getCutomerCartItems(token, dispatch, setCartItemLoader, actionmessage?.isSesstionTimeOut)
      } else if (guestCartToken) {
        getGuestCart(dispatch, guestCartToken, setCartItemLoader)
        setTimeout(()=>{
          getGuestQuote(dispatch, guestCartToken, setCartItemLoader)
        },1000)
       
      }
      setTimeout(() => {
        getCartRef.current = 0;
      }, 300);
    }
  }, [token, updateCart])

  useEffect(() => {
    if (!countryRef.current) {
      countryRef.current = 1;
      getCountry(dispatch)
    }
  }, [countryRef.current])
  useEffect(() => {
    if (!statesRef.current && countryRef.current) {
      statesRef.current = 1;
      getStates(dispatch, "IN")
    }
  }, [isCountrySelected, countryCode, countryRef, statesRef.current])
  useEffect(() => {
    if (isloggeduser) {
      getAccountInfo(token, dispatch, actionmessage?.isSesstionTimeOut)
    }
  }, [isloggeduser, updateUserData])
  useEffect(() => {
    if (!headerFooterRef.current) {
      headerFooterRef.current = 1;
      getHeaderFooter(dispatch, setGetHeaderFooterData, setHeaderLoader);
    }
  }, [headerFooterRef.current])
  useEffect(() => {
    if (isGuestCartData) {
      if (createCartId !== null && userdata?.id !== undefined) {
        customerMergeCart(token, dispatch, guestCartToken, userdata?.id, actionmessage?.isSesstionTimeOut)
      }
    }
  }, [createCartId, userdata?.id])
  useEffect(() => {
    if (isloggeduser && wilistProductId !== "") {
      addWishList(token, dispatch, wilistProductId, false, "", actionmessage?.isSesstionTimeOut)
    }
  }, [isloggeduser, wilistProductId])

  //  SessionLogout Using TimeIntervals
  const time = useRef(7200);
  window.onkeyup = () => {
    localStorage.setItem("auth_time_calc", 7200);
    time.current = 7200;
  };
  window.onmousemove = () => {
    localStorage.setItem("auth_time_calc", 7200);
    time.current = 7200;
  };
  useEffect(() => {
    if (time.current && isloggeduser) {
      const interval = setInterval(() => {
        let t = time.current - 1;
        time.current = t;
        if (localStorage.getItem("auth_time_calc") == 1) {
          SessionExpiredLogout(dispatch);
        } else {
          localStorage.setItem("auth_time_calc", t);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isloggeduser]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <PersistGate loading={null} persistor={persister}>
          <Router>
            <Header headerData={headerFooterData} headerLoader={headerLoader} />
            <SmoothScroll />
            <Suspense
              fallback={
                <Stack className="lazy_loader_content"
                  sx={{
                    width: '100%',
                    height: '100vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:"rgba(0,0,0,0.08)"
                  }}
                >
                  <CircularProgress />
                </Stack>
              }
            >
              <AppRoutes
                headerLoader={headerLoader}
                headerFooterData={headerFooterData}
                isloggeduser={isloggeduser}
              />
            </Suspense>

            <Footer footerData={headerFooterData} headerLoader={headerLoader} />
            {/* Pageloaders */}
            {headerLoader && <Pageloader />}
            {cartItemLoader && <Pageloader />}
            {pageloader && <Pageloader />}
            {actionmessage?.showPopup && <Messagepopup />}
            {quickView ?
              <Quickview
                name="product-measurement"
                cname="measurement"
                closePpup={quickViewAction}
              />
              : ""
            }
          </Router>
        </PersistGate>
      </ThemeProvider>
    </div>
  );
}

export default App;
