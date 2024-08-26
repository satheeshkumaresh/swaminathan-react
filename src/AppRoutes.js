import { Routes, Route } from "react-router-dom";
import Cart from "./Components/Cart";
// quote
import Quote from "./Components/Quote";
import Customercheckoout from "./Pages/Checkout/Customercheckoout";
import Guestcheckoout from "./Pages/Checkout/Guestcheckoout";
import Minicart from "./Components/Minicart";
import Myaccount from "./Pages/Myaccount";
import Contactus from "./Pages/Contactus";
import Ordersuccess from "./Pages/Order/Success";
import Aboutus from "./Pages/Aboutus";
import Globalsourcing from "./Pages/Globalsourcing";
import PrivacyPolicy from "./Pages/Privacypolicy";
import RefundPolicy from "./Pages/RefundPolicy";
import QueriesComments from "./Pages/QueriesComments";
import TermsConditions from "./Pages/Termsconditions";
import Confirmmail from "./Pages/UserAuth/Confirmmail";
import Home from "./Pages/Home";
import Logout from "./Pages/UserAuth/Logout";
import Errorpage from "./Pages/UserAuth/Errorpage";
import Product from "./Components/Product/Pdp";
import Productlist from "./Components/Product/Plp";
import AccountSuccess from "./Pages/UserAuth/AccountSuccess";
import Bulkordersucess from "./Pages/BulkOrder/Success"
const AppRoutes = ({
    headerLoader, headerFooterData, isloggeduser
}) => {
    const isSearch = window?.location?.pathname?.slice(0, 7);
    const isCategory = window?.location?.pathname?.slice(-13);
    const isPlp = (isCategory === "category.html" || isSearch === "/search");

    return (
        <Routes>
            <Route path="/" element={<Home headerLoader={headerLoader} />} exact />
            <Route path="/about-us" element={<Aboutus />} exact />
            <Route path="/global-sourcing" element={<Globalsourcing />} exact />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} exact />
            <Route path="/refund-policy" element={<RefundPolicy />} exact />
            <Route path="/queries" element={<QueriesComments />} exact />
            <Route path="/terms-conditions" element={<TermsConditions />} exact />
            <Route path="/logout" element={<Logout />} exact />
            <Route path="/error" element={<Errorpage />} exact />
            <Route path="/*" element={isPlp ? <Productlist /> : <Product />} exact />
            <Route path="/verifymail" element={<Confirmmail />} exact />
            <Route path="/accountsuccess" element={<AccountSuccess />} exact />
            <Route path="/resetpassword" element={<Home />} exact />
            <Route path="/contact-us" element={<Contactus contactData={headerFooterData} />} exact />
            <Route path="/checkout" element={isloggeduser ? <Customercheckoout /> : <Guestcheckoout />} exact />
            <Route path="/mycart" element={<Cart />} exact />
            {/* quote */}
            <Route path="/myquote" element={<Quote />} exact />
            {/* quote */}
            <Route path="/minicart" element={<Minicart />} exact />
            <Route path="/account/:key" element={<Myaccount />} exact />
            <Route path="/account/:key/:key" element={<Myaccount />} exact />
            <Route path="/ordersuccess" element={<Ordersuccess />} exact />
            <Route path="/bulkordersuccess" element={<Bulkordersucess />} exact />
            <Route path="*" element={<Errorpage />} exact />
        </Routes>
    );
};

export default AppRoutes;