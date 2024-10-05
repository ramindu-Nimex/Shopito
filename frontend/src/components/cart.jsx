// src/components/Cart.jsx

import React, { useRef, useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from "react-router-dom";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(true); // State to control cart visibility
    const cartRef = useRef(); // Ref to track cart div

    const handleOutsideClick = (event) => {
        // Check if the click is outside the cart and not on the add to cart button
        if (cartRef.current && !cartRef.current.contains(event.target)) {
            setIsOpen(false); // Close the cart
        }
    };

    useEffect(() => {
        // Add event listener to handle outside clicks
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    

    return (
        <div className={`fixed top-16 right-0 bg-white shadow-lg p-4 rounded-lg max-w-xs w-full z-50 overflow-y-auto max-h-[80vh] ${isOpen ? '' : 'hidden'}`} ref={cartRef}>
            <h1 className="text-xl font-bold mb-4">Shopping Cart</h1>
            {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                cart.map(item => (
                    <div key={item.productID + item.selectedAttribute + item.variation} className="flex justify-between items-center border-b border-gray-200 py-2">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold">{item.productName}</h2>
                            <p className="text-gray-600">Price: LKR {(item.price * item.quantity).toLocaleString()}</p> {/* Display the total price */}
                            <p className="text-gray-600">Varient: {item.variation}</p> {/* Show the size */}
                            <p className="text-gray-600 flex items-center">
                                Color: 
                                <span 
                                    className="inline-block w-3 h-3 rounded-full ml-2" 
                                    style={{ backgroundColor: item.selectedAttribute }} // Set the background color
                                ></span>
                            </p>
                            <p className="text-gray-600">Quantity: {item.quantity}</p> {/* Show the quantity */}
                        </div>
                        <button
                            onClick={() => removeFromCart(item.productID, item.selectedAttribute, item.variation)} // Pass both productID and selectedAttribute
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))
            )}
            {cart.length > 0 && (
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={clearCart}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                        Clear Cart
                    </button>
                    <Link to="/checkout">
                        <button className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600">
                            Checkout
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
