import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const ShopList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [shopListing, setShopListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (currentUser?._id) {
      fetchShopListings();
    }
  }, [currentUser._id]);

  // Fetch shop listings from the database
  const fetchShopListings = async () => {
    try {
      const response = await fetch("/api/shopListings/read");
      const data = await response.json();

      if (data.success === false || !Array.isArray(data)) {
        setError(true);
      } else {
        setShopListing(data);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all shop listings when the component mounts or updates
  useEffect(() => {
    if (currentUser?._id) {
      fetchShopListings();
    }
  }, [currentUser._id]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shop listings. Please try again later.</div>;
  }

  const handleShopDelete = async (_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shop?"
    );
    if (!confirmDelete) {
    }
    try {
      const res = await fetch(`/api/shopListings/delete/${_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      //setShowShops((prev) => prev.filter((shop) => shop._id !== _id));
      await fetchShopListings();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full table-auto">
      <h1 className="text-center mt-7 font-extrabold text-3xl underline">
        Shop Listing
      </h1>
      {currentUser?.isAdmin && (
        <div className="w-full overflow-x-hidden">
          <div className="overflow-x-auto">
            <Table
              hoverable
              className="min-w-full bg-white shadow-md rounded-lg"
            >
              <Table.Head className="bg-gray-50">
                <Table.HeadCell className="px-4 py-2 text-left">
                  Shop ID
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Shop Name
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Images
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Location
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Description
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Category
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Phone
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Email
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Website
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Opening Hours
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Status
                </Table.HeadCell>
                <Table.HeadCell className="px-4 py-2 text-left">
                  Actions
                </Table.HeadCell>
                <Table.HeadCell>
                  <span>Update</span>
                </Table.HeadCell>
              </Table.Head>

              {shopListing.length > 0 ? (
                shopListing.map((shop) => (
                  <Table.Body key={shop._id} className="divide-y">
                    <Table.Row className="hover:bg-gray-50">
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopID}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopName}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.imageURLs && shop.imageURLs.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {shop.imageURLs.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`shop-image-${index}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        ) : (
                          <span>No Images</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopLocation}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopDescription}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopCategory}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopPhone}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopEmail}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={shop.shopWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {shop.shopWebsite}
                        </a>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.shopOpeningHours}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        {shop.isOpen ? "Open" : "Closed"}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-2 whitespace-nowrap">
                        <span
                          onClick={() => handleShopDelete(shop._id)}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/edit-shop/${shop._id}`}
                        >
                          <span>Update</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              ) : (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell colSpan="10" className="px-4 py-2 text-center">
                      No shop listings found.
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              )}
            </Table>
          </div>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Button>
          <Link to="/create-shop">Add New Shop</Link>
        </Button>
      </div>
    </div>
  );
};

export default ShopList;
