import React, { useEffect, useState } from 'react';

export default function ReservePage() {
  const [reservedItems, setReservedItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservedItems = async () => {
      try {
        const res = await fetch(`/api/order/allReserved`);
        const data = await res.json();

        if (res.ok) {
          // Update item statuses based on their reservation time
          const updatedItems = data.items.map((item) => {
            const now = new Date();
            const reservationTime = new Date(item.updatedAt);
            const diffInSeconds = (now - reservationTime) / 1000;

            // Set status based on whether the reservation has expired
            item.isExpired = diffInSeconds > 60; // true if expired
            return item;
          });
          setReservedItems(updatedItems);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to load reserved items');
      }
    };

    // Fetch reserved items initially
    fetchReservedItems();

    // Poll every 2 seconds to check for updated statuses
    const interval = setInterval(() => {
      fetchReservedItems();
    }, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Reserved Items List</h1>
      {reservedItems.length > 0 ? (
        <table className="table-auto w-full bg-white border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-6 py-4 text-left">Image</th>
              <th className="border px-6 py-4 text-left">Name</th>
              <th className="border px-6 py-4 text-left">Category</th>
              <th className="border px-6 py-4 text-left">Price</th>
              <th className="border px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservedItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="border px-6 py-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-20 h-20 object-cover rounded-lg shadow-md" 
                  />
                </td>
                <td className="border px-6 py-4">{item.title}</td>
                <td className="border px-6 py-4">{item.category}</td>
                <td className="border px-6 py-4">
                  {item.offer ? (
                    <span className="text-green-500 font-bold">${item.discountPrice}</span>
                  ) : (
                    <span>${item.regularPrice}</span>
                  )}
                </td>
                <td className="border px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      item.isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {item.isExpired ? 'Expired' : 'Reserved'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-lg">Loading reserved items...</p>
      )}
    </div>
  );
}
