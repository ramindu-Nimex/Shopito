import React, { useState, useEffect } from "react";

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All"); // Filter state

  // Fetch all shops from the API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch("/api/shopListings/read");
        const data = await response.json();
        setShops(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // Filtered shops based on the selected category
  const filteredShops =
    filter === "All"
      ? shops
      : shops.filter((shop) => shop.shopCategory === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load shops. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-100">
        Our Shops
      </h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300"
        >
          <option value="All">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Groceries">Groceries</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Shop Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={shop.imageURLs[0]}
                alt={shop.shopName}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                  {shop.shopName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {shop.shopLocation}
                </p>
                <p className="text-gray-800 dark:text-gray-300">
                  {shop.shopDescription}
                </p>
                <a
                  href={shop.shopWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-800 dark:text-gray-300 col-span-full text-center">
            No shops found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;
