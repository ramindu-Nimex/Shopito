import React, { useState, useEffect } from "react";

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term

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

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter shops based on selected category and search term
  const filteredShops = shops.filter((shop) => {
    const matchesCategory =
      selectedCategory === "All" || shop.shopCategory === selectedCategory;
    const matchesSearchTerm = shop.shopName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
      <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800 dark:text-gray-100">
        Our Shops
      </h1>

      {/* Search Bar and Filter Dropdown */}
      <div className="flex justify-between items-center mb-8">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-3 w-full max-w-md border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-600 transition duration-200 ease-in-out"
        />

        {/* Filter Dropdown */}
        <div className="relative ml-4">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-3 border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-600 transition duration-200 ease-in-out"
          >
            <option value="All">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Groceries">Groceries</option>
            <option value="Home Decor">Home Decor</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>

          {/* Modern Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Shop Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <div
              key={shop._id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 ${
                !shop.isOpen ? "opacity-50" : ""
              }`}
            >
              {/* Image with Closed Overlay for closed shops */}
              <div className="overflow-hidden rounded-t-lg relative">
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
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                  {shop.shopName}
                </h3>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                  <p>{shop.shopLocation}</p>
                  <p>Opening Hours: {shop.shopOpeningHours}</p>
                </div>
                <p className="text-gray-800 dark:text-gray-300 text-md mb-4">
                  {shop.shopDescription}
                </p>
                <a
                  href={`/shops/${shop.shopID}`} // Navigates to ShopDetails page
                  className="inline-block mt-4 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  View Details →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 dark:text-gray-300">
            No shops match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;
