import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa6";
import { HiArrowSmRight,HiOutlineShoppingBag, HiUser } from "react-icons/hi";
import { HiOutlineClipboardList, HiOutlinePlusCircle } from "react-icons/hi"; 
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { GrResources } from "react-icons/gr";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56 shadow-md">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=shoppingAssistant">
            <Sidebar.Item
              active={tab === "shoppingAssistant"}
              icon={FaRobot}
              labelColor="dark"
              as="div"
            >
              Shopping Assistant
            </Sidebar.Item>
          </Link>


{currentUser.isAdmin && (    
  <>
    {/* <Link to="/dashboard?tab=inventory">
      <Sidebar.Item
        active={tab === "inventory"}
        icon={HiUser}
        label="Inventory"
        labelColor="dark"
        as="div"
      >
        Inventory
      </Sidebar.Item>
    </Link> */}
    <Link to="/dashboard?tab=shop-list">
      <Sidebar.Item
        active={tab === "shop-list"}
        icon={HiOutlineClipboardList}
        as="div"
      >
        Shop List
      </Sidebar.Item>
    </Link>

  </>
)}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=shop-list">
                <Sidebar.Item
                  active={tab === "shop-list"}
                  icon={HiOutlineClipboardList}
                  label="Inventory"
                  labelColor="dark"
                  as="div"
                >
                  Shop List
                </Sidebar.Item>
              </Link>
            </>
          )}

          {currentUser.isShoppingOrderAdmin && (
            <>
              <Link to="/dashboard?tab=order">
                <Sidebar.Item
                  active={tab === "order"}
                  icon={GrResources}
                  as="div"
                >
                  Order
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
