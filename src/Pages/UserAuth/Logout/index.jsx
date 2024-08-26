import React, {useState,useEffect} from "react";
import { Stack, Button, Typography, Box } from '@mui/material';
import "./styles.scss";
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();
    const [count,setCount] = useState(5);
    useEffect(()=>{
        if(!count<=0){
            setTimeout(()=>setCount(count-1),1000)
        }
        if(count<=0){
            navigate("/")
        }
    },[count])
    return (
        <Stack className='afterlogout'>
            <Stack className='container'>
                <Stack className='row'>
                    <Typography variant='h4'>You are signed out</Typography>
                    <Typography>You have signed out and will go to our homepage in {count} seconds.</Typography>
                    <Box className="button-section">
                        <Button className='primary_default_btn'  onClick={()=>navigate('/')}>Go To Home</Button>
                    </Box>
                </Stack>
            </Stack>
        </Stack>
    )
}
export default Index;

