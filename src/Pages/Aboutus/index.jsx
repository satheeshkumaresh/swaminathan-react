import React, { useEffect, useState } from 'react';
import "./about_styles.scss";
import { Typography, Stack, Box } from '@mui/material';
import { Helmet } from "react-helmet-async";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { ACTION_PAGELOADER } from '../../Store/action';
import { customer } from "../../Utilities/Constant";

const Index = () => {
  const dispatch = useDispatch();
  const [aboutData, setAboutData] = useState({});
  // about us API
  const getAboutPageData = async (dispatch, getAboutData) => {
    dispatch(ACTION_PAGELOADER(true));
    try {
      const Response = await axios({
        method: "get",
        url: `${customer()}aboutus`
      });
      dispatch(ACTION_PAGELOADER(false));
      if (Response?.data[0]?.code === 200) {
        getAboutData(Response?.data[0]?.data)
      } else {
        getAboutData({})
      }
    } catch (err) {
      console.log("Error", err)
      dispatch(ACTION_PAGELOADER(false));
    }
  }
  useEffect(() => {
    getAboutPageData(dispatch, setAboutData)
  }, [])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`Sri Swaminathan & Co Kumbakonam |  ${aboutData?.meta_title}`}</title>
        <meta
          name="title"
          content={aboutData?.meta_title}
          data-react-helmet="true"
        />
        <meta
          name="description"
          content={aboutData?.meta_description}
          data-react-helmet="true"
        />
        <meta
          name="keywords"
          content={aboutData?.meta_keywords}
          data-react-helmet="true"
        />
      </Helmet>
      <Stack className='custom-cmc-container aboutus-container about-us-page'>
        <Stack className='block'>
          <Stack className='title-section'>
            <Typography className='main-title' variant='h2'>{aboutData?.page_title}</Typography>
            <Typography className='sub-title' variant='span'>{aboutData?.short_description}</Typography>
          </Stack>

          <Stack className='banner-img-section'>
            {aboutData?.about_us_banner?.map((item, ind) => {
              return (
                <>
                  <img src={item?.desktop} alt="Banner" className='lg desktop' />
                  <img src={item?.mobile} alt="Banner" className='lg mobile' />
                </>
              )
            })}
          </Stack>
          <Stack className='secondary-title-section'>
            <Typography className='main-title' variant='h2'>{aboutData?.title}</Typography>
            <Typography className='sub-title' variant='span'>{aboutData?.description}</Typography>
            <Stack className='banner-img-section'>
              <img src={aboutData?.about_us_image} alt="Founded" className='lg desktop' />
              <img src={aboutData?.about_us_mobile_image} alt="Founded" className='lg mobile' />
            </Stack>
          </Stack>

          <Stack className='about-info-section'>
            <Stack className='about-info'>

              {
                aboutData?.product_manufacturing?.length ?
                  <>
                    <Stack className='manufacturing-section'>
                      <Typography className='title'>{aboutData?.info_section_title1}</Typography>
                      <Stack className='manufacturing-grid-content'>
                        <Stack className='manufacturing-grid'>

                          {aboutData?.product_manufacturing?.map((item, ind) => {
                            return (
                              <Box className='grid'>
                                <img src={item?.image} alt={item?.alt_tag} className='lg' />
                                <Typography className='content'>{item?.description}</Typography>
                              </Box>
                            )
                          })}
                        </Stack>
                      </Stack>
                    </Stack>
                  </>
                  : ''
              }

              {
                aboutData?.wholesale_dealers?.length ?
                  <>
                    <Stack className='wholesale-section'>
                      <Typography className='title'>{aboutData?.info_section_title2}</Typography>
                      <Stack className='wholesale-grid-content'>
                        <Stack className='wholesale-grid'>
                          {aboutData?.wholesale_dealers?.map((item, ind) => {
                            return (
                              <Box className='grid'>
                                <img src={item?.image} alt={item?.alt_tag} className='lg' />
                                <Typography className='content'>{item?.description}</Typography>
                              </Box>
                            )
                          })}
                        </Stack>
                      </Stack>
                    </Stack>
                  </>
                  : ''
              }

            </Stack>
          </Stack>
        </Stack>
      </Stack >
    </>
  )
}

export default Index;