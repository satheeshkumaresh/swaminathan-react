import React, { memo } from 'react';
import "./styles.scss";
import { useNavigate } from 'react-router-dom';
import { Stack, Box, Typography, Button } from '@mui/material';
import Slider from "react-slick";
import { useSelector } from 'react-redux';

const Index = () => {
    const navigate = useNavigate();
    const { banner, homeApiLoader } = useSelector(state => {
        return {
            banner: state?.homepage?.[0]?.banner,
            homeApiLoader: state?.homeApiLoader
        }
    })
    let dragging = false;

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        dots: true,
        autoplay: false,
        centerPadding: "25%",
        slidesToShow: 1,
        speed: 1000,
        beforeChange: () => dragging = true,
        afterChange: () => dragging = false,
        responsive: [

            {
                breakpoint: 1024,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    centerPadding: "10%",
                }
            },
            {
                breakpoint: 767,
                settings: {
                    infinite: true,
                    slidesToShow: 1,
                    centerPadding: "0%",
                }
            },
        ]
    };

    const slider = <Slider {...settings}>
        {
            homeApiLoader ?
                ['', '', '']?.map((item, index) => {
                    return (
                        <Box className='slider-block' key={index}>
                            {/* desktop */}
                            <Stack className='block image-block desktop-image-section' >
                                <img src='slider.svg' alt="" className='lg' />
                            </Stack>
                            {/* mobile */}
                            <Stack className='block image-block mobile-image-section'>
                                <img src='sliderMobile.svg' alt="" className='lg ' />
                            </Stack>
                        </Box>

                    )
                })
                :
                banner?.map((item, index) => {
                    return (
                        <Box className='slider-block' key={index}>
                            {/* desktop */}
                            <Stack className='block image-block desktop-image-section' >
                                <img src={item?.desktop} alt="" className='lg' />
                                <Stack className='blocks'>
                                    <Stack className='block info-block'>
                                        <Typography
                                            className='dancing_script'
                                            variant='h2'
                                            sx={{
                                                color: item?.title_color
                                            }}
                                        >{item?.content}</Typography>
                                        {
                                            item?.button_text ?
                                                <Button
                                                    className=''
                                                    variant='contained'
                                                    sx={{
                                                        backgroundColor: item?.button_color,
                                                        "&:hover": {
                                                            backgroundColor: item?.button_color
                                                        },
                                                    }}
                                                    onClick={(e) => {
                                                        navigate(item?.button_link)
                                                        dragging && e.preventDefault()
                                                    }}
                                                >{item?.button_text}</Button>
                                                : <></>
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>
                            {/* mobile */}
                            <Stack className='block image-block mobile-image-section'>
                                <img src={item?.mobile} alt={item?.alt_tag} className='lg' />
                                <Stack className='blocks'>
                                    <Stack className='block info-block'>
                                        <Typography
                                            className='dancing_script'
                                            variant='h2'
                                            sx={{
                                                color: item?.title_color
                                            }}
                                        >{item?.content}</Typography>
                                        {
                                            item?.button_text ?
                                                <Button
                                                    className=''
                                                    variant='contained'
                                                    sx={{
                                                        backgroundColor: item?.button_color
                                                    }}
                                                    onClick={(e) => {
                                                        navigate(item?.button_link)
                                                        dragging && e.preventDefault()
                                                    }}
                                                >{item?.button_text}</Button>
                                                : <></>
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>

                    )
                })
        }
    </Slider>

    return (
        <Stack className='container-fluid home-banner-section'>
            <Stack className='slider-container-section'>
                {
                    slider
                }
            </Stack>
        </Stack >
    )
}

export default memo(Index);
