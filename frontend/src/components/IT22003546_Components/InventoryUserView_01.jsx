import { useState, useEffect } from "react";
import { Button, Card } from "flowbite-react";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from the backend
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/inventory/get"); // Adjust the API endpoint
                const data = await response.json();
                if (response.ok) {
                    setProducts(data); // Assuming the response is an array of products
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
    }, []); // Empty dependency array ensures this only runs once on component mount

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
                            <p className="text-sm text-gray-500">Category: {product.productCategory}</p>
                            <p className="text-sm text-green-600">Status: {product.productStatus}</p>
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
