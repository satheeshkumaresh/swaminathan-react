import { Stack } from '@mui/material';
import React from 'react';
import "./styles.scss";

const index = () => {
  return (
    <Stack className='pageloader-container'>
      <Stack className='block'>
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Stack>
    </Stack>
  )
}

export default index