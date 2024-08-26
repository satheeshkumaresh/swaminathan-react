import React, { useEffect, useState, useRef, memo } from 'react'
import "./styles.scss";
import TopHeader from './TopHeader';
import MiddleHeader from './MiddleHeader';
import BottomHeader from './BottomHeader';
import {
    homePageAPI, ACTION_SHOWAUTHENTICATIONPOPUP, ACTION_QUICKVIEW, ACTION_ACTIONMESSAGE,
    ACTION_PAGEMESSAGE, ACTION_PREVIOUSURL, getWishList
} from "../../Store/action";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pageloader from "../Loader/Pageloader";
import Messageblocks from "../Messageblocks";
import LoginRegiter from "../../Pages/UserAuth/Login";
import Forgotpassword from "../../Pages/UserAuth/Forgotpassword";
import Resetpassword from "../../Pages/UserAuth/Resetpassword";
import { guestResetCart } from "../../Components/Checkout/Guestcheckout/APIList";
import { customerResetCart } from "../../Components/Checkout/Customercheckout/APIList";

const Index = ({ headerData, headerLoader }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const {
        homepageData, showAuthencationPopup, quickView, actionmessage, pageMessages,
        previousUrl, isloggeduser, wPageSize, wCurrentPage, token, updateWishlist,
        wishlistData, isOrderComplete
    } = useSelector(state => {
        return {
            homepageData: state?.homepage?.[0],
            showAuthencationPopup: state?.showAuthencationPopup,
            quickView: state?.quickView,
            actionmessage: state?.actionmessage,
            pageMessages: state?.pageMessages,
            previousUrl: state?.previousUrl,
            isloggeduser: state?.isloggeduser,
            wPageSize: state?.wPageSize,
            wCurrentPage: state?.wCurrentPage,
            token: state?.token,
            updateWishlist: state?.updateWishlist,
            wishlistData: state?.wishlistData,
            isOrderComplete: state?.isOrderComplete
        }
    })
    const [hideReset, setHideReset] = useState(false);
    const [homeLoader, setHomeLoader] = useState(false);
    const [wishlistLoader, setWishlistLoader] = useState(false);
    const [formValues, setFormValues] = useState({
        firstname: "",
        lastname: "",
        email: "",
        store_id: 1,
        website_id: 1,
        group_id: 1,
        mobile: "",
        mobile_valid: "",
        countryCode: "",
        password: "",
        confirm_password: ""
    });
    const [loginFormValues, setLoginFormValues] = useState({
        username: "",
        password: ""
    });
    const [email, setEmail] = useState("");
    const [route, setRoute] = useState([]);
    const homepageAPIRef = useRef(0);
    const resetCartRef = useRef(0);

    const quickViewAction = () => {
        dispatch(ACTION_QUICKVIEW())
    }
    useEffect(()=>{
        if (showAuthencationPopup?.loginReg ||
            showAuthencationPopup?.forgotPas ||
            showAuthencationPopup?.resetPass
        ) {
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: false,
                forgotPas: false,
                resetPass: false
            }))
        }
    },[])
    useEffect(() => {
        if (location?.pathname === "/" || location?.pathname === "/resetpassword") {
            if (homepageData?.currency === undefined) {
                if (!homepageAPIRef.current) {
                    homepageAPIRef.current = 1;
                    homePageAPI(dispatch, setHomeLoader)
                }
            }
        }
        // GET PREVIOUS URL
        dispatch(ACTION_PREVIOUSURL([...previousUrl?.slice(-1), location?.pathname]))
        // POPUFUNCTIONALITY
        if (location?.pathname === "/resetpassword" && !showAuthencationPopup?.resetPass) {
            dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                loginReg: false,
                forgotPas: false,
                resetPass: true
            }))
        }
        if (quickView) {
            quickViewAction()
        }
        if (actionmessage?.showPopup) {
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: false,
                title: "",
                message: "",
                showPopup: false,
                redirect: ""
            }))
        }
        // MY ACCOUNT RESTRICTION FOR GUEST USERS
        if (!isloggeduser) {
            if (location?.pathname?.split("/")?.[1] === "account") {
                navigate("/")
                setTimeout(() => {
                    dispatch(ACTION_SHOWAUTHENTICATIONPOPUP({
                        loginReg: true,
                        forgotPas: false,
                        resetPass: false
                    }))
                }, 200);
            }
        }
        // reset cart after page refresh && browser back and forward
        if (isOrderComplete?.isCancel && isOrderComplete?.orderId && !resetCartRef.current) {
            resetCartRef.current = 1;
            setTimeout(() => {
                resetCartRef.current = 0;
            }, 300);
            if (!isloggeduser) {
                guestResetCart(dispatch, isOrderComplete?.orderId);
            } else {
                customerResetCart(token, dispatch, isOrderComplete?.orderId, actionmessage?.isSesstionTimeOut);
            }
        }
    }, [location?.pathname, homepageAPIRef.current])
    useEffect(() => {
        if (previousUrl?.length) {
            setRoute(previousUrl)
        }
    }, [previousUrl]);

    useEffect(() => {
        if (pageMessages?.show) {
            if (
                route?.[0] === "/account/newsletter-subscription" ||
                route?.[0] === "/account/dashboard" ||
                route?.[0] === "/account/myorders" ||
                route?.[0] === "/account/accountinformation" ||
                (route?.[0] === "/" && route?.[1] === "/account/dashboard")
            ) {
                return
            } else {
                dispatch(ACTION_PAGEMESSAGE({
                    show: false,
                    isSuccess: false,
                    isError: false,
                    isWarning: false,
                    message: false,
                    showFor: ""
                }))
            }
        }
    }, [route])

    // wishlist
    useEffect(() => {
        if (location?.pathname === '/account/mywishlist') {
            if (token) {
                getWishList(token, dispatch,
                    searchParams?.get('show') ? searchParams?.get('show') : wPageSize,
                    searchParams?.get('page') ? searchParams?.get('page') : wCurrentPage,
                    setWishlistLoader, actionmessage?.isSesstionTimeOut
                )
            }
        }
    }, [token, location?.pathname === '/account/mywishlist' ? location : ''])
    useEffect(() => {
        if ((!wishlistData?.status && location?.pathname !== '/account/mywishlist') || updateWishlist) {
            if (token) {
                getWishList(token, dispatch, wPageSize, wCurrentPage, setWishlistLoader, actionmessage?.isSesstionTimeOut)
            }
        }
    }, [token, updateWishlist])
    return (
        <>
            <div className={`${location?.pathname?.slice(1) === "checkout" ? 'header checkout_header' : 'header'}`} id='header'>
                <TopHeader headerData={headerData} headerLoader={headerLoader} />
                <MiddleHeader headerData={headerData} headerLoader={headerLoader} />
                <BottomHeader headerData={headerData} />
                {
                    pageMessages?.showFor !== 'minicart' && pageMessages?.showFor !== 'quickview' ?
                        pageMessages?.show ? <Messageblocks /> : ''
                        : ''
                }
            </div>
            {
                showAuthencationPopup?.loginReg &&
                <LoginRegiter
                    formValues={formValues}
                    setFormValues={setFormValues}
                    loginFormValues={loginFormValues}
                    setLoginFormValues={setLoginFormValues}
                    headerData={headerData}
                />
            }
            {
                showAuthencationPopup?.forgotPas &&
                <Forgotpassword
                    email={email}
                    setEmail={setEmail}
                />
            }
            {
                showAuthencationPopup?.resetPass &&
                <Resetpassword
                    setHideReset={setHideReset}
                    hideReset={hideReset}
                />
            }
            {
                homeLoader && <Pageloader />
            }
            {
                wishlistLoader && <Pageloader />
            }
        </>
    )
}

export default memo(Index);
