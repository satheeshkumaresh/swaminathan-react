import React, {memo} from 'react';
import "./styles.scss";
import { Typography, Stack } from '@mui/material';
import MobileIcon from '../../../Assets/Clienticons/swaminathan-icons-26.svg';
import EmailIcon from '../../../Assets/Clienticons/swaminathan-icons-25.svg';
import largeTitle from '../../../Assets/skeleton/home/largeTitle.svg'

const Index = ({ headerData, headerLoader }) => {
  return (

    <Stack className="primary-header">
      <Stack className='container'>
        <Stack className='row'>
          <Stack className='mobile-email-section'>
            {
              headerLoader ?

                ['', ''].map((item, ind) => {
                  return (
                    <Stack className='mail-section mail_section_skeleton' key={ind}>
                      <Typography className='mail-text'>
                        <img src={largeTitle} alt="contact"/>
                      </Typography>
                    </Stack>
                  )
                })
                :
                <>
                  <Stack className='mobile-section'>
                    <img src={MobileIcon} alt='Mobile' />
                    <Typography className='mobile-number'>
                      <a href={`tel:${headerData?.mobile_number}`}>{headerData?.mobile_number}</a>
                    </Typography>
                  </Stack>
                  <Stack className='mail-section'>
                    <img src={EmailIcon} alt='Email' />
                    <Typography className='mail-text'>
                      <a href={`mailto:${headerData?.email_address}`}>{headerData?.email_address}</a>
                    </Typography>
                  </Stack>
                </>
            }
          </Stack>

          <Stack className='social-icon-section'>
            <Stack className='icon-list'>
              {headerData?.follow_us?.map((item, index) => {
                return (
                  <a href={item?.link} target="_blank" title={item?.title} key={index}>
                    <img src={item?.header_image} alt={item?.title} />
                  </a>
                )
              })}
            </Stack>

          </Stack>
        </Stack>
      </Stack>

    </Stack>

  )
}

export default memo(Index);
