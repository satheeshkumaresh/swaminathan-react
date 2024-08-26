import { Stack, Button, Typography, Box } from '@mui/material';
import "./styles.scss";
import Emptycartlogo from "../../../Assets/Cart/empty-cart.png"
import { useNavigate } from 'react-router-dom';

const Index = ({ setState, setshowminiquote, showminiquote }) => {
  const navigate = useNavigate();
  return (
    <Stack className="minicart-emptycart">
      <Stack className='container'>
        <Stack className='row'>
          <Box className='image-section'>
            <img src={Emptycartlogo} alt='logo' />
          </Box>
          <Typography variant='h4'>Your Quote is currently empty!</Typography>
          <Typography>Why not add some items to your Quote and enjoy our amazing products?</Typography>
          <Box className="button-section">
            <Button
              className='primary_default_btn'
              onClick={() => {
                setshowminiquote(!showminiquote)
                setState(() => ({
                  right: false,
                }));
                navigate("/")
              }}>Return To Shop</Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Index;