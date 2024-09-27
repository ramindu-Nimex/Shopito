import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";

const ShopDetails = () => {
  const { shopID } = useParams(); // Get the shop ID from the URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]); // State for products

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

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/inventory/get/${shopID}`); // Adjust the API endpoint to fetch products for the specific shop
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await response.json();
        setProducts(productData); // Set the products data
      } catch (error) {
        console.error(error);
        setError(true); // Handle error if API call fails
      }
    };

    fetchShopDetails();
    fetchProducts(); // Fetch products when the component mounts
  }, [shopID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load shop details.
      </div>
    );
  }

  // Ensure imageURLs exist before accessing them
  const images =
    shop.imageURLs && shop.imageURLs.length > 0 ? shop.imageURLs : [];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      {/* Cart Button */}
      <div className="flex justify-end fixed top-30 right-10 z-50">
        <button className="relative p-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full hover:from-teal-400 hover:to-blue-500 focus:outline-none shadow-md shadow-gray-400 hover:shadow-lg hover:shadow-gray-500 transform hover:scale-105 transition-all duration-300">
          <i className="fas fa-cart-shopping text-2xl"></i>
          <span className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            3
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          {shop.shopName}
        </h1>
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
              <div className="text-lg font-bold text-red-600">
                This shop is currently closed.
              </div>
            )}
          </div>
        </div>

        {/* Render Products */}
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">Available Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <Card key={product.productID} className="flex flex-col items-center justify-center p-4">
                            <img
                                src={product.imageURLs.length > 0 ? product.imageURLs[0] : "placeholder.jpg"}
                                alt={product.productName}
                                className="w-40 h-40 object-cover mb-4 rounded-lg"
                            />
                            <h3 className="text-lg font-semibold">{product.productName}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
                            <p className="text-sm text-green-600">Status: {product.productStatus}</p>

                            {/* Display variations */}
                            <div className="mt-4">
                                <h4 className="font-semibold">Variations:</h4>
                                {product.variations && product.variations.length > 0 ? (
                                    product.variations.map((variation, index) => (
                                        <div key={index} className="border p-2 my-2 rounded-md">
                                            <p className="text-sm">Variant: {variation.variantName}</p>
                                            <p className="text-sm">Quantity: {variation.quantity}</p>
                                            <p className="text-sm">Price: ${variation.price}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No variations available</p>
                                )}
                            </div>

                            <div className="flex justify-center space-x-2 mt-4 w-full">
                              <Button color="dark">Add to Cart</Button>
                          </div>
                        </Card>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
