import React from 'react';
import "./styles.scss";
import { Box, Stack, Button } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener';

const Index = ({
  name, cname, closePpup, data, action, hideCloseIcon, enableAlert, alertMessage
}) => {
  
  return (
    <Stack className={`custom-model ${name}-model`}>
      <ClickAwayListener onClickAway={closePpup}>
        <Stack className={`model-container ${cname}-container`}>
          {
            hideCloseIcon ?
              <Box className="close-btn" onClick={closePpup}>
                <svg id="Group_3123" data-name="Group 3123" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect id="Rectangle_2261" data-name="Rectangle 2261" width="24" height="24" fill="#fff" />
                  <g id="close" transform="translate(5.337 5.337)">
                    <g id="Group_2837" data-name="Group 2837">
                      <path id="Path_11420" data-name="Path 11420" d="M10.517,9.29a.868.868,0,1,0-1.228,1.228L14.3,15.534,9.288,20.549a.868.868,0,1,0,1.228,1.228l5.016-5.015,5.015,5.015a.868.868,0,1,0,1.228-1.228l-5.015-5.015,5.015-5.015A.868.868,0,1,0,20.548,9.29l-5.015,5.015L10.517,9.29Z" transform="translate(-9.034 -9.036)" fill="#898d94" />
                    </g>
                  </g>
                </svg>
              </Box> : ''
          }
          {
            data
          }
          {
            enableAlert ?
              <Box className='alert-block'>
                <span class="msg-text">{alertMessage ? alertMessage : "Are you sure you would like to remove this item from the shopping cart?"}</span>
                <div class="btn-section">
                  <Button className='outlined_default_btn' onClick={closePpup}>Cancel</Button>
                  <Button className='primary_default_btn' onClick={action}>Yes</Button>
                </div>
              </Box>
              : ''
          }
        </Stack>
      </ClickAwayListener >
    </Stack >
  )
}

export default Index;