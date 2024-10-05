import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTh, FaBars, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"; // Import icons
import ShopListView from "./ShopListView"; // Import the ListView component

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // State to switch between grid and list view
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const [showSortOptions, setShowSortOptions] = useState(false); // Toggle for sort dropdown

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

  const handleSortChange = (order) => {
    setSortOrder(order);
    setShowSortOptions(false); // Close dropdown after selecting
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
              {/* More options based on your provided categories */}
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

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="p-3 border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-600 transition duration-200 ease-in-out flex items-center"
            >
              <FaSortAlphaDown className="mr-2" /> {/* Sort icon */}
              Sort
            </button>
            {showSortOptions && (
              <div className="absolute bg-white dark:bg-gray-800 border border-gray-300 rounded-lg shadow-lg mt-2 right-0 w-48">
                <button
                  onClick={() => handleSortChange("asc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaSortAlphaDown className="mr-2" /> Alphabetical Ascending
                </button>
                <button
                  onClick={() => handleSortChange("desc")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaSortAlphaUp className="mr-2" /> Alphabetical Descending
                </button>
              </div>
            )}
          </div>

          {/* Toggle View Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-purple-600 text-white" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <FaBars />
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
