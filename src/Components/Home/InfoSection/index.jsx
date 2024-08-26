import React, { memo } from 'react';
import "./styles.scss";
import { Typography, Stack, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import aboutImage from "../../../Assets/skeleton/home/about.svg";

const Index = () => {
  const { about_us_content, homeApiLoader } = useSelector(state => {
    return {
      about_us_content: state?.homepage?.[0]?.about_us_content,
      homeApiLoader: state?.homeApiLoader
    }
  })
  const data = (
    homeApiLoader ?
      <Stack className='anywhere-section skeleton'>
        <img src={aboutImage} alt='' />
      </Stack>
      :
      about_us_content?.length === 0 ?
        <Stack> </Stack >
        :
        <>
          <Stack className='anywhere-section'>
            <Typography className='info-section' variant="span" dangerouslySetInnerHTML={{ __html: about_us_content?.about_us }}></Typography>
          </Stack>
          <Stack className='manufacture-product-section'>
            <Stack className='readmore-less-section' >
            </Stack>
            <>
              <List className='manufacture-list'>
                <ListItem>
                  <Link className='showMore' to={`/${about_us_content?.read_more_url}`}><Typography className='showMore'>Additional Information</Typography></Link>
                </ListItem>
              </List>
            </>
          </Stack>
        </>
  )
  return (
    <Stack className='info-section-block'>
      <Stack className='container'>
        {
          data
        }
      </Stack>

    </Stack>
  )
}

export default memo(Index);
