import axios from "axios";
import {
    SessionExpiredLogout, ACTION_PAGELOADER, ACTION_PAGEMESSAGE,
    ACTION_UPDATECART, ACTION_ACTIONMESSAGE
} from '../../Store/action';
import { customer } from "../../Utilities/Constant";

// Customer delete
export const deleteCutomerCartItems = async (token, dispatch, item_id, setOpen, pageName, isSesstionTimeOut) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}carts/mine/items/${item_id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(ACTION_PAGELOADER(false));
        setOpen(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
        } else {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
        setOpen(false)
    }
}
// customer delete all cartitems
export const deleteAllCartItems = async (token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, pageName, isSesstionTimeOut) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}deleteallcart/${cartId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
    }
}
// Customer update
export const updateCutomerCartItems = async (token, dispatch, item_id, data, setRotate, setRotateSameId, pageName, isSesstionTimeOut) => {
    setRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
        const Response = await axios.put(`${customer()}carts/mine/items/${item_id}`, data, {
            headers: headers
        });
        setRotate(false)
        setRotateSameId(null)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        if (err?.response?.status == 401 && !isSesstionTimeOut) {
            SessionExpiredLogout(dispatch)
        }
        console.log("Error", err)
        setRotate(false)
    }
}
// updateGuestCart
export const updateGuestCart = async (dispatch, guestCartToken, item_id, data, setRotate, setRotateSameId, pageName) => {
    setRotate(true)
    dispatch(ACTION_PAGEMESSAGE({
        show: false,
        isSuccess: false,
        isError: false,
        isWarning: false,
        message: "",
        showFor: ""
    }))
    try {
        const Response = await axios({
            method: "put",
            url: `${customer()}guest-carts/${guestCartToken}/items/${item_id}`,
            data
        });
        setRotate(false)
        setRotateSameId(null)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: true,
                isError: false,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        } else {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setRotate(false)
    }
}
// deleteGuestCart
export const deleteGuestCart = async (guestCartToken, dispatch, item_id, setOpen, pageName) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios.delete(`${customer()}guest-carts/${guestCartToken}/items/${item_id}`);
        setOpen(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART())
        } else {
            dispatch(ACTION_UPDATECART())
            dispatch(ACTION_PAGEMESSAGE({
                show: true,
                isSuccess: false,
                isError: true,
                isWarning: false,
                message: Response?.data[0]?.message,
                showFor: pageName
            }))
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_PAGELOADER(false));
        setOpen(false)
    }
}
// guest delete all cartitems
export const deleteGuestAllCartItems = async (token, dispatch, cartId, setOpen, setIsDeleteAll, navigate, pageName) => {
    setOpen(false)
    dispatch(ACTION_PAGELOADER(true));
    try {
        const Response = await axios({
            method: "delete",
            url: `${customer()}guest-carts/deleteallcart/${token}`,
        });
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: true,
                isWarning: false,
                isError: false,
                title: "Mycart",
                message: Response?.data[0]?.message,
                showPopup: true,
                redirect: ""
            }))
        } else {
            dispatch(ACTION_UPDATECART());
            dispatch(ACTION_ACTIONMESSAGE({
                isSuccess: false,
                isWarning: false,
                isError: true,
                title: "Mycart",
                message: Response?.data[0]?.message,
                showPopup: true
            }))
        }
    } catch (err) {
        console.log("Error", err)
        setOpen(false)
        setIsDeleteAll(false)
        dispatch(ACTION_PAGELOADER(false));
    }
}