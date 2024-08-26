import { Box, Button, Stack, TextField, Typography, Autocomplete } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import "./styles.scss";
import {deleteAddress, accountAddAddressBook, accountUpdateAddressBook, ACTION_MYACCOUNTCURRENTPAGE} from "../../APIList";
import { useDispatch, useSelector } from "react-redux";
import Show from "../../../Select/Show";
import Table from "../../../../../Components/Table"
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isEmptyValue, pressEnterCallFunction, isNumber, isValidCharacter } from "../../../../../Utilities/Utilities";
import ReactPaginate from "react-paginate";
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Model from "../../../../Model";
import AlertImg from '../../../../../Assets/Myaccount/alert_triangle.svg';
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/material.css";

const Index = ({
  accountCurrentPage,
  getAaddress, setUpdateAddress, updateAddress, setShow, show, setPostPage, postPage
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const { token, countries, states, actionmessage } = useSelector(state => {
    return {
      token: state?.token,
      countries: state?.countries,
      states: state?.states,
      actionmessage: state?.actionmessage
    }
  })

  const focusAddressForm = useRef();
  const [deleteItemId, setDeleteItemId] = useState();
  const [open, setOpen] = useState(false);
  const [addressName, setAddressName] = useState("");
  const [hideDefaultBillingShipping, setHideDefaultBillingShipping] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressId, setAddressId] = useState(null)
  const [callPaginationHandler, setCallPaginationHandler] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(getAaddress?.count / show);
  const handlePageClick = (event) => {
    setPostPage(event?.selected + 1)
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
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    countryCode: "",
    company: "",
    streetaddress1: "",
    streetaddress2: "",
    city: "",
    zip_code: "",
    country: "",
    display_country: "",
    state: "",
    display_state: "",
    regionValues: {
      label: "",
      value: ""
    },
    DefaultBilling: "",
    DefaultShipping: ""
  });
  const [formError, setFormError] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    company: "",
    streetaddress1: "",
    streetaddress2: "",
    city: "",
    zip_code: "",
    country: "",
    state: "",
    DefaultBilling: "",
    DefaultShipping: ""
  });
  const defaultCountry = countries?.filter((item) => item?.value == "IN");
  const handleSubmit = (en_id) => {
    var isError = false;
    // firstname
    if (!formValues?.firstname) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Required field."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.firstname)) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Empty spaces are not allowed."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
    } else if (!isValidCharacter(formValues?.firstname)) {
      setFormError((prevState) => ({
        ...prevState,
        firstname: "Name can only contain alphabets."
      }))
      document.getElementById("firstname")?.focus();
      var isError = true;
    }
    // lastname
    if (!formValues?.lastname) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Required field."
      }))
      document.getElementById("lastname")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.lastname)) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Empty spaces are not allowed."
      }))
      document.getElementById("lastname")?.focus();
      var isError = true;
    } else if (!isValidCharacter(formValues?.lastname)) {
      setFormError((prevState) => ({
        ...prevState,
        lastname: "Name can only contain alphabets."
      }))
      document.getElementById("lastname")?.focus();
      var isError = true;
    }
    // mobile
    if (!formValues?.phonenumber || (formValues?.phonenumber?.length == formValues?.countryCode?.length + 1)) {
      setFormError((prevState) => ({
        ...prevState,
        phonenumber: "Required field."
      }))
      document.getElementById("phonenumber")?.focus();
      var isError = true;
    }
    
    // streetaddress
    if (!formValues?.streetaddress1) {
      setFormError((prevState) => ({
        ...prevState,
        streetaddress1: "Required field."
      }))
      document.getElementById("streetaddress1")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.streetaddress1)) {
      setFormError((prevState) => ({
        ...prevState,
        streetaddress1: "Empty spaces are not allowed."
      }))
      document.getElementById("streetaddress1")?.focus();
      var isError = true;
    }
    // city
    if (!formValues?.city) {
      setFormError((prevState) => ({
        ...prevState,
        city: "Required field."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.city)) {
      setFormError((prevState) => ({
        ...prevState,
        city: "Empty spaces are not allowed."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    } else if (!isValidCharacter(formValues?.city)) {
      setFormError((prevState) => ({
        ...prevState,
        city: "Name can only contain alphabets."
      }))
      document.getElementById("city")?.focus();
      var isError = true;
    }
    // zip_code
    if (!formValues?.zip_code) {
      setFormError((prevState) => ({
        ...prevState,
        zip_code: "Required field."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    } else if (!isEmptyValue(formValues?.zip_code)) {
      setFormError((prevState) => ({
        ...prevState,
        zip_code: "Empty spaces are not allowed."
      }))
      document.getElementById("zip_code")?.focus();
      var isError = true;
    }
    
    // country
    if (!formValues?.country) {
      setFormError((prevState) => ({
        ...prevState,
        country_id: "Required field."
      }))
      document.getElementById("country_id")?.focus();
      var isError = true;
    }
    // state
    if (!formValues?.state) {
      setFormError((prevState) => ({
        ...prevState,
        state: "Required field."
      }))
      document.getElementById("states")?.focus();
      var isError = true;
    }

    // Final valiation
    if (!isError) {
      location?.state?.addressName == 'new' ||
        (!getAaddress?.data?.billing_address?.length &&
          !getAaddress?.data?.shipping_address?.length &&
          !getAaddress?.data?.additional_address?.length
        )
        ? addNewAddress() : updateNewAddress()
    }
  }
  const deleteAddressItem = () => {
    deleteAddress(token, dispatch, deleteItemId, setUpdateAddress, updateAddress, setOpen, "account", actionmessage?.isSesstionTimeOut)
  }
  const addNewAddress = () => {
    accountAddAddressBook(token, dispatch, formValues, setUpdateAddress, updateAddress, setShowAddressForm, setFormValues, navigate, "/account/addressbook", "account", actionmessage?.isSesstionTimeOut)
  }
  const updateNewAddress = () => {
    accountUpdateAddressBook(token, dispatch, location?.state?.addressId, formValues, setUpdateAddress, updateAddress, setShowAddressForm, setFormValues, navigate, "/account/addressbook", "account", actionmessage?.isSesstionTimeOut)
  }
  const goBack = () => {
    navigate(-1);
  }
  const editBillingAddres = () => {
    setFormValues((prevState) => ({
      ...prevState,
      firstname: getAaddress?.data?.billing_address?.[0]?.firstname,
      lastname: getAaddress?.data?.billing_address?.[0]?.lastname,
      phonenumber: getAaddress?.data?.billing_address?.[0]?.telephone,
      company: getAaddress?.data?.billing_address?.[0]?.company ? getAaddress?.data?.billing_address?.[0]?.company : '',
      streetaddress1: getAaddress?.data?.billing_address?.[0]?.streetaddress?.[0],
      streetaddress2: getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] ? getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] : '',
      city: getAaddress?.data?.billing_address?.[0]?.city,
      zip_code: getAaddress?.data?.billing_address?.[0]?.post_code,
      country: getAaddress?.data?.billing_address?.[0]?.country_id,
      display_country: getAaddress?.data?.billing_address?.[0]?.country_name,
      state: getAaddress?.data?.billing_address?.[0]?.region_id,
      display_state: getAaddress?.data?.billing_address?.[0]?.region,
      regionValues: {
        label: getAaddress?.data?.billing_address?.[0]?.region,
        value: getAaddress?.data?.billing_address?.[0]?.region_id,
      },
      DefaultBilling: getAaddress?.data?.billing_address?.[0]?.default_billing,
      DefaultShipping: getAaddress?.data?.billing_address?.[0]?.default_shipping,
    }))
  }
  const editBillingShipping = () => {
    setFormValues((prevState) => ({
      ...prevState,
      firstname: getAaddress?.data?.shipping_address?.[0]?.firstname,
      lastname: getAaddress?.data?.shipping_address?.[0]?.lastname,
      phonenumber: getAaddress?.data?.shipping_address?.[0]?.telephone,
      company: getAaddress?.data?.shipping_address?.[0]?.company ? getAaddress?.data?.shipping_address?.[0]?.company : '',
      streetaddress1: getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0],
      streetaddress2: getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] ? getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] : '',
      city: getAaddress?.data?.shipping_address?.[0]?.city,
      zip_code: getAaddress?.data?.shipping_address?.[0]?.post_code,
      country: getAaddress?.data?.shipping_address?.[0]?.country_id,
      display_country: getAaddress?.data?.shipping_address?.[0]?.country_name,
      state: getAaddress?.data?.shipping_address?.[0]?.region_id,
      display_state: getAaddress?.data?.shipping_address?.[0]?.region,
      regionValues: {
        label: getAaddress?.data?.shipping_address?.[0]?.region,
        value: getAaddress?.data?.shipping_address?.[0]?.region_id,
      },
      DefaultBilling: getAaddress?.data?.shipping_address?.[0]?.default_billing,
      DefaultShipping: getAaddress?.data?.shipping_address?.[0]?.default_shipping,
    }))
  }
  const addNewAddressList = () => {
    setFormValues((prevState) => ({
      ...prevState,
      firstname: "",
      lastname: "",
      phonenumber: "",
      company: "",
      streetaddress1: "",
      streetaddress2: "",
      city: "",
      zip_code: "",
      state: "",
      display_state: "",
      regionValues: {
        label: "",
        value: "",
      },
      DefaultBilling: "",
      DefaultShipping: ""
    }))
  }
  useEffect(() => {
    dispatch(ACTION_MYACCOUNTCURRENTPAGE("Address Book"))
  }, [])

  // default country
  useEffect(() => {
    if (
      !formValues?.firstname &&
      !formValues?.lastname &&
      !formValues?.phonenumber &&
      !formValues?.streetaddress1 &&
      !formValues?.city &&
      !formValues?.zip_code &&
      !formValues?.country &&
      !formValues?.state
    ) {
      setFormValues((prevState) => ({
        ...prevState,
        country: defaultCountry?.[0]?.value,
        display_country: defaultCountry?.[0]?.label
      }))
    }
  }, [defaultCountry, formValues])

  useEffect(() => {
    if (getAaddress?.data?.billing_address?.length) {
      if (location?.pathname == '/account/addressbook/editbilling') {
        setShowAddressForm(true)
        setFormValues((prevState) => ({
          ...prevState,
          firstname: getAaddress?.data?.billing_address?.[0]?.firstname,
          lastname: getAaddress?.data?.billing_address?.[0]?.lastname,
          phonenumber: getAaddress?.data?.billing_address?.[0]?.telephone,
          company: getAaddress?.data?.billing_address?.[0]?.company ? getAaddress?.data?.billing_address?.[0]?.company : '',
          streetaddress1: getAaddress?.data?.billing_address?.[0]?.streetaddress?.[0],
          streetaddress2: getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] ? getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] : '',
          city: getAaddress?.data?.billing_address?.[0]?.city,
          zip_code: getAaddress?.data?.billing_address?.[0]?.post_code,
          country: getAaddress?.data?.billing_address?.[0]?.country_id,
          display_country: getAaddress?.data?.billing_address?.[0]?.country_name,
          state: getAaddress?.data?.billing_address?.[0]?.region_id,
          display_state: getAaddress?.data?.billing_address?.[0]?.region,
          regionValues: {
            label: getAaddress?.data?.billing_address?.[0]?.region,
            value: getAaddress?.data?.billing_address?.[0]?.region_id,
          },
          DefaultBilling: getAaddress?.data?.billing_address?.[0]?.default_billing,
          DefaultShipping: getAaddress?.data?.billing_address?.[0]?.default_shipping,
        }))
      }
    }
    if (getAaddress?.data?.shipping_address?.length) {
      if (location?.pathname == '/account/addressbook/editshipping') {
        setShowAddressForm(true)
        setFormValues((prevState) => ({
          ...prevState,
          firstname: getAaddress?.data?.shipping_address?.[0]?.firstname,
          lastname: getAaddress?.data?.shipping_address?.[0]?.lastname,
          phonenumber: getAaddress?.data?.shipping_address?.[0]?.telephone,
          company: getAaddress?.data?.shipping_address?.[0]?.company ? getAaddress?.data?.shipping_address?.[0]?.company : '',
          streetaddress1: getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0],
          streetaddress2: getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] ? getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] : '',
          city: getAaddress?.data?.shipping_address?.[0]?.city,
          zip_code: getAaddress?.data?.shipping_address?.[0]?.post_code,
          country: getAaddress?.data?.shipping_address?.[0]?.country_id,
          display_country: getAaddress?.data?.shipping_address?.[0]?.country_name,
          state: getAaddress?.data?.shipping_address?.[0]?.region_id,
          display_state: getAaddress?.data?.shipping_address?.[0]?.region,
          regionValues: {
            label: getAaddress?.data?.shipping_address?.[0]?.region,
            value: getAaddress?.data?.shipping_address?.[0]?.region_id,
          },
          DefaultBilling: getAaddress?.data?.shipping_address?.[0]?.default_billing,
          DefaultShipping: getAaddress?.data?.shipping_address?.[0]?.default_shipping,
        }))
      }
    }
    if (location?.pathname == '/account/addressbook/editAddress') {
      setShowAddressForm(true)
      setFormValues((prevState) => ({
        ...prevState,
        firstname: location?.state?.firstname,
        lastname: location?.state?.lastname,
        phonenumber: location?.state?.phonenumber,
        company: location?.state?.company ? location?.state?.company : '',
        streetaddress1: location?.state?.streetaddress1,
        streetaddress2: location?.state?.streetaddress2 ? location?.state?.streetaddress2 : '',
        city: location?.state?.city,
        zip_code: location?.state?.zip_code,
        country: location?.state?.country,
        display_country: location?.state?.display_country,
        state: location?.state?.state,
        display_state: location?.state?.display_state,
        regionValues: {
          label: String(location?.state?.display_state),
          value: String(location?.state?.state),
        },
        DefaultBilling: location?.state?.DefaultBilling,
        DefaultShipping: location?.state?.DefaultShipping,
      }))
    }
  }, [location, getAaddress])

  useEffect(() => {
    if (
      !getAaddress?.data?.billing_address?.length && getAaddress?.data?.billing_address?.length !== undefined &&
      !getAaddress?.data?.shipping_address?.length && getAaddress?.data?.shipping_address?.length !== undefined &&
      !getAaddress?.data?.additional_address?.length && getAaddress?.data?.additional_address?.length !== undefined
    ) {
      setShowAddressForm(true)
      setFormValues((prevState) => ({
        ...prevState,
        DefaultBilling: "1",
        DefaultShipping: "1"
      }))
    }
  }, [
    getAaddress?.data?.billing_address,
    getAaddress?.data?.shipping_address,
    getAaddress?.data?.additional_address
  ])
  useEffect(() => {
    if (
      getAaddress?.data?.billing_address?.length &&
      getAaddress?.data?.shipping_address?.length
    ) {
      setHideDefaultBillingShipping(true)
    }
  }, [getAaddress])
  useEffect(() => {
    focusAddressForm.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }, [focusAddressForm.current]);
  // set filter value
  useEffect(() => {
    if (getAaddress?.page) {
      setCurrentPage(parseInt(getAaddress?.page))
    }
    if (getAaddress?.show_per) {
      setShow(getAaddress?.show_per)
    }
  }, [getAaddress])
  const columns = [
    {
      name: "firstname",
      label: "First Name"
    },
    {
      name: "lastname",
      label: "Last Name"
    },
    {
      name: "streetaddress",
      label: "Street Address",
      options: {
        customBodyRender: (value, data) => {

          return (
            <Typography>{value?.[0]}{value?.[1] ? ',' : ''} {value?.[1]}</Typography>
          );
        },
      },
    },
    {
      name: "city",
      label: "City"
    },
    {
      name: "country_name",
      label: "Country"
    },
    {
      name: "region",
      label: "State"
    },
    {
      name: "zip_code",
      label: "Zip/Postal Code"
    },
    {
      name: "phone",
      label: "Phone"
    },
    {
      name: "address_id",
      label: "",
      options: {
        display: false
      }
    },
    {
      name: "company",
      label: "Company",
      options: {
        display: false
      }
    },
    {
      name: "country_id",
      label: "country_id",
      options: {
        display: false
      }
    },
    {
      name: "country_name",
      label: "country_name",
      options: {
        display: false
      }
    },
    {
      name: "region_id",
      label: "region_id",
      options: {
        display: false
      }
    },
    {
      name: "",
      label: "",
      options: {
        customBodyRender: (value, data) => {
          return (
            <Stack className="action-sec">
              <Box className='Edit'
                onClick={() => {
                  setAddressId(data?.rowData?.[8])
                  setAddressName("editnew")
                  setShowAddressForm(true)
                  navigate(
                    "/account/addressbook/editAddress",
                    {
                      state: {
                        firstname: data?.rowData?.[0],
                        lastname: data?.rowData?.[1],
                        phonenumber: data?.rowData?.[7],
                        company: data?.rowData?.[9] ? data?.rowData?.[9] : '',
                        streetaddress1: data?.rowData?.[2]?.[0],
                        streetaddress2: data?.rowData?.[2]?.[1] ? data?.rowData?.[2]?.[1] : '',
                        city: data?.rowData?.[3],
                        zip_code: data?.rowData?.[6],
                        country: data?.rowData?.[10],
                        display_country: data?.rowData?.[11],
                        state: data?.rowData?.[12],
                        display_state: data?.rowData?.[5],
                        DefaultBilling: "",
                        DefaultShipping: "",
                        addressId: data?.rowData?.[8]
                      }
                    }
                  )
                }}
              >Edit</Box>
              <Box className='Delete'
                onClick={() => {
                  setDeleteItemId(data?.rowData?.[8])
                  setOpen(true)
                }}
              >Delete</Box>
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

  const countDrop = [
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
    <>
      <Stack className="addressbook-pages">
        {
          !showAddressForm &&
            location?.pathname !== "/account/addressbook/editAddress" &&
            location?.pathname !== "/account/addressbook/addAddress" ?
            <>
              {/* For address page */}
              <Stack className="main_block">
                <Box className="title-count">
                  <Stack className='header page-title'>{accountCurrentPage}</Stack>
                </Box>
                <Stack className='billing-shipping'>
                  <Box className='billing'>
                    <Typography variant='h4'>DEFAULT BILLING ADDRESS</Typography>
                    {
                      getAaddress?.data?.billing_address?.length ?
                        <>
                          <Box className='info-address'>
                            {
                              getAaddress?.data?.billing_address?.[0]?.firstname ? <Typography>{getAaddress?.data?.billing_address?.[0]?.firstname} {getAaddress?.data?.billing_address?.[0]?.lastname},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.billing_address?.[0]?.streetaddress ? <Typography>
                                {getAaddress?.data?.billing_address?.[0]?.streetaddress?.[0]},
                              </Typography> : ''
                            }
                            {
                              getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1] ? <Typography>
                                {getAaddress?.data?.billing_address?.[0]?.streetaddress?.[1]},
                              </Typography> : ''
                            }
                            {
                              getAaddress?.data?.billing_address?.[0]?.city || getAaddress?.data?.billing_address?.[0]?.post_code ?
                                <Typography>{getAaddress?.data?.billing_address?.[0]?.city}-{getAaddress?.data?.billing_address?.[0]?.post_code},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.billing_address?.[0]?.region ? <Typography>{getAaddress?.data?.billing_address?.[0]?.region},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.billing_address?.[0]?.country_name ? <Typography>{getAaddress?.data?.billing_address?.[0]?.country_name}.</Typography> : ''
                            }
                          </Box>
                          <Box
                            className='edit'
                            onClick={() => {
                              navigate(
                                "/account/addressbook/editbilling",
                                {
                                  state: {
                                    addressId: getAaddress?.data?.billing_address?.[0]?.address_id
                                  }
                                }
                              )
                              setAddressId(getAaddress?.data?.billing_address?.[0]?.address_id)
                              setAddressName("editBilling")
                              editBillingAddres()
                              setShowAddressForm(true)
                            }}
                          ><small>Edit Address</small></Box>
                        </>
                        :
                        <Typography>You have not set a default billing address.</Typography>
                    }

                  </Box>
                  <Box className='shipping'>
                    <Typography variant='h4'>DEFAULT SHIPPING ADDRESS</Typography>
                    {
                      getAaddress?.data?.shipping_address?.length ?
                        <>
                          <Box className='info-address'>
                            {
                              getAaddress?.data?.shipping_address?.[0]?.firstname ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.firstname} {getAaddress?.data?.shipping_address?.[0]?.lastname},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0] ? <Typography>
                                {getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[0]},
                              </Typography> : ''
                            }
                            {
                              getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1] ? <Typography>
                                {getAaddress?.data?.shipping_address?.[0]?.streetaddress?.[1]},
                              </Typography> : ''
                            }
                            {
                              getAaddress?.data?.shipping_address?.[0]?.city || getAaddress?.data?.shipping_address?.[0]?.post_code ?
                                <Typography>{getAaddress?.data?.shipping_address?.[0]?.city}-{getAaddress?.data?.shipping_address?.[0]?.post_code},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.shipping_address?.[0]?.region ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.region},</Typography> : ''
                            }
                            {
                              getAaddress?.data?.shipping_address?.[0]?.country_name ? <Typography>{getAaddress?.data?.shipping_address?.[0]?.country_name}.</Typography> : ''
                            }
                            <Box
                              className='edit'
                              onClick={() => {
                                navigate(
                                  "/account/addressbook/editshipping",
                                  {
                                    state: {
                                      addressId: getAaddress?.data?.shipping_address?.[0]?.address_id
                                    }
                                  }
                                )
                                setAddressId(getAaddress?.data?.shipping_address?.[0]?.address_id)
                                setAddressName("editShipping")
                                editBillingShipping()
                                setShowAddressForm(true)
                              }}
                            ><small>Edit Address</small></Box>
                          </Box>
                        </>
                        :
                        <Typography>You have not set a default shipping address.</Typography>
                    }
                  </Box>
                </Stack>
              </Stack>

              {
                getAaddress?.data?.additional_address?.length ?
                  <Stack className='additional-address'>
                    <Stack className='section'>
                      <Stack className='address_header-block'>
                        <Typography variant='h4'>ADDITIONAL ADDRESS ENTRIES</Typography>
                        {
                          getAaddress?.count ?
                            <Typography className='count'>
                              <small>{getAaddress?.count} {getAaddress?.count > 1 ? 'Items' : 'Item'}</small>
                            </Typography>
                            : ''
                        }
                      </Stack>
                      <Stack className='address-table'>
                        <Table
                          columns={columns}
                          data={getAaddress?.data?.additional_address}
                          options={options}
                        />
                      </Stack>
                    </Stack>
                    {
                      getAaddress?.data?.additional_address?.length ?
                        <Stack className='filter-blocks filter-blocks-bottom'>
                          <Stack className='bottom-section'>
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
                            <Box className="show">
                              <Box className='title-show'><small>Show</small></Box>
                              <Show
                                data={countDrop}
                                setShow={setShow}
                                appliedShow={getAaddress?.show_per}
                                totalData={getAaddress?.count}
                              />
                              <Box className='show-page'><small>/Page</small></Box>
                            </Box>
                          </Stack>
                        </Stack>
                        : ''
                    }
                  </Stack>
                  :
                  <Stack className='sub-block'>
                    <Stack className='section'>
                      <Typography variant='h4'>ADDITIONAL ADDRESS ENTRIES</Typography>
                      <Typography><small>You have no other address entries in your address book.</small></Typography>
                    </Stack>
                  </Stack>
              }
            </>
            :
            ''
        }
        {
          showAddressForm ||
            (
              location?.pathname == "/account/addressbook/addAddress" ||
              location?.pathname == "/account/addressbook/editAddress"
            ) ?
            <Stack className='add-address' ref={focusAddressForm}>
              <Stack className='section'>
                <Typography variant='h4' className='add-new-address-title'>{location?.pathname == '/account/addressbook/addAddress' || location?.pathname == '/account/addressbook' ? 'ADD NEW ADDRESS' : 'Edit Address'}</Typography>

                <Stack className='new-address'>
                  <Stack className='contact-information'>
                    <Typography variant='h4'>CONTACT INFORMATION</Typography>
                    <Box className='input-block'>
                      <Typography className="input_label">First Name<Typography variant='span'>*</Typography></Typography>
                      <TextField
                        className='input-text'
                        name='firstname'
                        id='firstname'
                        value={formValues?.firstname}
                        error={formError?.firstname ? true : false}
                        onChange={(e) => {
                          if (e.target.value === '' || isValidCharacter(e.target.value)) {
                            setFormValues((prevState) => ({
                              ...prevState,
                              firstname: e.target.value
                            }))
                            setFormError((prevState) => ({
                              ...prevState,
                              firstname: ""
                            }))
                          }
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                      {
                        formError?.firstname && <Typography className='form-error-lable field-error'>{formError?.firstname}</Typography>
                      }
                    </Box>
                    <Box className='input-block'>
                      <Typography className="input_label">Last Name<Typography variant='span'>*</Typography></Typography>
                      <TextField
                        className='input-text'
                        name='lastname'
                        id='lastname'
                        value={formValues?.lastname}
                        error={formError?.lastname ? true : false}
                        onChange={(e) => {
                          if (e.target.value === '' || isValidCharacter(e.target.value)) {
                            setFormValues((prevState) => ({
                              ...prevState,
                              lastname: e.target.value
                            }))
                            setFormError((prevState) => ({
                              ...prevState,
                              lastname: ""
                            }))
                          }
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                      {
                        formError?.lastname && <Typography className='form-error-lable field-error'>{formError?.lastname}</Typography>
                      }
                    </Box>
                    <Box className={`input-block common_input_block_section phone-section ${formError?.phonenumber ? 'show_error' : ''}`}>

                      <Typography className="input_label">Phone Number<Typography variant='span'>*</Typography></Typography>

                      <PhoneInput
                        country={'in'}
                        id="number"
                        fullWidth
                        label="Mobile Number"
                        className={`drop_mobile_input input-text `}
                        name="mobile_number"
                        value={formValues?.phonenumber}
                        countryCodeEditable={false}
                        placeholder="Mobile number"
                        inputProps={{
                          label: "Mobile Number",
                          required: true,
                          name: 'phone',
                          open: true
                        }}
                        variant="outlined"
                        onChange={(e, value, data) => {
                          setFormValues((prevState) => ({
                            ...prevState,
                            phonenumber: `+${e}`,
                            countryCode: value?.dialCode,
                            mobile_valid: e.slice(value?.dialCode?.length)
                          }))
                          setFormError((prevState) => ({
                            ...prevState,
                            phonenumber: ""
                          }))

                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}

                      />

                      {
                        formError?.phonenumber && <Typography className='form-error-lable field-error'>{formError?.phonenumber}</Typography>
                      }
                    </Box>
                  </Stack>
                  <Stack className='address'>
                    <Typography variant='h4'>ADDRESS</Typography>
                    <Box className='input-block'>
                      <Typography className="input_label">Street Address<Typography variant='span'>*</Typography></Typography>
                      <TextField
                        className='input-text'
                        name='streetaddress1'
                        id='streetaddress1'
                        value={formValues?.streetaddress1}
                        error={formError?.streetaddress1 ? true : false}
                        onChange={(e) => {
                          setFormValues((prevState) => ({
                            ...prevState,
                            streetaddress1: e.target.value
                          }))
                          setFormError((prevState) => ({
                            ...prevState,
                            streetaddress1: ""
                          }))
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                      {
                        formError?.streetaddress1 && <Typography className='form-error-lable field-error'>{formError?.streetaddress1}</Typography>
                      }
                    </Box>
                    <Box className='input-block'>
                      <TextField
                        className='input-text'
                        name='streetaddress2'
                        id='streetaddress2'
                        value={formValues?.streetaddress2}
                        onChange={(e) => {
                          setFormValues((prevState) => ({
                            ...prevState,
                            streetaddress2: e.target.value
                          }))
                          setFormError((prevState) => ({
                            ...prevState,
                            streetaddress2: ""
                          }))
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                    </Box>
                    <Box className='input-block select'>
                      <Typography className="input_label">Country<Typography variant='span'>*</Typography></Typography>
                      <Autocomplete
                        id="country_id"
                        className="sortby-plp select-options-box state-options autocomplete-dropdown"
                        value={formValues?.display_country}
                        name="state_dropdown_list"
                        error={formError?.country ? true : false}
                        onChange={(event, newValue) => {
                          setFormValues((prevState) => ({
                            ...prevState,
                            display_country: newValue?.label,
                            country: newValue?.value

                          }))
                          setFormError((prevState) => ({
                            ...prevState,
                            display_country: "",
                            country: ""
                          }))

                        }}
                        options={countries?.length ? countries : []}
                        disabled={true}
                        fullWidth
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="inputfield-box"
                            placeholder="Country"
                            InputLabelProps={{
                              shrink: false,
                            }}
                          />
                        )}
                      />

                      {
                        formError?.country && <Typography className='form-error-lable field-error'>{formError?.country}</Typography>
                      }
                    </Box>
                    <Box className={`input-block select ${formError?.state ? 'show_error' : ''}`}>
                      <Typography className="input_label">State/Province<Typography variant='span'>*</Typography></Typography>
                      <Autocomplete
                        id="states"
                        className="sortby-plp select-options-box state-options autocomplete-dropdown"
                        name="state_dropdown_list"
                        value={formValues?.regionValues}
                        options={states?.length ? states : []}
                        onChange={(event, newValue) => {
                          setFormValues((prevState) => ({
                            ...prevState,
                            state: newValue?.value,
                            display_state: newValue?.label,
                            regionValues: newValue,
                          }))
                          setFormError((prevState) => ({
                            ...prevState,
                            state: "",
                            display_state: ""
                          }))
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderInput={(params) => <TextField
                          {...params}
                          className="inputfield-box"
                          placeholder="State"
                          InputLabelProps={{
                            shrink: false,
                          }}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password',
                          }}
                        />}
                      />
                      {
                        formError?.state && <Typography className='form-error-lable field-error'>{formError?.state}</Typography>
                      }
                    </Box>
                    <Box className='input-block'>
                      <Typography className="input_label">City<Typography variant='span'>*</Typography></Typography>
                      <TextField
                        className='input-text'
                        name='city'
                        id='city'
                        value={formValues?.city}
                        error={formError?.city ? true : false}
                        onChange={(e) => {
                          if (e.target.value === '' || isValidCharacter(e.target.value)) {
                            setFormValues((prevState) => ({
                              ...prevState,
                              city: e.target.value
                            }))
                            setFormError((prevState) => ({
                              ...prevState,
                              city: ""
                            }))
                          }
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                      {
                        formError?.city && <Typography className='form-error-lable field-error'>{formError?.city}</Typography>
                      }
                    </Box>
                    <Box className='input-block'>
                      <Typography className="input_label">Zip/Postal Code<Typography variant='span'>*</Typography></Typography>
                      <TextField
                        className='input-text'
                        name='zip_code'
                        id='zip_code'
                        value={formValues?.zip_code}
                        error={formError?.zip_code ? true : false}
                        onChange={(e) => {
                          if (e.target.value === '' || isNumber.test(e.target.value)) {
                            setFormValues((prevState) => ({
                              ...prevState,
                              zip_code: e.target.value
                            }))
                            setFormError((prevState) => ({
                              ...prevState,
                              zip_code: ""
                            }))
                          }
                        }}
                        onKeyDown={(e) => pressEnterCallFunction(e, handleSubmit)}
                      />
                      {
                        formError?.zip_code && <Typography className='form-error-lable field-error'>{formError?.zip_code}</Typography>
                      }
                    </Box>
                    {
                      hideDefaultBillingShipping ?
                        <Box className='use-as-section'>
                          {
                            addressName == "editBilling" || addressName == "editShipping" ||
                              location?.pathname == "/account/addressbook/editbilling" ||
                              location?.pathname == "/account/addressbook/editshipping" ?
                              <>
                                {
                                  getAaddress?.data?.billing_address?.[0]?.default_billing == 1 &&
                                    getAaddress?.data?.billing_address?.[0]?.default_shipping == 1 ?
                                    <>
                                      <Stack className='default-shipping_image'>
                                        <img src={AlertImg} className='alert-img-icon' />
                                        <Typography>This is your default billing address</Typography>
                                      </Stack>
                                      <Stack className='default-shipping_image'>
                                        <img src={AlertImg} className='alert-img-icon' />
                                        <Typography>This is your default shipping address</Typography>
                                      </Stack>
                                    </>
                                    :
                                    <>
                                      {
                                        addressName == "editBilling" || location?.pathname == "/account/addressbook/editbilling" ?
                                          <>
                                            {
                                              getAaddress?.data?.shipping_address?.[0]?.default_shipping == 1 ?
                                                <>
                                                  <Stack className='default-shipping'>
                                                    <FormGroup>
                                                      <FormControlLabel
                                                        control={<Checkbox />}
                                                        label="Use as my default shipping address"
                                                        onChange={(e) => {
                                                          if (e.target.checked == true) {
                                                            setFormValues((prevState) => ({
                                                              ...prevState,
                                                              DefaultShipping: "1"
                                                            }))
                                                          } else {
                                                            setFormValues((prevState) => ({
                                                              ...prevState,
                                                              DefaultShipping: "0"
                                                            }))
                                                          }
                                                        }}
                                                      />
                                                    </FormGroup>
                                                  </Stack>
                                                  <Stack className='default-shipping_image'>
                                                    <img src={AlertImg} className='alert-img-icon' />
                                                    <Typography>This is your default billing address</Typography>
                                                  </Stack>
                                                </>
                                                :
                                                ""
                                            }
                                          </>
                                          :
                                          ""
                                      }
                                      {
                                        addressName == "editShipping" || location?.pathname == "/account/addressbook/editshipping" ?
                                          getAaddress?.data?.billing_address?.[0]?.default_billing == 1 ?
                                            <>
                                              <Stack className='default-billing'>
                                                <FormGroup>
                                                  <FormControlLabel
                                                    control={<Checkbox />}
                                                    label="Use as my default billing address"
                                                    onChange={(e) => {
                                                      if (e.target.checked == true) {
                                                        setFormValues((prevState) => ({
                                                          ...prevState,
                                                          DefaultBilling: "1"
                                                        }))
                                                      } else {
                                                        setFormValues((prevState) => ({
                                                          ...prevState,
                                                          DefaultBilling: "0"
                                                        }))
                                                      }
                                                    }}
                                                  />
                                                </FormGroup>
                                              </Stack>
                                              <Stack className='default-shipping_image'>
                                                <img src={AlertImg} className='alert-img-icon' />
                                                <Typography>This is your default shipping address</Typography>
                                              </Stack>
                                            </>
                                            :
                                            ""
                                          :
                                          ""
                                      }
                                    </>
                                }
                              </>
                              :
                              <>
                                <Stack className='default-billing'>
                                  <FormGroup>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Use as my default billing address"
                                      onChange={(e) => {
                                        if (e.target.checked == true) {
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            DefaultBilling: "1"
                                          }))
                                        } else {
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            DefaultBilling: "0"
                                          }))
                                        }
                                      }}
                                    />
                                  </FormGroup>
                                </Stack>
                                <Stack className='default-shipping'>
                                  <FormGroup>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Use as my default shipping address"
                                      onChange={(e) => {
                                        if (e.target.checked == true) {
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            DefaultShipping: "1"
                                          }))
                                        } else {
                                          setFormValues((prevState) => ({
                                            ...prevState,
                                            DefaultShipping: "0"
                                          }))
                                        }
                                      }}
                                    />
                                  </FormGroup>
                                </Stack>
                              </>
                          }
                        </Box>
                        : ''
                    }
                    {
                      (!getAaddress?.data?.billing_address?.length ||
                        !getAaddress?.data?.shipping_address?.length) &&
                        getAaddress?.data?.additional_address?.length ?
                        <Box className='use-as-section'>
                          <Stack className='default-billing'>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Use as my default billing address"
                                onChange={(e) => {
                                  if (e.target.checked == true) {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      DefaultBilling: "1"
                                    }))
                                  } else {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      DefaultBilling: "0"
                                    }))
                                  }
                                }}
                              />
                            </FormGroup>
                          </Stack>
                          <Stack className='default-shipping'>
                            <FormGroup>
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Use as my default shipping address"
                                onChange={(e) => {
                                  if (e.target.checked == true) {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      DefaultShipping: "1"
                                    }))
                                  } else {
                                    setFormValues((prevState) => ({
                                      ...prevState,
                                      DefaultShipping: "0"
                                    }))
                                  }
                                }}
                              />
                            </FormGroup>
                          </Stack>
                        </Box>
                        : ''
                    }
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            : ''
        }

        <Stack className="button-block">

          {
            showAddressForm ||
              location?.pathname == "/account/addressbook/editAddress" ||
              location?.pathname == "/account/addressbook/addAddress" ?
              <Button className='save primary_default_btn '
                onClick={() => handleSubmit()}
              >Save Address</Button>
              :
              <Button
                className='primary_default_btn '
                onClick={() => {
                  addNewAddressList()
                  setShowAddressForm(true)
                  navigate(
                    "/account/addressbook/addAddress",
                    {
                      state: {
                        addressName: 'new'
                      }
                    }
                  )
                  setAddressName("new")
                }}
              >Add New Address</Button>
          }
          <Button className='back primary_default_btn '
            onClick={() => goBack()}
          >Back</Button>
        </Stack>
      </Stack>
      {open && <Model
        name="minicart_alert"
        closePpup={() => setOpen(false)}
        action={() => deleteAddressItem()}
        hideCloseIcon={true}
        enableAlert={true}
        alertMessage="Are you sure you want to delete this address?"
      />}
    </>
  )
}

export default Index;