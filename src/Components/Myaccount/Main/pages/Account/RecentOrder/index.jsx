import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import "./styles.scss";
import Table from "../../../../../../Components/Table";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reOrder } from "../../../APIList";
import { formatCurrency, getDataFormatNormal } from "../../../../../../Utilities/Utilities";

const Index = ({ myRecentOrderData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      actionmessage: state?.actionmessage
    }
  })
  const makeReorder = (order_id) => {
    reOrder(token, dispatch, order_id, navigate, "account", actionmessage?.isSesstionTimeOut)
  }

  const columns = [
    {
      name: "order_id",
      label: "Order #"
    },
    {
      name: "date",
      label: "Date",
      options: {
        customBodyRender: (value) => {
          return <div className="date">{getDataFormatNormal(value)}</div>;
        },
      },
    },
    {
      name: "ship_to",
      label: "Ship To",
      options: {
        customBodyRender: (value) => {
          return <div className="shipping-to-section">{value}</div>;
        },
      }
    },
    {
      name: "display_order_total",
      label: "Order Total",
      options: {
        customBodyRender: (value) => {
          return value ? <div className="total">{formatCurrency?.format(value)}</div> : '';
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          return (
            <div
              className={`
          ${value === "canceled" && "orders__cancelled"}
          ${value === "pending" && "orders__pending"}
          ${value === "complete" && "orders__Completed"}
          ${value === "processing" && "orders__pending"}

          `}
            >
              {value}
            </div>
          )
        },
      },
    },
    {
      name: "isExists",
      label: "isExists",
      options: {
        display: false
      }
    },
    {
      name: "stock_status",
      label: "stock_status",
      options: {
        display: false
      }
    },
    {
      name: "Action",
      lable: "Action",
      options: {
        customBodyRender: (value, data) => {
          return (
            <Stack className="action-sec">
              <Box className='view-order' onClick={() => navigate('/account/myorders/vieworder', { state: data?.rowData?.[0] })}>View Order</Box>
              {
                data?.rowData?.[5] && data?.rowData?.[6] ?
                  <Box
                    className='recorder'
                    onClick={() => makeReorder(data?.rowData?.[0])}
                  >Reorder</Box>
                  : ''
              }
            </Stack>
          );
        },
      },
    }
  ]

  const options = {
    filter: false,
    filterType: "textField",
    responsive: "vertical",
    pagination: false,
    selectableRows: false,
    download: false,
    print: false,
    sort: false,
    viewColumns: false,
    search: false,
  };
  return (
    <Stack className='recent-order-block'>
      <Stack className='recent-order'>
        <Typography variant='h4'>Recent Orders</Typography>
        <small><Link to='/account/myorders'>View All</Link></small>
      </Stack>
      <Stack className='table-recent-order'>
        <Table
          columns={columns}
          data={myRecentOrderData}
          options={options}
        />
      </Stack>
    </Stack>
  )
}

export default Index;