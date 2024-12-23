import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashShoppingAssistant from "../components/IT22577160/DashShoppingAssistant";
import DashInventory from "../components/IT22003546_Components/InventoryList_01";
import DashShop from "../components/IT22350114_Components/ShopList";
import DashOrder from "../components/IT22607232_Components/DashOrder";


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* shopping assistant */}
      {tab === "shoppingAssistant" && <DashShoppingAssistant />}
      {/* inventory */}
      {tab === "inventory" && <DashInventory />}
      {/* shop list */}
      {tab === "shop-list" && <DashShop />}
      {/* Order */}
      {tab === "order" && <DashOrder />}
      </div>
  )
}
