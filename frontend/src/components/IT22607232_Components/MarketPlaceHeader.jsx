import { Button, Navbar, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import WishListPopUp from "./WishListPopUp";
import CartPopUp from "./CartPopUp";
import { HiStar } from "react-icons/hi";

export default function MarketPlaceHeader() {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  return (
    <Navbar className="border-b-2 sticky top-16 bg-[#3321c8] dark:bg-slate-600 z-40 flex justify-between">
      <Link to="/reserve">
        <Button
          color="dark"
          className="sm:flex items-center relative w-[200px] h-14 sm:w-[270px] hidden"
        >
          <span>
            <HiStar className="mr-2" size={25} />
          </span>{" "}
          Reserved shopitos
        </Button>
      </Link>
      <div className="flex items-center">
        <div
          className="flex items-center relative cursor-pointer mr-[15px]"
          onClick={() => setOpenWishlist(true)}
        >
          <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
          <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {wishlist && wishlist.length}
          </span>
        </div>
        <div
          className="flex items-center relative cursor-pointer mr-[15px]"
          onClick={() => setOpenCart(true)}
        >
          <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
          <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
            {cart && cart.length}
          </span>
        </div>
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        {/* cart popup */}
        {openCart && <CartPopUp setOpenCart={setOpenCart} />}
        {/* wishlist popup */}
        {openWishlist && <WishListPopUp setOpenWishlist={setOpenWishlist} />}
      </div>
    </Navbar>
  );
}
