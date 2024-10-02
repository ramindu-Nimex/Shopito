import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link, useParams } from "react-router-dom";

const InventoryList_01 = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { shopID } = useParams(); // Get the shop ID from the URL
  const [showInventoryError, setShowInventoryError] = useState(false);
  const [showInventory, setShowInventory] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (currentUser?._id) {
      handleShowInventory();
    }
  }, [currentUser, shopID]); // Include shopID as a dependency

  const handleShowInventory = async () => {
    try {
      const res = await fetch(`/api/inventory/get/${shopID}`); // Fetch inventory for the specific shop
      const data = await res.json();

      if (data.success === false) {
        setShowInventoryError(true);
      } else {
        setShowInventory(data); // Ensure data is set correctly
      }
    } catch (error) {
      console.error(error);
      setShowInventoryError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this inventory?");
    if (!confirmDelete) {
      return;
    }
    try {
      const res = await fetch(`/api/inventory/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (data.message === "Inventory deleted successfully") {
        setShowInventory((prev) => prev.filter((inventory) => inventory._id !== id));
      } else {
        console.error("Deletion failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:text-white">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center dark:text-white">Inventory List</h1>
      {currentUser.isAdmin && (
        <Table hoverable className="shadow-md dark:text-white">
          <Table.Head>
            <Table.HeadCell>Product ID</Table.HeadCell>
            <Table.HeadCell>Product Name</Table.HeadCell>
            <Table.HeadCell>Product Category</Table.HeadCell>
            <Table.HeadCell>Product Description</Table.HeadCell>
            {/* <Table.HeadCell>Color</Table.HeadCell>
            <Table.HeadCell>Size</Table.HeadCell> */}
            <Table.HeadCell>Attributes</Table.HeadCell>
            <Table.HeadCell>Variations</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Images</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {showInventory && showInventory.length > 0 ? (
              showInventory.map((inventory) => (
                <Table.Row key={inventory._id}>
                  <Table.Cell>{inventory.productID}</Table.Cell>
                  <Table.Cell>{inventory.productName}</Table.Cell>
                  <Table.Cell>{inventory.productCategory}</Table.Cell>
                  <Table.Cell>{inventory.productDescription}</Table.Cell>
                  {/* <Table.Cell>
                    <div
                        style={{
                            width: '40px', // Width of the color box
                            height: '40px', // Height of the color box
                            backgroundColor: inventory.color, // Use the color code from your data
                            borderRadius: '10px', // Optional: to make the corners rounded
                            display: 'inline-block', // Ensures the box displays inline
                            marginRight: '10px', // Optional: space between color box and text
                        }}
                    ></div>
                </Table.Cell>

                  <Table.Cell>{inventory.size}</Table.Cell> */}
                  <Table.Cell>
                    {inventory.attributes && inventory.attributes.length > 0
                        ? inventory.attributes.map(attr => (
                            <div key={attr.key} className="flex items-center mb-1"> {/* Flex for alignment */}
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: attr.key, // Use the color code as the background color
                                        borderRadius: '3px',
                                        marginRight: '5px', // Space between color box and text
                                    }}
                                ></div>
                                <strong>{attr.key}</strong> 
                            </div>
                        ))
                        : 'No attributes'}
                </Table.Cell>

                  <Table.Cell>
                    {inventory.variations && inventory.variations.length > 0
                      ? inventory.variations.map((variation, index) => (
                          <div key={index}>
                            <strong>{variation.variantName}</strong><br />
                            Quantity: {variation.quantity}<br />
                            Price: ${variation.price}<br />
                          </div>
                        ))
                      : 'No variations'}
                  </Table.Cell>
                  <Table.Cell>{inventory.productStatus}</Table.Cell>
                  <Table.Cell>
                    {inventory.imageURLs && inventory.imageURLs.length > 0 ? (
                      inventory.imageURLs.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={`Inventory Image ${index + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} />
                        </a>
                      ))
                    ) : (
                      <span>No Images</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2"> {/* Use flexbox to align buttons horizontally */}
                        <Button onClick={() => handleInventoryDelete(inventory._id)} color="failure">
                            Delete
                        </Button>
                        <Link to={`/inventory-update/${inventory._id}?shopID=${shopID}`}>
                            <Button>Update</Button>
                        </Link>
                    </div>
                </Table.Cell>

                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={8}>No inventory found</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
      <div className="flex gap-2 item-center">
        <Button>
            <Link to={`/inventory-create/${shopID}`}>Add Inventory</Link>
        </Button>
      </div>
    </div>
  );
};

export default InventoryList_01;
