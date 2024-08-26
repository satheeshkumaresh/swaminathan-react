import React, { memo } from "react";
import Home from "../../Components/Home";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

const Index = () => {
  const { homePageData } = useSelector((state) => {
    return {
      homePageData: state?.homepage?.[0],
    };
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`Sri Swaminathan & Co Kumbakonam |  ${homePageData?.metaTitle}`}</title>
        <meta
          name="title"
          content={homePageData?.metaTitle}
          data-react-helmet="true"
        />
        <meta
          name="description"
          content={homePageData?.metaDescription}
          data-react-helmet="true"
        />
        <meta
          name="keywords"
          content={homePageData?.metaKeywords}
          data-react-helmet="true"
        />
      </Helmet>
      <Home />
    </>
  );
};

export default memo(Index);
