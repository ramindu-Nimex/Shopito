import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import "jspdf-autotable";

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
        // Filter shops based on user roles
        if (currentUser.isInventoryAdmin) {
          // Show all shops if the user has inventory or outlet admin privileges
          setShopListing(data);
        } else if (currentUser.isAdmin) {
          // Show only shops created by the admin user
          const userShops = data.filter(shop => shop.ownerID === currentUser.username);
          setShopListing(userShops);
        } else {
          // If the user is not an admin, show no shops or handle accordingly
          setShopListing([]);
        }
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
    return <div>Error loading shop listings. Please try again later.</div>;
  }

  const handleShopDelete = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shop?");
    if (!confirmDelete) {
      return;
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
      await fetchShopListings();
    } catch (error) {
      console.log(error.message);
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Shop Listings Report", 14, 22);

    const tableColumn = [
      "Shop Name",
      "Location",
      "Opening Hours",
      "Phone",
      "Email",
      "Category",
      "Status",
    ];

    const tableRows = shopListing.map((shop) => [
      shop.shopName,
      shop.shopLocation,
      shop.shopOpeningHours,
      shop.shopPhone || "N/A",
      shop.shopEmail || "N/A",
      shop.shopCategory,
      shop.isOpen ? "Open" : "Closed",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
    });

    doc.save("shop-listings-report.pdf");
  };

  const generateCSVReport = () => {
    const csvData = shopListing.map((shop) => ({
      "Shop ID": shop.shopID,
      "Shop Name": shop.shopName,
      Location: shop.shopLocation,
      Category: shop.shopCategory,
      Status: shop.isOpen ? "Open" : "Closed",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "shop-listings-report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcelReport = () => {
    const ws = XLSX.utils.json_to_sheet(
      shopListing.map((shop) => ({
        "Shop ID": shop.shopID,
        "Shop Name": shop.shopName,
        Location: shop.shopLocation,
        Category: shop.shopCategory,
        Status: shop.isOpen ? "Open" : "Closed",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shop Listings");
    XLSX.writeFile(wb, "shop-listings-report.xlsx");
  };

  return (
    <div className="w-full p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-center mt-7 font-extrabold text-4xl text-gray-800 dark:text-white underline mb-10">
        Shop Listings
      </h1>
      
      {currentUser?.isAdmin && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Shop ID</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Shop Name</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Images</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Location</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Description</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Category</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Phone</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Email</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Website</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Opening Hours</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Status</th>
                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            
            {shopListing.length > 0 ? (
              shopListing.map((shop) => (
                <tbody key={shop._id} className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopID}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopName}</td>
                    <td className="px-4 py-3">
                      {shop.imageURLs && shop.imageURLs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {shop.imageURLs.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`shop-image-${index}`}
                              className="w-16 h-16 object-cover rounded shadow-md"
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No Images</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopLocation}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopDescription}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopCategory}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopPhone}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopEmail}</td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400">
                      <a
                        href={shop.shopWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {shop.shopWebsite}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{shop.shopOpeningHours}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {shop.isOpen ? (
                        <span className="text-green-500 font-semibold">Open</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Closed</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <span
                          onClick={() => handleShopDelete(shop._id)}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/edit-shop/${shop.shopID}`}
                        >
                          Update
                        </Link>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/inventory-shop/${shop.shopID}`}
                        >
                          Inventory
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan="12" className="px-4 py-3 text-center text-gray-500 dark:text-gray-300">
                    No shop listings found.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      )}

      {/* Add New Shop Button */}
      <div className="mt-8 flex justify-center">
        <Button className="text-white bg-teal-500 hover:bg-teal-600">
          <Link to="/create-shop" className="block w-full h-full">
            Add New Shop
          </Link>
        </Button>
      </div>
  
      {/* Report Generation Buttons */}
      <div className="mt-8 flex justify-between">
        <Button onClick={generatePDFReport} className="text-white bg-blue-500 hover:bg-blue-600">
          Generate PDF Report
        </Button>

        <Button onClick={generateCSVReport} className="text-white bg-green-500 hover:bg-green-600">
          Generate CSV Report
        </Button>

        <Button onClick={generateExcelReport} className="text-white bg-teal-500 hover:bg-teal-600">
          Generate Excel Report
        </Button>
      </div>
    </div>
  );
};

export default ShopList;