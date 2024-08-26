import React, { useState, memo } from 'react';
import "./styles.scss";
import Rating from '@mui/material/Rating';
import { Stack, Box, Typography, Button } from '@mui/material';
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import ClickAwayListener from '@mui/base/ClickAwayListener';
import Initial from "../../../Assets/skeleton/home/testimonial_initial.svg";
import Loader1 from "../../../Assets/skeleton/home/testimonial/loader1.svg";
import Loader2 from "../../../Assets/skeleton/home/testimonial/loader2.svg";
import Loader3 from "../../../Assets/skeleton/home/testimonial/loader3.svg";
import { getDataFormat } from "../../../Utilities/Utilities";

const Index = () => {
  const { testimonials, homeApiLoader } = useSelector(state => {
    return {
      testimonials: state?.homepage?.[0]?.testimonials,
      homeApiLoader: state?.homeApiLoader
    }
  })
  const [testId, setTestId] = useState(null);
  const showTestimonial = 320;
  const settings = {
    dots: true,
    infinite: testimonials?.[0]?.testimonials?.length > 4 ? true : false,
    speed: 500,
    initialSlide: 1,
    slidesToShow: 4,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1380,
        settings: {
          infinite: testimonials?.[0]?.testimonials?.length > 3 ? true : false,
          slidesToShow: 3,
          initialSlide: 1
        }
      },
      {
        breakpoint: 991,
        settings: {
          infinite: testimonials?.[0]?.testimonials?.length > 2 ? true : false,
          slidesToShow: 2,
          initialSlide: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          infinite: true,
          slidesToShow: testimonials?.[0]?.testimonials?.length > 2 ? true : false,
          initialSlide: 1
        }
      },
      {
        breakpoint: 520,
        settings: {
          infinite: testimonials?.[0]?.testimonials?.length > 1 ? true : false,
          slidesToShow: 1,
        }
      }
    ]
  };
  const sliderData = (
    homeApiLoader ?
      ['', '', '', '', '']?.map((item, ind) => {
        return (
          <Stack key={ind}>
            <Stack className='stack-section skeleton' key={ind}>
              <Typography className='name-first-char'>
                <img src={Initial} alt='' width="100%" />
              </Typography>
              <Stack className='testimonial-slide-item'>
                <Stack className='testimonial-block'>
                  <Typography className='client-name'>
                    <img src={Loader1} alt='' width="100%" />
                  </Typography>
                  <Stack className='rating-date-section'>
                    <img src={Loader2} alt='' />
                  </Stack>
                  <Box className='description'>
                    <img src={Loader3} alt='' width="100%" />
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )
      })
      :
      testimonials?.[0]?.testimonials?.map((item, ind) => {
        return (
          <Stack key={ind}>
            <Stack className='stack-section'
              onClick={() => {
                if (testId !== null) {
                  if (testId !== ind) {
                    setTestId(null)
                  }
                }
              }}
            >
              <Typography className='name-first-char'>{item?.name?.charAt(0)}</Typography>
              <Stack className={`testimonial-slide-item
                    ${item?.message?.length > 320 && "readmore-active"}
                    `}
              >
                <Stack className={`${testId === ind ? 'testimonial-block readmore' : 'testimonial-block'}`}>
                  <Typography className='client-name'>{item?.name}</Typography>
                  <Stack className='rating-date-section'>
                    <Rating name="read-only" value={parseInt(item?.rating)} readOnly />
                    <Typography className='date'>{getDataFormat(item?.date)}</Typography>
                  </Stack>
                  <Box className={`${testId === ind ? 'description more-desc' : 'description'}`}>
                    <Typography className='content'>{item?.message?.slice(0, testId === ind && testId === null ? showTestimonial : -1)}</Typography>
                    {
                      item?.message?.length > 320 && testId !== ind ?
                        <Button
                          className='read-more'
                          onClick={() => {
                            setTestId(ind)
                          }}
                        >
                          Read More
                        </Button>
                        : ''
                    }
                    {
                      testId !== null && testId === ind ?
                        <Button
                          className='read-more'
                          onClick={() => {
                            setTestId(null)
                          }}
                        >
                          Read Less
                        </Button>
                        : ''
                    }
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )
      })
  )
  const titleData = (
    homeApiLoader ?
      <Typography className='block-title testimonial-section'>
        <img src={Loader1} alt='' />
      </Typography>
      :
      <Typography className='block-title testimonial-section'>What Our Customers Say</Typography>
  )
  return (
    <Stack className='home-client-testimonial'>
      <Stack className='container'>
        <Stack className='row title-row'>
          {
            titleData
          }
        </Stack>
        <ClickAwayListener
          onClickAway={() => {
            if (testId !== null) {
              setTestId(null)
            }
          }}>
          <Stack className={`${testId !== null ? 'row testimonial-slider readmore' : 'row testimonial-slider'}`}>
            {sliderData &&
              <Slider {...settings}>
                {sliderData}
              </Slider>
            }
          </Stack>
        </ClickAwayListener>
      </Stack>
    </Stack>
  )
}
export default memo(Index);