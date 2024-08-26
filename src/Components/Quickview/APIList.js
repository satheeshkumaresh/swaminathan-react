import axios from "axios";
import { 
    SessionExpiredLogout, ACTION_PAGEMESSAGE, ACTION_UPDATECART
} from '../../Store/action';
import { customer } from "../../Utilities/Constant";

// Customer add
export const customerBuyNowAddcart = async (token, dispatch, sku, qty, setShowRotate, navigate, url, pathName, isSesstionTimeOut) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                sku: sku,
                qty: qty
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}carts/mine/items`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setShowRotate(false)
    }
}

// guestBuyNow
export const guestBuyNowAddcart = async (dispatch, guestCartToken, sku, qty, setShowRotate, navigate, url, pathName) => {
    setShowRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const data = {
            cartItem: {
                quote_id: guestCartToken,
                sku: sku,
                qty: qty
            }
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}guest-carts/${guestCartToken}/items`,
            data
        });
        setShowRotate(false)
        if (Response?.data[0]?.code === 200) {
            if (url) {
                navigate(`/${url}`)
            }
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        } else {
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pathName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setShowRotate(false)
    }
}