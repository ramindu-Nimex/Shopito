import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";

const Inventory = () => {
    const { shopID } = useParams(); // Get shopID from URL params
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!shopID) {
                setError("Shop ID is required");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/inventory/get/${shopID}`); // Fetch products for the specific shopID
                const data = await response.json();
                console.log("Received shopID:", shopID);
                if (response.ok) {
                    setProducts(data);
                } else {
                    setError("Failed to fetch products");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [shopID]);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
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

                            <div className="flex space-x-2 mt-4">
                                <Button color="success">View</Button>
                                <Button color="dark">Add to Cart</Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default Inventory;
