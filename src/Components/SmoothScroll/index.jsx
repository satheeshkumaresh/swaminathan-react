import React,{ useEffect } from "react";
import { useLocation } from "react-router-dom";
import {useSelector} from "react-redux";

const Index = ({ children }) => {
    const location = useLocation();
    const { scrollToTopCustom } = useSelector(state => {
        return {
            scrollToTopCustom: state?.scrollToTopCustom
        }
    })
    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, [location,scrollToTopCustom]);
    return <>{children}</>;
}
export default Index;