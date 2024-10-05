import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Table, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import jsPDF from "jspdf"; 
import Papa from "papaparse"; // Import PapaParse


export default function DashOrder() {
  const { currentUser } = useSelector((state) => state.user);
  const [sharedResources, setSharedResources] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resourceIdToDelete, setResourceIdToDelete] = useState("");

  useEffect(() => {
    const fetchSharedResources = async () => {
      try {
        const res = await fetch(
          `/api/order/orderListings?userId=${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setSharedResources(data.listings);
          if (data.listings.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Error in response:", data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSharedResources();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = sharedResources.length;
    try {
      const res = await fetch(
        `/api/order/orderListings?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setSharedResources((prev) => [...prev, ...data.listings]);
        if (data.listings.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteResources = async () => {
    try {
      const res = await fetch(
        `/api/order/deleteOrder/${resourceIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setSharedResources((prev) =>
          prev.filter((resource) => resource._id !== resourceIdToDelete)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to download report as PDF
const handleDownloadReport = () => {
  const doc = new jsPDF();
  const tableColumn = ["Date Updated", "Order Title", "Shop", "Category", "Quantity", "Price"];
  const tableRows = sharedResources.map((resource) => [
    new Date(resource.updatedAt).toLocaleDateString(),
    resource.title,
    resource.shop,
    resource.category,
    resource.quantity,
    (resource.regularPrice - resource.discountPrice).toFixed(2), // Format price
  ]);

  // Set the styling for the PDF
  doc.setFontSize(12);
  doc.text("Order Report", 14, 22);
  
  // Add the autoTable with styles
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    styles: {
      fillColor: [255, 239, 219], 
      textColor: [0, 0, 0], 
      fontSize: 10,
    },
    headStyles: {
      fillColor: [22, 160, 133], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
    },
    margin: { top: 30 },
    theme: 'grid' 
  });

  // Save the PDF
  doc.save("order_report.pdf");
};




// Function to download report as CSV
const handleDownloadCSV = () => {
  const csvData = sharedResources.map((resource) => ({
    "Date Updated": new Date(resource.updatedAt).toLocaleDateString(),
    "Order Title": resource.title,
    "Shop": resource.shop,
    "Category": resource.category,
    "Quantity": resource.quantity,
    "Price": (resource.regularPrice - resource.discountPrice).toFixed(2), // Format price
  }));

  // Convert to CSV
  const csv = Papa.unparse(csvData);

  // Create a Blob and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "order_report.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isShoppingOrderAdmin && sharedResources?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Order Image</Table.HeadCell>
              <Table.HeadCell>Order Title</Table.HeadCell>
              <Table.HeadCell>Shop</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
             
              </Table.HeadCell>
            </Table.Head>
            {sharedResources.map((resources) => (
              <>
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(resources.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {/* <Link to={`/sharedResource/${resources.slug}`}> */}
                      <img
                        src={resources.image}
                        alt={resources.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                      {/* </Link> */}
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/sharedResource/${resources.slug}`}
                      >
                        {resources.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{resources.shop}</Table.Cell>
                    <Table.Cell>{resources.category}</Table.Cell>
                    <Table.Cell>{resources.quantity}</Table.Cell>
                    <Table.Cell>
                      {resources.regularPrice - resources.discountPrice}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setResourceIdToDelete(resources._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        to={`/update-order/${resources._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>

          <br></br>

          <Button
              onClick={handleDownloadReport} className="bg-gradient-to-r from-purple-500 to-rose-500 text-white mb-4 ml-2">
                  Download Report
                </Button>
                <Button
    className="bg-gradient-to-r from-purple-500 to-rose-500 text-white mb-4 ml-2"
    onClick={handleDownloadCSV}
  >
    Download CSV
  </Button>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <h2>You have not created any shared resources yet</h2>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteResources}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
          
        </Modal.Body>
      </Modal>
    </div>

    
  );
}
