import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ShopDetails = () => {
  const { shopID } = useParams(); // Get the shop ID from the URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]); // State for products
  const { addToCart } = useCart();
  // const [selectedAttribute, setSelectedAttribute] = useState('');
  // const [selectedVariation, setSelectedVariation] = useState(null); // State to hold the selected variation
  // const [selectedPrice, setSelectedPrice] = useState(null); // New state for price
  const [selectedOptions, setSelectedOptions] = useState({});

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


    const handleAddToCart = (product) => {
      const { selectedAttribute, selectedVariation } = selectedOptions[product.productID] || {};
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
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      {/* Cart Button */}
      

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
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-8 text-center">Available Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => {
                const handleAttributeChange = (e) => {
                  const newAttribute = e.target.value;
                  setSelectedOptions(prev => ({
                    ...prev,
                    [product.productID]: {
                      ...prev[product.productID],
                      selectedAttribute: newAttribute,
                    },
                  }));
                };

                const handleVariationChange = (e) => {
                  const selectedVariant = product.variations.find(variation => variation.variantName === e.target.value);
                  setSelectedOptions(prev => ({
                    ...prev,
                    [product.productID]: {
                      ...prev[product.productID],
                      selectedVariation: selectedVariant,
                    },
                  }));
                };

                return (
                  <Card key={product.productID} className="flex flex-col items-center justify-center p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                    <img
                      src={product.imageURLs.length > 0 ? product.imageURLs[0] : "placeholder.jpg"}
                      alt={product.productName}
                      className="w-32 h-32 object-cover mb-4 rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
                    <p className={`text-sm mb-4 ${product.productStatus === 'Available' ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {product.productStatus}
                    </p>
                
                    {/* Disable inputs and button if the product is out of stock */}
                    {product.productStatus === 'Available' ? (
                      <>
                        <div className="w-full mb-4">
                          <h4 className="font-semibold mb-1">Select Color:</h4>
                          <select
                            className="border rounded p-2 w-full"
                            onChange={handleAttributeChange}
                            defaultValue=""
                          >
                            <option value="" disabled>Select</option>
                            {product.attributes.map((attr, index) => (
                              <option key={index} value={attr.key}>
                                {attr.key}
                              </option>
                            ))}
                          </select>
                        </div>
                
                        <div className="w-full mb-4">
                          <label htmlFor="variations" className="font-semibold mb-1">Select Variation:</label>
                          <select
                            id="variations"
                            className="border rounded p-2 w-full"
                            onChange={handleVariationChange}
                          >
                            <option value="">Select</option>
                            {product.variations.map(variation => (
                              <option key={variation.variantName} value={variation.variantName}>
                                {variation.variantName}
                              </option>
                            ))}
                          </select>
                          {/* Display the selected variation price */}
                          {selectedOptions[product.productID]?.selectedVariation && (
                            <p className="text-lg font-semibold mt-2">
                              Price: LKR {selectedOptions[product.productID].selectedVariation.price}
                            </p>
                          )}
                        </div>
                
                        <div className="flex justify-center mt-4 w-full">
                          <Button color="dark" onClick={() => handleAddToCart(product)} className="py-2 px-4 rounded-lg">
                            Add to Cart
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-600 mt-4">This product is out of stock.</p>
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
    </div>
  );
};

export default ShopDetails;