import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import XLSX from "xlsx-js-style";



const InventoryList_01 = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { shopID } = useParams(); 
  const [showInventoryError, setShowInventoryError] = useState(false);
  const [showInventory, setShowInventory] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [shopName, setShopName] = useState(""); 

  useEffect(() => {
    if (currentUser?._id) {
      handleShowInventory();
      fetchShopDetails(); 
    }
  }, [currentUser, shopID]); 

  const handleShowInventory = async () => {
    try {
      const res = await fetch(`/api/inventory/get/${shopID}`); 
      const data = await res.json();

      if (data.success === false) {
        setShowInventoryError(true);
      } else {
        setShowInventory(data); 
      }
    } catch (error) {
      console.error(error);
      setShowInventoryError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shop details to get the shop name
  const fetchShopDetails = async () => {
    try {
      const res = await fetch(`/api/shopListings/read/${shopID}`);
      const data = await res.json();
      if (res) {
        setShopName(data.shopName); 
      }
    } catch (error) {
      console.error("Failed to fetch shop details:", error);
    }
  };

  const handleInventoryDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory?"
    );
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
        setShowInventory((prev) =>
          prev.filter((inventory) => inventory._id !== id)
        );
      } else {
        console.error("Deletion failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  // Function to generate PDF report with adjusted column widths and scaling
const generatePDFReport = () => {
  const doc = new jsPDF("landscape"); // Set to landscape orientation

  // Set custom styles for the document title and Shop ID
  doc.setFontSize(18);
  doc.setTextColor("#4B0082"); // Indigo for title
  doc.text(`Inventory Report - ${shopName}`, 14, 22); // Display shop name
  doc.setFontSize(14);
  doc.setTextColor("#000080"); // Navy for Shop ID
  doc.text(`Shop ID: ${shopID}`, 14, 30); // Display shop ID

  // Create a table structure using autoTable with custom styles and adjusted column widths
  doc.autoTable({
    startY: 40, // Start below the shop name and ID
    head: [
      [
        "Product ID",
        "Product Name",
        "Category",
        "Description",
        "Attributes",
        "Variations",
        "Status",
      ],
    ],
    body: showInventory.map((inventory) => [
      inventory.productID,
      inventory.productName,
      inventory.productCategory,
      inventory.productDescription,
      inventory.attributes?.map((attr) => `${attr.key}`).join(", ") || "N/A",
      inventory.variations
        ?.map(
          (variation) =>
            `${variation.variantName} (Qty: ${variation.quantity}, Price: $${variation.price})`
        )
        .join(", ") || "N/A",
      inventory.productStatus,
    ]),
    
    styles: {
      fillColor: [240, 248, 255], 
      textColor: [0, 0, 139], 
      fontStyle: "normal",
      fontSize: 10, 
      halign: "center", 
      valign: "middle", 
      lineColor: [0, 0, 139], 
      lineWidth: 0.2, 
    },
    
    headStyles: {
      fillColor: [75, 0, 130], 
      textColor: [255, 255, 255], 
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
      lineColor: [0, 0, 139], 
      lineWidth: 0.2, 
    },
    
    alternateRowStyles: {
      fillColor: [230, 230, 250], 
    },
    
    columnStyles: {
      0: { cellWidth: 25 }, 
      1: { cellWidth: 35 }, 
      2: { cellWidth: 30 }, 
      3: { cellWidth: 70 }, 
      4: { cellWidth: 30 }, 
      5: { cellWidth: 60 }, 
      6: { cellWidth: 20 }, 
    },
    // Scale down content to fit within the page
    theme: "grid",
    useCss: true,
    tableWidth: 'wrap', // Fit columns within page width
    margin: { top: 40 }, // Margin to keep distance from the title
    pageBreak: 'auto', // Break table across pages if necessary
  });

  // Save the PDF
  doc.save(`Inventory_Report_${shopName}.pdf`); // Save with shop name in filename
};

// Function to generate Excel report with balanced purple styling and adjusted spacing
const generateExcelReportWithStyles = () => {
  const workbook = XLSX.utils.book_new();

  // Create an empty worksheet and add shop information
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`Shop Name: ${shopName}`], // Row 1: Shop Name
    [`Shop ID: ${shopID}`],     // Row 2: Shop ID
    [],                         // Row 3: Empty row for spacing
  ]);

  // Merge cells A1:H1 for the shop name
  if (!worksheet['!merges']) worksheet['!merges'] = [];
  worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }); // Merge cells A1:H1 for Shop Name
  worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }); // Merge cells A2:H2 for Shop ID

  // Add colors and styles to the shop name and shop ID rows
  worksheet['A1'].s = {
    fill: { fgColor: { rgb: "4B0082" } }, // Background color (Indigo)
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 16 }, // Text color (White), Font size (16)
    alignment: { horizontal: "center", vertical: "center" },
  };
  worksheet['A2'].s = {
    fill: { fgColor: { rgb: "4B0082" } }, // Background color (Indigo)
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 }, // Text color (White), Font size (14)
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Create the header for the inventory table starting from row 4
  const inventoryHeaders = [
    ["Product ID", "Product Name", "Category", "Description", "Attributes", "Variations", "Status"]
  ];

  // Convert inventory data into a sheet starting from row 5
  const inventoryData = showInventory.map((inventory) => [
    inventory.productID,
    inventory.productName,
    inventory.productCategory,
    inventory.productDescription,
    inventory.attributes?.map((attr) => `${attr.key}`).join(", ") || "N/A",
    inventory.variations
      ?.map((variation) => `${variation.variantName} (Qty: ${variation.quantity}, Price: $${variation.price})`)
      .join(", ") || "N/A",
    inventory.productStatus,
  ]);

  // Add headers and data below the merged heading row
  XLSX.utils.sheet_add_aoa(worksheet, inventoryHeaders, { origin: "A4" });
  XLSX.utils.sheet_add_json(worksheet, inventoryData, { origin: "A5", skipHeader: true });

  // Apply styles to header row
  inventoryHeaders[0].forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 3, c: index }); // Header is on row 4 (index 3)
    if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
    worksheet[cellAddress].s = {
      fill: { fgColor: { rgb: "6A0DAD" } }, // Background color (Dark Purple)
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 }, // Text color (White), Font size (12)
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "FFFFFF" } },
        bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        left: { style: "thin", color: { rgb: "FFFFFF" } },
        right: { style: "thin", color: { rgb: "FFFFFF" } },
      },
    };
  });

  // Apply styles to the data cells
  inventoryData.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 4, c: colIndex });
      if (!worksheet[cellAddress]) worksheet[cellAddress] = {};
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: "E6E6FA" } }, // Background color (Lavender)
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "4B0082" } },
          bottom: { style: "thin", color: { rgb: "4B0082" } },
          left: { style: "thin", color: { rgb: "4B0082" } },
          right: { style: "thin", color: { rgb: "4B0082" } },
        },
      };
    });
  });

  // Adjust column widths for better readability
  const columnWidths = [
    { wch: 15 }, // Width for Product ID
    { wch: 20 }, // Width for Product Name
    { wch: 15 }, // Width for Category
    { wch: 25 }, // Width for Description
    { wch: 20 }, // Width for Attributes
    { wch: 30 }, // Width for Variations
    { wch: 15 }, // Width for Status
  ];
  worksheet['!cols'] = columnWidths;

  // Append worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

  // Export the Excel file
  XLSX.writeFile(workbook, `Inventory_Report_${shopName}.xlsx`);
};


  // Function to generate CSV report without adding shop name and ID as separate rows
const generateCSVReport = () => {
  // Create a CSV content string with the shop name and ID as headers
  let csvContent = `Inventory Report for ${shopName}\n`;
  csvContent += `Shop ID: ${shopID}\n\n`; // Add shop details as a header

  // Create a header for the inventory table
  const headers = ["Product ID", "Product Name", "Category", "Description", "Attributes", "Variations", "Status"];

  // Add the headers to the CSV content
  csvContent += headers.join(",") + "\n";

  // Add each inventory item's details as rows in the CSV
  showInventory.forEach((inventory) => {
    const attributes = inventory.attributes?.map((attr) => attr.key).join(", ") || "N/A";
    const variations = inventory.variations
      ?.map((variation) => `${variation.variantName} (Qty: ${variation.quantity}, Price: $${variation.price})`)
      .join(", ") || "N/A";
    const row = [
      inventory.productID,
      inventory.productName,
      inventory.productCategory,
      inventory.productDescription,
      attributes,
      variations,
      inventory.productStatus,
    ];
    csvContent += row.join(",") + "\n"; // Join each row with commas and add to content
  });

  // Convert the CSV content into a Blob and download it
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Inventory_Report_${shopName}.csv`;
  link.click();
};


  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 dark:text-white">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center dark:text-white">
        Inventory List
      </h1>
      <div className="flex gap-2 item-center">
        <Button onClick={generatePDFReport}>Generate PDF Report</Button>
        <Button onClick={generateExcelReportWithStyles}>
          Generate Excel Report
        </Button>
        <Button onClick={generateCSVReport}>Generate CSV Report</Button>
      </div>

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
                      ? inventory.attributes.map((attr) => (
                          <div
                            key={attr.key}
                            className="flex items-center mb-1"
                          >
                            {" "}
                            {/* Flex for alignment */}
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: attr.key, // Use the color code as the background color
                                borderRadius: "3px",
                                marginRight: "5px", // Space between color box and text
                              }}
                            ></div>
                            <strong>{attr.key}</strong>
                          </div>
                        ))
                      : "No attributes"}
                  </Table.Cell>

                  <Table.Cell>
                    {inventory.variations && inventory.variations.length > 0
                      ? inventory.variations.map((variation, index) => (
                          <div key={index}>
                            <strong>{variation.variantName}</strong>
                            <br />
                            Quantity: {variation.quantity}
                            <br />
                            Price: ${variation.price}
                            <br />
                          </div>
                        ))
                      : "No variations"}
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
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              marginRight: "5px",
                            }}
                          />
                        </a>
                      ))
                    ) : (
                      <span>No Images</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      {" "}
                      {/* Use flexbox to align buttons horizontally */}
                      <Button
                        onClick={() => handleInventoryDelete(inventory._id)}
                        color="failure"
                      >
                        Delete
                      </Button>
                      <Link
                        to={`/inventory-update/${inventory._id}?shopID=${shopID}`}
                      >
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