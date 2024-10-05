import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { useCart } from "../../context/CartContext";
import { HiOutlineSortAscending, HiOutlineSortDescending } from "react-icons/hi"; // Import icons from react-icons

const ShopDetails = () => {
  const { shopID } = useParams(); // Get the shop ID from the URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [sortOrder, setSortOrder] = useState("asc"); // State for sort order
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await fetch(`/api/shopListings/read/${shopID}`);
        if (!response.ok) throw new Error("Failed to fetch shop details");
        const data = await response.json();
        setShop(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/inventory/get/${shopID}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const productData = await response.json();
        setProducts(productData);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchShopDetails();
    fetchProducts();
  }, [shopID]);

  const handleAddToCart = (product) => {
    const { selectedAttribute, selectedVariation } =
      selectedOptions[product.productID] || {};
    if (!selectedAttribute || !selectedVariation) {
      alert("Please select both a color and a variation before adding to cart.");
      return;
    }

    const itemToAdd = {
      productID: product.productID,
      productName: product.productName,
      price: selectedVariation.price,
      selectedAttribute,
      quantity: 1,
      variation: selectedVariation.variantName,
      id: product._id,
    };

    addToCart(itemToAdd);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Filter and sort products based on search term and sort order
  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName)
    );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !shop) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load shop details.
      </div>
    );
  }

  const images = shop.imageURLs && shop.imageURLs.length > 0 ? shop.imageURLs : [];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          {shop.shopName}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-hidden rounded-lg shadow-lg">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={shop.shopName}
                className="w-full h-72 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-72 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                No Image Available
              </div>
            )}
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

            {shop.shopWebsite && (
              <a
                href={shop.shopWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                Visit Website →
              </a>
            )}

            {!shop.isOpen && (
              <div className="text-lg font-bold text-red-600">
                This shop is currently closed.
              </div>
            )}
          </div>
        </div>

        {/* Search and Sort Options */}
        <div className="my-6 flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Available Products
          </h2>
          <div className="flex justify-end items-center space-x-4 mb-4">
            {/* Search Products Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 h-10 w-full max-w-md border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-600 transition duration-200 ease-in-out"
            />

            {/* Sort Button */}

            <div className="relative">
              <button
                onClick={handleSortChange}
                className="h-10 p-2 flex items-center rounded-lg shadow-md bg-gray-300 text-blue-700 hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out"
              >
                {sortOrder === "asc" ? (
                  <HiOutlineSortAscending className="w-5 h-5 inline-block" />
                ) : (
                  <HiOutlineSortDescending className="w-5 h-5 inline-block" />
                )}
                <span className="ml-2 text-sm">Sort</span>
              </button>
            </div>
          </div>
        </div>

        {/* Render Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const handleAttributeChange = (e) => {
                const newAttribute = e.target.value;
                setSelectedOptions((prev) => ({
                  ...prev,
                  [product.productID]: {
                    ...prev[product.productID],
                    selectedAttribute: newAttribute,
                  },
                }));
              };

              const handleVariationChange = (e) => {
                const selectedVariant = product.variations.find(
                  (variation) => variation.variantName === e.target.value
                );
                setSelectedOptions((prev) => ({
                  ...prev,
                  [product.productID]: {
                    ...prev[product.productID],
                    selectedVariation: selectedVariant,
                  },
                }));
              };

              return (
                <Card
                  key={product.productID}
                  className="flex flex-col items-center justify-center p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={
                      product.imageURLs.length > 0
                        ? product.imageURLs[0]
                        : "placeholder.jpg"
                    }
                    alt={product.productName}
                    className="w-32 h-32 object-cover mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.productDescription}
                  </p>
                  <p
                    className={`text-sm mb-4 ${
                      product.productStatus === "Available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {product.productStatus}
                  </p>

                  {product.productStatus === "Available" ? (
                    <>
                      <div className="w-full mb-4">
                        <h4 className="font-semibold mb-1">Select Color:</h4>
                        <select
                          className="border rounded p-2 w-full"
                          onChange={handleAttributeChange}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {product.attributes.map((attr, index) => (
                            <option key={index} value={attr.key}>
                              {attr.key}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full mb-4">
                        <label
                          htmlFor="variations"
                          className="font-semibold mb-1"
                        >
                          Select Variation:
                        </label>
                        <select
                          id="variations"
                          className="border rounded p-2 w-full"
                          onChange={handleVariationChange}
                        >
                          <option value="">Select</option>
                          {product.variations.map((variation) => (
                            <option
                              key={variation.variantName}
                              value={variation.variantName}
                            >
                              {variation.variantName}
                            </option>
                          ))}
                        </select>
                        {selectedOptions[product.productID]
                          ?.selectedVariation && (
                          <p className="text-lg font-semibold mt-2">
                            Price: LKR{" "}
                            {
                              selectedOptions[product.productID]
                                .selectedVariation.price
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center mt-4 w-full">
                        <Button
                          color="dark"
                          onClick={() => handleAddToCart(product)}
                          className="py-2 px-4 rounded-lg"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-600 mt-4">
                      This product is out of stock.
                    </p>
                  )}
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
