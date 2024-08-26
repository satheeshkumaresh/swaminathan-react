import React, { useState } from 'react';
import { Stack } from '@mui/material';
import "./styles.scss";
import Viewpopup from '../../../../Assets/Clienticons/swaminathan-icons-14.svg';
import SliderImage from 'react-zoom-slider';
import GalleryPopUp from '../Media/Popup';
import { useSelector } from 'react-redux';

const Index = () => {
    const [openGallery, setOpenGallery] = useState(false);
    const { productData } = useSelector(state => {
        return {
            productData: state?.productData?.[0]?.data?.[0]
        }
    })
    return (
        <>
            <Stack className="media">
                {
                    productData?.product?.media_gallery?.image ?
                        <Stack className="slider-block">
                            <SliderImage
                                data={productData?.product?.media_gallery?.image}
                                width="100%"
                                showDescription={true}
                                direction="right"
                            />
                            <Stack className='view_model_popup' onClick={() => setOpenGallery(true)}>
                                <img src={Viewpopup} title="" alt='View image'/>
                            </Stack>
                        </Stack>
                        : ''
                }
            </Stack>
            {openGallery && <GalleryPopUp
                setOpenGallery={setOpenGallery}
                data={productData?.product?.media_gallery?.image}
            />}
        </>
    )
}

export default Index;