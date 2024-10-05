// components/ShopListView.jsx
import React from "react";
import { Link } from "react-router-dom";

const ShopListView = ({ shops }) => {
  return (
    <div className="space-y-6">
      {shops.map((shop) => (
        <Link
          to={`/shops/${shop.shopID}`}
          key={shop._id}
          className={`relative flex bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 transition-shadow duration-300 hover:shadow-2xl ${
            !shop.isOpen ? "opacity-50" : ""
          }`}
        >
          {/* Image */}
          <div className="w-1/3 overflow-hidden rounded-lg">
            <img
              src={shop.imageURLs[0]}
              alt={shop.shopName}
              className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110"
            />
            {!shop.isOpen && (
              <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-lg font-bold px-4 py-2">
                Closed
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="w-2/3 pl-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
              {shop.shopName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {shop.shopLocation}
            </p>
            <p className="text-gray-800 dark:text-gray-300 text-md mb-4">
              {shop.shopDescription}
            </p>
            <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
              Opening Hours: {shop.shopOpeningHours}
            </p>
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 right-2 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {shop.shopCategory}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShopListView;
