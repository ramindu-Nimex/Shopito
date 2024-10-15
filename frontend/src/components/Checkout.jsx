import React from 'react';
import { useCart } from '../context/CartContext';
import { Button, TextInput, Label } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart, decrementQuantity } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        // Add your checkout logic here, such as API calls to process payment
        alert("Checkout successful!");
        cart.forEach(item => {
            decrementQuantity(item.id, item.selectedAttribute, item.variation);
        });
        clearCart(); // Clear the cart after checkout
        navigate('/shops'); // Redirect to the home page or another appropriate page
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    {cart.map(item => (
                        <div key={item.productID + item.selectedAttribute} className="flex justify-between mb-2 items-center">
                        <span className="flex-1 text-left">{item.productName}</span>
                        <span className="flex-1 text-center">LKR {item.price.toLocaleString()}</span>
                        <span className="flex-none text-right">x{item.quantity}</span>
                        
                    </div>
                    ))}
                    <div className="border-t border-gray-300 mt-4 pt-4">
                        <h2 className="text-lg font-semibold">Total:</h2>
                        <span className="text-xl font-bold">
                            LKR {cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                        </span>
                    </div>
                </div>
            )}
            <h2 className="text-xl font-semibold mt-6 mb-4">Billing Information</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
                <div className="mb-4">
                    <Label htmlFor="name" value="Full Name" />
                    <TextInput id="name" placeholder="John Doe" required />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" placeholder="example@mail.com" required />
                </div>
                <div className="mb-4">
                    <Label htmlFor="address" value="Shipping Address" />
                    <TextInput id="address" placeholder="123 Main St, City, State" required />
                </div>
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                    Complete Checkout
                </Button>
            </form>
        </div>
    );
};

export default Checkout;
