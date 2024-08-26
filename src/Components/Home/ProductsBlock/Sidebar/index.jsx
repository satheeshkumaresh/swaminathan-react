import React, {memo} from 'react';
import "./styles.scss";
import { Stack } from '@mui/material';
import AllCategory from './AllCategories';
import CategoryItems from './CategoryItems';
import { useSelector } from 'react-redux';

const Index = () => {
  const { homepageData } = useSelector(state => {
    return {
      homepageData: state?.homepage?.[0]
    }
  })
  return (
    <Stack className='sidebar-common-section'>
      <AllCategory />
      {
        homepageData?.tile4?.products?.length ?
          <CategoryItems
            title={homepageData?.tile4?.title}
            btn_name="See All"
            data={homepageData?.tile4}
          />
          : ''
      }
      {
        homepageData?.tile3?.products?.length ?
          <CategoryItems
            title={homepageData?.tile3?.title}
            btn_name="See All"
            data={homepageData?.tile3}
          />
          : ''
      }
    </Stack>
  )
}

export default memo(Index);
