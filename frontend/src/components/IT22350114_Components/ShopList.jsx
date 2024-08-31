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

  // Fetch service listings from the database
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading service listings. Please try again later.</div>;
  }

  return (
    <div className="w-full table-auto">
      <h1 className="text-center mt-7 font-extrabold text-3xl underline">
        Service Listing
      </h1>
      {currentUser?.isAdmin && (
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Service ID</Table.HeadCell>
            <Table.HeadCell>Service Name</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Availability</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Requirements</Table.HeadCell>
            <Table.HeadCell>Images</Table.HeadCell>
          </Table.Head>

          {shopListing.length > 0 ? (
            shopListing.map((shop) => (
              <Table.Body key={shop._id} className="divide-y-0">
                <Table.Row>
                  <Table.Cell>{shop.name}</Table.Cell>
                  <Table.Cell>{shop.serviceName}</Table.Cell>
                  <Table.Cell>{shop.serviceDescription}</Table.Cell>
                  <Table.Cell>{shop.servicePrice}</Table.Cell>
                  <Table.Cell>{shop.serviceType}</Table.Cell>
                  <Table.Cell>{shop.serviceAvailability}</Table.Cell>
                  <Table.Cell>{shop.servicePhone}</Table.Cell>
                  <Table.Cell>{shop.serviceEmail}</Table.Cell>
                  <Table.Cell>{shop.serviceRequirements}</Table.Cell>
                  <Table.Cell>
                    {shop.imageUrls?.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Service Image ${index}`}
                        style={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell colSpan="10" className="text-center">
                  No service listings found.
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table>
      )}
      <div className="flex gap-2 items-center">
                    <Button> 
                        <Link to="/create-shop">Create Amenity</Link>
                    </Button>
                    </div>
    </div>
    
  );
};

export default ShopList;