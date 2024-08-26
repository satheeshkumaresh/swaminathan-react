import React,{memo} from 'react';
import "./styles.scss";
import { Stack } from '@mui/material';
import TrendingNow from './TrendingNow';
import TempleCollection from './TempleCollection';
import TopCollection from './TopCollection';
import NewArrivals from './NewArrivals';
import TraditionalDiyas from './TraditionalDiyas';
import { useSelector } from 'react-redux';


const Index = () => {
  const { homepageData } = useSelector(state => {
    return {
      homepageData: state?.homepage?.[0],
    }
  })
  return (
    <Stack className="production-collections-block">
      <TrendingNow />
      <Stack className='newarrival-grid'>
        <NewArrivals
          title={homepageData?.newarrival?.title}
          btn_name=""
          data={homepageData?.newarrival}
        />
        <TraditionalDiyas />
        <NewArrivals
          title={homepageData?.tile2?.title}
          btn_name="See All"
          btn_link={homepageData?.tile2?.see_more_url_key}
          data={homepageData?.tile2}
        />
      </Stack>
      <TempleCollection />
      <TopCollection />
    </Stack>
  )
}

export default memo(Index);
