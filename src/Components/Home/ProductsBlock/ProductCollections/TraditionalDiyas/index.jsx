import React, {memo} from 'react';
import "./styles.scss";
import { Stack, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import traditinalDiyas from '../../../../../Assets/skeleton/home/traditinalDiyas1.svg';

const Index = () => {
  const navigate = useNavigate();
  const { traditional_diyas, homeApiLoader } = useSelector(state => {
    return {
      traditional_diyas: state?.homepage?.[0]?.tile1,
      homeApiLoader: state?.homeApiLoader
    }
  })
  const data = (
    homeApiLoader ?
      <>
        <img src={traditinalDiyas} className='mobile-section-img' alt={traditional_diyas?.url} />
        <img src={traditinalDiyas} className='tab-section-img' alt={traditional_diyas?.url} />
      </>
      :
      <>
        <img src={traditional_diyas?.image} className='mobile-section-img' alt={traditional_diyas?.url} loading="lazy"/>
        <img src={traditional_diyas?.image} className='tab-section-img' alt={traditional_diyas?.url} loading="lazy"/>
        <Link className='tag-img link-btn-section' to={traditional_diyas?.url}>
          <Button
            className='common-image-btn product-addcart-btn'
            fullWidth
            onClick={() => navigate(`${traditional_diyas?.url}`)}
          >View Products</Button>
        </Link>
      </>
  )
  return (
    <Stack className='tradition-grid-section'>
      <Stack className='traditional-section'>
        {
          data
        }
      </Stack>
    </Stack>
  )
}

export default memo(Index);
