import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi"; // Import sorting icons
import ShopListView from "./ShopListView"; // Import the ListView component

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // State to switch between grid and list view
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order

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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Toggle between ascending and descending
  };

  // Filter and sort shops
  const filteredShops = shops
    .filter((shop) => {
      const matchesCategory =
        selectedCategory === "All" || shop.shopCategory === selectedCategory;
      const matchesSearchTerm = shop.shopName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearchTerm;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.shopName.localeCompare(b.shopName)
        : b.shopName.localeCompare(a.shopName)
    );

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

      {/* Search, Filter, and Sort Options */}
      <div className="flex justify-between items-center mb-8">
        <input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-3 w-full max-w-md border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-600 transition duration-200 ease-in-out"
        />

        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-3 border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-600 transition duration-200 ease-in-out"
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Groceries">Groceries</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Books">Books</option>
              <option value="Food&Beverages">Food & Beverages</option>
              <option value="Beauty&Health">Beauty & Health</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Sports&Fitness">Sports & Fitness</option>
              <option value="Automotive">Automotive</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sorting Dropdown with Icon */}
          <div className="relative">
            <button
              onClick={handleSortChange}
              className="p-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 ease-in-out"
            >
              {sortOrder === "asc" ? (
                <HiOutlineSortAscending className="w-5 h-5 inline-block" />
              ) : (
                <HiOutlineSortDescending className="w-5 h-5 inline-block" />
              )}
              <span className="ml-2">Sort</span>
            </button>
          </div>

          {/* Toggle View Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {/* Grid View Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h4M4 12h4M4 18h4M12 6h4M12 12h4M12 18h4M20 6h4M20 12h4M20 18h4"
                />
              </svg>
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {/* List View Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Render Grid View or List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredShops.map((shop) => (
            <Link
              to={`/shops/${shop.shopID}`}
              key={shop._id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 ${
                !shop.isOpen ? "opacity-50" : ""
              }`}
            >
              <div className="absolute top-2 right-2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {shop.shopCategory}
              </div>

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
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ShopListView shops={filteredShops} /> // Use List View Component
      )}
    </div>
  );
};

export default ShopsPage;
