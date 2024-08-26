import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { ACTION_PAGELOADER, ACTION_ACTIONMESSAGE } from '../../Store/action';
import { productUrl } from "../../Utilities/Constant";

const Index = () => {
  const dispatch = useDispatch();
  const [cmsData, setCmsData] = useState({});
  // cms pages
  const cmsPages = async (dispatch, url_key, setCmsData) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
      const data = {
        data: {
          url_key: url_key
        }
      }
      const Response = await axios.post(productUrl(), data);
      dispatch(ACTION_PAGELOADER(false));
      if (Response?.data[0]?.code === 200) {
        setCmsData(Response?.data[0]?.data?.[0])
      } else {
        dispatch(ACTION_ACTIONMESSAGE({
          isSuccess: false,
          isWarning: false,
          isError: true,
          title: "Failed to load product",
          message: Response?.data[0]?.message,
          showPopup: true
        }))
      }
    } catch (err) {
      console.log("Error", err)
      dispatch(ACTION_PAGELOADER(false));
    }
  }
  useEffect(() => {
    cmsPages(dispatch, "refund-policy", setCmsData)
  }, [])
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`Sri Swaminathan & Co Kumbakonam |  ${cmsData?.content?.meta_title}`}</title>
        <meta
          name="title"
          content={cmsData?.content?.meta_title}
          data-react-helmet="true"
        />
        <meta
          name="description"
          content={cmsData?.content?.meta_description}
          data-react-helmet="true"
        />
        <meta
          name="keywords"
          content={cmsData?.content?.meta_keywords}
          data-react-helmet="true"
        />
      </Helmet>
      <Stack className='custom-cmc-container refund-policy-container'>
        <Stack className='block'>
          <Stack className='page-data' dangerouslySetInnerHTML={{ __html: cmsData?.content?.content }}></Stack>
        </Stack>
      </Stack>
    </>
  )
}

export default Index;