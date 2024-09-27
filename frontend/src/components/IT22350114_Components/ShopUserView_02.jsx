import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react"; // If you're using Flowbite
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ShopList = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use navigate for programmatic navigation

    useEffect(() => {
        // Fetch shop listings using the fetch API
        const fetchShops = async () => {
            try {
                const response = await fetch("/api/shopListings/read"); // Adjust the API endpoint if needed
                
                if (!response.ok) {
                    throw new Error("Failed to fetch shop listings");
                }

                const data = await response.json();
                setShops(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []); // Run once when the component mounts

    const handleShopClick = (shopID) => {
        // Navigate to the shop's detail page or perform any action you want
        navigate(`/shops/${shopID}`);
    };

    if (loading) return <p>Loading shops...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold mb-8">Shop Listings</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shops.length > 0 ? (
                    shops.map((shop) => (
                        <div
                            key={shop.shopID}
                            onClick={() => handleShopClick(shop.shopID)} // Add onClick handler to navigate
                            className="cursor-pointer"
                        >
                            <Card className="flex flex-col items-center justify-center p-4">
                                <img
                                    src={shop.imageUrls.length > 0 ? shop.imageUrls[0] : "placeholder.jpg"}
                                    alt={shop.shopName}
                                    className="w-40 h-40 object-cover mb-4 rounded-lg"
                                />
                                <h3 className="text-lg font-semibold">{shop.shopName}</h3>
                                <p className="text-sm text-gray-600 mb-2">{shop.shopDescription}</p>
                                <p className="text-sm text-gray-500">{shop.shopLocation}</p>
                                <p className="text-sm text-gray-500">Category: {shop.shopCategory}</p>
                                <p className={`text-sm font-medium ${shop.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                                    {shop.isOpen ? 'Open' : 'Closed'}
                                </p>
                                {shop.shopPhone && <p className="text-sm text-gray-600">Phone: {shop.shopPhone}</p>}
                                {shop.shopEmail && <p className="text-sm text-gray-600">Email: {shop.shopEmail}</p>}
                                {shop.shopWebsite && (
                                    <a href={shop.shopWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Website
                                    </a>
                                )}
                                {shop.shopOpeningHours && <p className="text-sm text-gray-500">Hours: {shop.shopOpeningHours}</p>}
                            </Card>
                        </div>
                    ))
                ) : (
                    <p>No shops available</p>
                )}
            </div>
        </div>
    );
};

export default ShopList;
