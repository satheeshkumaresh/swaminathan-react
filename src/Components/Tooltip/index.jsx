import React from 'react'
import './styles.scss';
import { Stack, Box, Typography } from '@mui/material';

const Index = ({value}) => {
  return (
    <Box className='tooltip'>
    <Stack className='tooltip-block'>
      <Typography className='show-tip'>{value}</Typography>
    </Stack>
  </Box>
  )
}

export default Index