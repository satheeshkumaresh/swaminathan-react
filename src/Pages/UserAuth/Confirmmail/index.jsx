import "./styles.scss";
import { Stack, Typography, Box } from '@mui/material';

const Index = () => {
  return (
    <Stack className="confirm-mail">
      <Stack className='container'>
        <Stack className='row'>
          
          <Box className="image-section">
            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90">
              <g id="_9ba64cca46b142cee3744991df8878c3" data-name="9ba64cca46b142cee3744991df8878c3" transform="translate(-0.316 -1026.679)">
                <circle id="Ellipse_150" data-name="Ellipse 150" cx="45" cy="45" r="45" transform="translate(0.316 1026.679)" fill="#b24a14" />
                <path id="Path_6244" data-name="Path 6244" d="M36.934,67.807q1.246-.154,2.483-.377a45.39,45.39,0,0,0,4.4-1.117q2.167-.67,4.26-1.554A45.789,45.789,0,0,0,56.03,60.4q1.874-1.279,3.614-2.741t3.321-3.094a45.391,45.391,0,0,0,3-3.411q1.41-1.778,2.636-3.691t2.259-3.935q1.03-2.021,1.854-4.138t1.425-4.309q.512-1.9.859-3.834l-20.2-20.2-.552.436L51.763,9.008H9.075l20.8,20.807a1.746,1.746,0,0,1-.52-.279L6.016,11.04V36.885Z" transform="translate(14.99 1048.806)" fill="#9b3c0b" />
                <path id="Path_6245" data-name="Path 6245" d="M4.087,4.016,25.449,20.94,46.779,4.016ZM1.025,6.048V31.893H49.806V6.062L26.531,24.543a1.746,1.746,0,0,1-2.165,0L1.028,6.048Z" transform="translate(19.978 1053.797)" fill="#fff" />
              </g>
            </svg>
          </Box>

          <Typography variant='h4'>Verify your email to proceed</Typography>

          <Box className="content">
            <Typography>We just sent an email to your registered email address.</Typography>
            <Typography> Please check your email and click on the link provided to verify your address.</Typography>
          </Box>

        </Stack>
      </Stack>
    </Stack>
  )
}

export default Index