import axios from "axios";
import { ACTION_SCROLLTOTOP, ACTION_GET_PRODUCLISTTDATA } from '../../../Store/action';
import { customer, productUrl } from "../../../Utilities/Constant";

// plp API
export const productListAPI = async (dispatch, params, navigate, setPlpLoader) => {
    setPlpLoader(true)
    dispatch(ACTION_GET_PRODUCLISTTDATA([]));
    dispatch(ACTION_SCROLLTOTOP())
    try {
        const data = {
            data: params
        }
        const Response = await axios({
            method: "post",
            url: productUrl(),
            data
        });
        dispatch(ACTION_SCROLLTOTOP())
        setPlpLoader(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_PRODUCLISTTDATA(Response?.data))
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_GET_PRODUCLISTTDATA([]))
        setPlpLoader(false)
    }
}

// search result API
export const productSearchResultAPI = async (dispatch, params, navigate, setPlpLoader) => {
    setPlpLoader(true)
    dispatch(ACTION_GET_PRODUCLISTTDATA([]));
    dispatch(ACTION_SCROLLTOTOP())
    try {
        const data = {
            data: params
        }
        const Response = await axios({
            method: "post",
            url: `${customer()}searchResult`,
            data
        });
        dispatch(ACTION_SCROLLTOTOP())
        setPlpLoader(false)
        if (Response?.data[0]?.code === 200) {
            dispatch(ACTION_GET_PRODUCLISTTDATA(Response?.data))
            setPlpLoader(false)
        }
    } catch (err) {
        console.log("Error", err)
        dispatch(ACTION_GET_PRODUCLISTTDATA([]))
        setPlpLoader(false)
    }
}