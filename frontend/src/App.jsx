import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUs from "./Pages/ContactUs";
import FooterComponent from "./components/FooterComponent";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ChatDashboard from "./components/IT22577160/ChatDashboard";
import DashboardChatRoom from "./components/IT22577160/DashboardChatRoom";
import ChatDashboardIntro from "./components/IT22577160/ChatDashboardIntro";
import ShoppingAssistant from "./components/IT22577160/ShoppingAssistant";

import ProductForm from "./Pages/IT22003546_Pages/ProductCreate_01";
import ShopList from "./components/IT22350114_Components/ShopUserView_02";
import Inventory from "./components/IT22003546_Components/InventoryUserView_01";
import ProductUpdate from "./Pages/IT22003546_Pages/ProductUpdate_01";

import ShopCreate from "./Pages/IT22350114_Pages/ShopFormPage.jsx";
import ShopListPage from "./components/IT22350114_Components/ShopList.jsx";
import ShopsPage from "./components/IT22350114_Components/ShopsPage.jsx";
import ShopDetails from "./components/IT22350114_Components/ShopDetails.jsx";
import InventoryList_01 from "./components/IT22003546_Components/InventoryList_01.jsx";

import ShopitoMart from "./Pages/IT22607232_Pages/ShopitoMart";
import ShopitoMartUpdate from "./Pages/IT22607232_Pages/ShopitoMartUpdate";
import MarketPlace from "./Pages/IT22607232_Pages/MarketPlace";


const App = () => {
  return (
    <>
      <Router>
        <Header />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/signIn" element={<SignInPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
              
             <Route path="/marketPlace" element={<MarketPlace />} />
            <Route path="/create-shop" element={<ShopCreate />} />
            <Route path="/shop-list" element={<ShopListPage />} />
            <Route path="/edit-shop/:shopId" element={<ShopCreate />} />
            <Route path="/shops" element={<ShopsPage />} />
            <Route path="/shops/:shopID" element={<ShopDetails />} /> {/* Add this */}


            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route element={<ChatDashboard />}>
                <Route
                  path="/dashboard/chats"
                  element={<ChatDashboardIntro />}
                />
                <Route
                  path="/dashboard/chats/:id"
                  element={<DashboardChatRoom />}
                />
              </Route>
                <Route
                  path="/dashboard/shopAsisstant"
                  element={<ShoppingAssistant />}
                />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ShopitoMart" element={<ShopitoMart />} />
              <Route
                path="/update-order/:orderId"
                element={<ShopitoMartUpdate />}
              />
            </Route>
            <Route path="/inventory-create/:shopID" element={<ProductForm />} />
            <Route path="/shop-User:shopID" element={<ShopList />} />
            <Route path="/shops/:shopID" element={<Inventory />} />
            <Route path="/inventory-update/:Inventoryid" element={<ProductUpdate />} />
            <Route path="/inventory-shop/:shopID" element={<InventoryList_01 />} />
          </Routes>
        </div>
        {/* <FooterComponent /> */}
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
