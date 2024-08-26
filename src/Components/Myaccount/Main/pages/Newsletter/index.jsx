import { Button, Stack, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { ACTION_MYACCOUNTCURRENTPAGE, customerNewsLetter } from "../../APIList";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const Index = ({ accountCurrentPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, userdata, loggedInUserData, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      userdata: state?.userdata,
      loggedInUserData: state?.loggedInUserData,
      actionmessage: state?.actionmessage
    }
  })
  const [subscribe, setSubscribe] = useState(false);
  const subscribeNewsletter = () => {
    customerNewsLetter(token, userdata?.id, dispatch, setSubscribe, subscribe, navigate, "account", actionmessage?.isSesstionTimeOut)
  }
  useEffect(() => {
    setSubscribe(loggedInUserData?.is_subscriber)
  }, [loggedInUserData?.is_subscriber])
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("Newsletter Subscriptions"))
  }, [])
  return (
    <Stack className="newsletter-pages">
      <Stack className='section'>
        <Stack className="main_block">
          <Box className="header page-title">{accountCurrentPage}</Box>
          <Box className="subscribe-block">
            <FormGroup>
              <FormControlLabel control={<Checkbox
                onChange={(e) => {
                  if (e.target.checked == true) {
                    setSubscribe(true)
                  } else {
                    setSubscribe(false)
                  }
                }}
                checked={subscribe} />}
                label="General Subscription"
              />
            </FormGroup>
          </Box>
        </Stack>
      </Stack>
      <Box className="button-block">
        <Button className='save primary_default_btn' onClick={() => subscribeNewsletter()}>Save</Button>
        <Button className='back primary_default_btn' onClick={() => navigate(-1)}>Back</Button>
      </Box>

    </Stack>
  )
}

export default Index;