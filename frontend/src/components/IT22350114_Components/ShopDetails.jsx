import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ShopDetails = () => {
  const { shopID } = useParams(); // Get the shop ID from the URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await fetch(`/api/shopListings/read/${shopID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch shop details");
        }
        const data = await response.json();
        setShop(data); // Set shop data if the API call is successful
      } catch (error) {
        setError(true); // Handle error if API call fails
      } finally {
        setLoading(false); // Ensure loading state is stopped
      }
    };
    fetchShopDetails();
  }, [shopID]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !shop) {
    return <div className="flex items-center justify-center h-screen text-red-500">Failed to load shop details.</div>;
  }

  // Ensure imageURLs exist before accessing them
  const images = shop.imageURLs && shop.imageURLs.length > 0 ? shop.imageURLs : [];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">{shop.shopName}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shop Images */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            {images.length > 0 ? (
              <img
                src={images[0]} // Safely access the first image
                alt={shop.shopName}
                className="w-full h-72 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-72 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                No Image Available
              </div>
            )}

            {/* Additional Images Carousel (if images exist) */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.slice(1).map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Additional image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Shop Details */}
          <div className="flex flex-col space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Location:</strong> {shop.shopLocation}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Opening Hours:</strong> {shop.shopOpeningHours}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Phone:</strong> {shop.shopPhone}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {shop.shopEmail}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Category:</strong> {shop.shopCategory}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {shop.shopDescription}
            </p>

            {/* If the shop has a website */}
            {shop.shopWebsite && (
              <a
                href={shop.shopWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold transition-colors"
              >
                Visit Website →
              </a>
            )}

            {/* Closed Badge if the shop is closed */}
            {!shop.isOpen && (
              <div className="text-lg font-bold text-red-600">This shop is currently closed.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
