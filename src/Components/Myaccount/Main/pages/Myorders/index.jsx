import React, { useEffect, useState } from 'react';
import "./styles.scss";
import { ACTION_MYACCOUNTCURRENTPAGE, getMyOrders, reOrder } from "../../APIList";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Stack, Typography } from '@mui/material';
import Table from "../../../../../Components/Table";
import Select from "../../../Select/Show";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { formatCurrency, getDataFormatNormal } from "../../../../../Utilities/Utilities";

const Index = ({ accountCurrentPage, setMyOrderLoader }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const { token, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      actionmessage: state?.actionmessage
    }
  })
  const [myOrderData, setMyOrderData] = useState([]);
  const [show, setShow] = useState(15);
  const [currentPage, setCurrentPage] = useState(0);
  const [callPaginationHandler, setCallPaginationHandler] = useState(false);
  const pageCount = Math.ceil(myOrderData?.count / show);
  const handlePageClick = (event) => {
    setTimeout(() => {
      setCallPaginationHandler(true)
    }, 300);
    if (callPaginationHandler) {
      setCurrentPage(event?.selected)
      navigate(
        {
          search: `&page=${event?.selected + 1}${searchParams.get('show') ? `&show=${searchParams.get('show')}` : ''}`,
        }
      )
    }
  };
  const makeReorder = (order_id) => {
    reOrder(token, dispatch, order_id, navigate, "account", actionmessage?.isSesstionTimeOut)
  }
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("My Orders"))
  }, [])
  // my order api
  useEffect(() => {
    getMyOrders(
      token, dispatch,
      searchParams?.get('page'),
      searchParams?.get('show'),
      setMyOrderData,
      setMyOrderLoader,
      actionmessage?.isSesstionTimeOut
    )
  }, [location])
  // set filter value
  useEffect(() => {
    if (myOrderData?.page) {
      setCurrentPage(parseInt(myOrderData?.page))
    }
    if (myOrderData?.show_per) {
      setShow(myOrderData?.show_per)
    }
  }, [myOrderData])

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
          ${value === "processing" && "orders__pending"}
          ${value === "complete" && "orders__Completed"}
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
                data?.rowData?.[4] && data?.rowData?.[5] ?
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
  const count = [
    {
      label: "15",
      value: 15
    },
    {
      label: "18",
      value: 18
    },
    {
      label: "24",
      value: 24
    },
    {
      label: "30",
      value: 30
    }
  ]
  return (
    <Stack className="my-order">
      <Stack className="main_block">
        <Box className="header page-title">
          <Stack className='current-page-title'>{accountCurrentPage}</Stack>
          {
            myOrderData?.count ?
              <Stack className='item'>
                <Typography><small>{myOrderData?.count}</small></Typography>
                <Typography><small>{myOrderData?.count > 1 ? 'Items' : 'Item'}</small></Typography>
              </Stack>
              : ''
          }
        </Box>
        {
          myOrderData?.count && myOrderData?.code == 200 ?
            <Stack className='order-table'>
              <Table
                columns={columns}
                data={myOrderData?.orderdata}
                options={options}
              />
            </Stack>
            : ''
        }
        {
          !myOrderData?.count && myOrderData?.code == 200 ?
            <Typography className='empty-msg'>You have placed no orders yet.</Typography>
            : ''
        }
        {
          myOrderData?.count ?
            <Stack className='page'>

              <Stack className='item'>
                {/* Pagination */}
                <ReactPaginate
                  breakLabel="..."
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={pageCount}
                  renderOnZeroPageCount={null}
                  activeClassName={"paginationActive"}
                  containerClassName={"pagination-pages"}
                  initialPage={currentPage === 0 ? 0 : currentPage - 1}
                  forcePage={currentPage === 0 ? 0 : currentPage - 1}
                />
              </Stack>
              <Box className="show">
                <Box className='title-show'><small>Show</small></Box>
                <Select
                  data={count}
                  setShow={setShow}
                  appliedShow={myOrderData?.show_per}
                  totalData={myOrderData?.count}
                />
                <Box className='show-page'><small>/Page</small></Box>
              </Box>

            </Stack>
            : ''
        }
      </Stack>
      <Stack className='back-button'>
        <Button
          className='primary_default_btn'
          onClick={() => navigate(-1)}
        >Back</Button>
      </Stack>

    </Stack>
  )
}

export default Index;