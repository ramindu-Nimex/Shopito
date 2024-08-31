import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";

const DashShops_02 = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex justify-center mt-8 mx-auto ">
      {currentUser.isShopAdmin && (
        <div className="w-full max-w-xs">
          <h1 className="text-2xl font-semibold mt-8 mb-4 text-center">
            Dash Shops
          </h1>
          <div className="flex justify-center gap-6">
            <Button pill>
              <Link to="/shop-create">Create Shop</Link>
            </Button>
            <Button pill>
              <Link to="/shop-list:shopId">View Shops</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashShops_02;
