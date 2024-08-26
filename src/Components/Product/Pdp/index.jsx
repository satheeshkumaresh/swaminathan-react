import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import "./styles.scss";
import Breadcrumbs from './Breadcrumbs';
import Media from './Media';
import Samecategory from "./Samecategory";
import Details from "./Details";
import Relatedproducts from "./Relatedproducts";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { productAPI } from "./APIList";
import Pageloader from "../../Loader/Pageloader";
import { Helmet } from "react-helmet-async";
import Errorpage from "../../../Pages/UserAuth/Errorpage";

const Index = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
//     let { search } = useLocation();
// console.log("search",search);
//     const query = new URLSearchParams(search);
//     console.log("search query",query.get('id'));
    const entityId = location?.state?.from ;
    // query.get('id')
    // location?.state?.from ;
    console.log("data entity", entityId);
    const { productData } = useSelector(state => {
        return {
            productData: state?.productData?.[0]?.data?.[0]
        }
    })
    const [urlKey, setUrlKey] = useState(location?.pathname?.slice(1));
    const [pdpLoader, setPdpLoader] = useState(true);
    const isCategory = window?.location?.pathname?.slice(-13);
    const isSearch = window?.location?.pathname?.slice(0, 7);
    const isPlp = (isCategory === "category.html" || isSearch === "/search");
    const [metaData, setMetaData] = useState({
        productName: "",
        meta_title: "",
        meta_description: "",
        meta_keyword: ""
    });
    useEffect(() => {
        setUrlKey(location?.pathname?.slice(1))
    }, [location?.pathname])

    useEffect(() => {
        console.log("data entity", entityId);
      }, [entityId]);
    useEffect(() => {
        if (isPlp === false) {
            productAPI(dispatch, urlKey, entityId, navigate, setPdpLoader)
        }
    }, [urlKey])

    useEffect(() => {
        setMetaData({
            productName: productData?.product?.name,
            meta_title: productData?.product?.name,
            meta_description: productData?.product?.meta_description,
            meta_keyword: productData?.product?.meta_keyword
        })
    }, [productData])
    return (
        <>
            <>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{`Sri Swaminathan & Co Kumbakonam |  ${metaData?.meta_title ? metaData?.meta_title : metaData?.productName}`}</title>
                    <meta
                        name="title"
                        content={metaData?.meta_title ? metaData?.meta_title : `${metaData?.productName} - Sri Swaminathan`}
                        data-react-helmet="true"
                    />
                    <meta
                        name="description"
                        content={metaData?.meta_description ? metaData?.meta_description : `${metaData?.productName} ${productData?.product?.breadcrumb !== undefined ? ` in the ${productData?.product?.breadcrumb?.slice(-1)?.[0]?.label}` : ''}`}
                        data-react-helmet="true"
                    />
                    <meta
                        name="keywords"
                        content={metaData?.meta_keyword}
                        data-react-helmet="true"
                    />
                </Helmet>
            </>
            {
                productData?.urlKey !== "no-route" && !pdpLoader?
                    <Stack className='product_details_container'>
                        <Stack className='default_conitaner_fluid'>
                            <Stack className='section'>
                                <Stack className='breadcrumbs-section'>
                                    <Breadcrumbs
                                        data={productData?.product?.breadcrumb}
                                        productName={productData?.product?.name}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack className='default_conitaner'>
                            <Stack className='pdp_details_blocks'>
                                <Media />
                                <Details />
                                {
                                    productData?.from_same_category?.length ?
                                        <Samecategory />
                                        : ''
                                }
                            </Stack>
                            <Stack className='related_products_container'>
                                {
                                    productData?.related_product?.length ?
                                        <Relatedproducts />
                                        : ''
                                }
                            </Stack>
                        </Stack>
                    </Stack>
                    : <Stack className='product_details_container'></Stack>
            }
            {
                productData?.urlKey == "no-route" ? <Errorpage /> : ''
            }
            {
                pdpLoader && <Pageloader />
            }
        </>
    )
}

export default Index;