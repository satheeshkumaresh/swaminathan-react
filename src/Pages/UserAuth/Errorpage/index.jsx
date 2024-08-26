import { Stack, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import "./styles.scss";
import Error from '../../../Assets/userauth/error.svg'
import { Helmet } from "react-helmet-async";

const Index = () => {
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{`Sri Swaminathan & Co Kumbakonam |  404 Not Found - Sri Swaminathan`}</title>
                <meta
                    name="title"
                    content="404 Not Found - Sri Swaminathan"
                    data-react-helmet="true"
                />
                <meta
                    name="navarender-status-code"
                    content="404"
                    data-react-helmet="true"
                />
                <meta
                    name="description"
                    content="Every block of stone has a statue inside it and it is the task of the sculptor to discover it"
                    data-react-helmet="true"
                />
                <meta
                    name="keywords"
                    content=""
                    data-react-helmet="true"
                />
            </Helmet>
            <Stack className='error-page'>
                <Stack className='container'>
                    <Stack className='row'>
                        <Box className='image-section'>
                            <img src={Error} alt='logo' />
                        </Box>
                        <Typography variant='h4'>Whoops!! Error 404</Typography>
                        <Typography>Sorry, the page you are looking for doesn't exist or has been moved</Typography>
                        <Box className="button-section">
                            <Link to="/"><Stack className='primary_default_btn'>Go To Home</Stack></Link>
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
export default Index;
