import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table} from "flowbite-react";
import { Link } from "react-router-dom";

const InventoryList_01 = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [showInventoryError, setShowInventoryError] = useState(false);
    const [showInventory, setShowInventory] = useState([]);

    useEffect(() => {
        handleShowInventory();
    }, [currentUser]);

    const handleShowInventory = async () => {
        try {
            const res = await fetch("/api/inventory/get");
            const data = await res.json();
            console.log(data); // Check the structure here
            if (data.success === false) {
                setShowInventoryError(true);
                return;
            }
            setShowInventory(data); // Ensure data.inventory is an array
        } catch (error) {
            console.log(error);
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
    
            // Check for HTTP error responses
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            const data = await res.json();
    
            // Log the response data for debugging
            console.log("Response data:", data);
    
            // Check if the response indicates success
            // Modify this condition based on your API's actual response format
            if (data.message === "Inventory deleted successfully") {
                setShowInventory((prev) => prev.filter((inventory) => inventory._id !== id));
            } else {
                console.error("Deletion failed:", data.message || "Unknown error");
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error deleting inventory:", error);
        }
    };
    
    

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/inventory/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setShowInventory((prev) =>
                prev.map((inventory) => {
                    if (inventory._id === id) {
                        return { ...inventory, status: newStatus };
                    }
                    return inventory;
                })
            );
        } catch (error) {
            console.log(error);
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
                                    <Table.Cell>
                                        {inventory.attributes && inventory.attributes.length > 0
                                            ? inventory.attributes.map(attr => (
                                                <div key={attr.key}>
                                                    <strong>{attr.key}:</strong> {attr.value}
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
                                                    Images: {variation.images.join(', ')}
                                                </div>
                                            ))
                                            : 'No variations'}
                                    </Table.Cell>
                                    <Table.Cell>{inventory.productStatus}</Table.Cell>
                                    <Table.Cell>
                                        {inventory.imageURLs && inventory.imageURLs.length > 0 ? (
                                            inventory.imageURLs.map((url, index) => (
                                                <a 
                                                    key={index} 
                                                    href={url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <img 
                                                        src={url} 
                                                        alt={`Inventory Image ${index + 1}`} 
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                                                    />
                                                </a>
                                            ))
                                        ) : (
                                            <span>No Images</span>
                                        )}
                                    </Table.Cell>


                                    <Table.Cell>
                                        {/* <Button
                                            onClick={() => handleStatusChange(inventory._id, inventory.productStatus === "Available" ? "Out of Stock" : "Available")}
                                        >
                                            {inventory.productStatus === "Available" ? "Set Out of Stock" : "Set Available"}
                                        </Button> */}
                                        <Button
                                            onClick={() => handleInventoryDelete(inventory._id)}
                                            color="failure"
                                        >
                                            Delete
                                        </Button>
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
                        <Link to="/inventory-create">Add Inventory</Link>
                    </Button>
                </div>    

            
        </div>
    );
}

export default InventoryList_01;
