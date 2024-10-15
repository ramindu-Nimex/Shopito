import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { signOutSuccess } from "../redux/user/userSlice";
import { useCart } from "../context/CartContext"; // Adjust the path as needed
import Cart from "./cart"; // Import the Cart component
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const { cart } = useCart(); // Access cart from context
  const [showCart, setShowCart] = React.useState(false);

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
    <>
      <Navbar className="border-b-2 sticky top-0 bg-slate-200 shadow-md z-40">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
            Shop
          </span>
          Ito
        </Link>
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar img={currentUser.profilePicture} alt="user" rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/signIn">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>

          )}
          <Button onClick={() => setShowCart(!showCart)} className="relative flex items-center p-0">
              <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
              <span className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cart.length}
              </span>
          </Button>
          <Navbar.Toggle className="text-sm" />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/shops"} as={"div"}>
            <Link to="/shops">Shops</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/MarketPlace"} as={"div"}>
            <Link to="/MarketPlace">MarketPlace</Link>
        </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About Us</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/contact"} as={"div"}>
            <Link to="/contact">Contact Us</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      {showCart && <Cart />} {/* Conditionally render the Cart component */}
    </>
      
  );
};

export default Header;
