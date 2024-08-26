import React,{memo} from 'react';
import "./styles.scss";
import { Typography, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import title from "../../../Assets/skeleton/home/title4.svg";
import chooseImage from "../../../Assets/skeleton/home/choose_image.svg";

const Index = () => {
    const { why_choose_us, homeApiLoader } = useSelector(state => {
        return {
            why_choose_us: state?.homepage?.[0]?.why_choose_us,
            homeApiLoader: state?.homeApiLoader
        }
    })
    const data = (
        homeApiLoader ?
            <Stack className="whychoose-block skeleton">
                <Typography className='whychoose-title' variant="h4">
                    <img src={title} className="whychoose-image-hover" alt="" />
                </Typography>
                <Stack className='whychoose-grid-list'>
                    <>
                        {
                            ['', '', '', '', '', '']?.map((item, index) => {
                                return (
                                    <Stack className="whychoose-grid" key={index} >
                                        <img src={chooseImage} className="whychoose-image-hover" alt="" />
                                        <img src={chooseImage} className="whychoose-image" alt="" />
                                        <Typography className='whychoose-text' variant="h4">
                                            <img src={title} className="whychoose-image-hover" alt="" />
                                            <img src={title} className="whychoose-image" alt="" />
                                        </Typography>
                                    </Stack>
                                )
                            })
                        }
                    </>
                </Stack>

            </Stack>
            :
            <Stack className="whychoose-block">
                <Typography className='whychoose-title' variant="h4">Why Choose Us?</Typography>
                <Stack className='whychoose-grid-list'>
                    <>
                        {
                            why_choose_us?.map((item, index) => {
                                return (
                                    <Stack className="whychoose-grid" key={index} >
                                        <Typography className='image'>
                                            <img src={item?.hover_image} className="whychoose-image" alt="" />
                                            <img src={item?.image} className="whychoose-image-hover" alt="" />
                                        </Typography>
                                        <Typography className='whychoose-text' variant="h4">{item?.caption}</Typography>
                                    </Stack>
                                )
                            })
                        }
                    </>
                </Stack>

            </Stack>
    )
    return (
        <Stack className="whychoose-section">
            <Stack className="container">
                {
                    data
                }
            </Stack>
        </Stack>
    )
}

export default memo(Index);
