import React,{memo} from 'react';
import "./styles.scss";
import { Stack } from '@mui/material';
import Slider from './Slider';
import InfoSection from './InfoSection';
import WhyChoose from './WhyChoose';
import Testimonial from './Testimonial';
import ProductBlocks from './ProductsBlock';
import { useSelector } from 'react-redux';

const Index = ({ headerLoader }) => {
    const { testimonials } = useSelector(state => {
        return {
            testimonials: state?.homepage?.[0]?.testimonials,
        }
    })
    return (
        <div>
            <Slider headerLoader={headerLoader} />
            <ProductBlocks />
            <Stack className={`info-choose-section ${headerLoader ? 'skeleton' : ''}`}>
                <Stack className='container-section'>
                    <InfoSection />
                    <WhyChoose />
                </Stack>
            </Stack>
            {
                testimonials?.[0]?.testimonials?.length ?
                    <Testimonial />
                    : ''
            }
        </div>
    )
}

export default memo(Index);
