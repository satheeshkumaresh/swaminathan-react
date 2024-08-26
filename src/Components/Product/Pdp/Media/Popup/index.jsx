import { Box, Stack } from '@mui/material';
import React, { useRef, useEffect, useState } from 'react';
import "./styles.scss";
import Slider from "react-slick";
import CloseIcon from '@mui/icons-material/Close';

const Index = ({ setOpenGallery, data }) => {
    const [activeSlider, setActiveSlider] = useState(0);
    const mediaPopupImageRef = useRef();
    const mediaPopupClose = useRef();
    const focusImage = useRef();
    const handleOnClick = (index) => {
        setActiveSlider(index)
        mediaPopupImageRef.current.slickGoTo(index);
    };
    const settings = {
        initialSlide: 0,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (currentSlide, nextSlide) => {
            setActiveSlider(nextSlide);
        }
    };
    document.addEventListener("mousedown", (event) => {
        if (mediaPopupClose.current && !mediaPopupClose.current.contains(event.target)) {
            setOpenGallery(false)
        }
    });
    useEffect(() => {
        focusImage.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }, [activeSlider]);
    return (
        <Stack className='Gallerypopup'>
            <Stack className='container' ref={mediaPopupClose}>
                <Stack className='close-section'>
                    <Box className='close-icon'>
                        <CloseIcon onClick={() => setOpenGallery(false)} />
                    </Box>
                </Stack>
                <Stack className='notify-section' id="media-popup-close">
                    <Stack className='block'>
                        <Stack className='slide-items'>
                            <Slider {...settings} ref={mediaPopupImageRef}>
                                {
                                    data?.map((item, ind) => {
                                        return (
                                            <Stack className='single_image' key={ind}>
                                                <Box className='image'>
                                                    <img src={item?.image} alt='Product image'/>
                                                </Box>
                                            </Stack>
                                        )
                                    })
                                }
                            </Slider>
                        </Stack>
                    </Stack>

                    <Stack className='popup-thumbnail-block'>
                        <Stack className="image_thumb_block">
                            {data?.map((item, ind) => {
                                return (
                                    <Stack className={`image_list ${activeSlider == ind ? 'active' : ""}`}
                                        onClick={() => {
                                            handleOnClick(ind)
                                        }}
                                        ref={activeSlider == ind ? focusImage : null}
                                    >
                                        <Box className='image-space'>
                                            <img src={item?.image}  alt='Product thumbnail image'/>
                                        </Box>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </Stack>

                </Stack>
            </Stack>
        </Stack>
    )
}

export default Index;