import React from 'react';
import contactUs from "/contactUs.jpeg";

const ContactUs = () => {
  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${contactUs})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative bg-white bg-opacity-70 py-10 rounded-lg shadow-2xl max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-black-600 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          We would love to hear from you! Here’s how you can reach us:
        </p>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600">You can contact us at:</p>
          <p className="text-gray-800 mb-2">Email: <span className="font-semibold">support@shopito.com</span></p>
          <p className="text-gray-800 mb-2">Phone: <span className="font-semibold">+94 71 234 5678</span></p>
          <p className="text-gray-800 mb-2">Address: <span className="font-semibold">456 Shopping Street, Colombo, Sri Lanka</span></p>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Follow Us</h2>
          <p className="text-gray-600">Stay connected through our social media channels:</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-blue-600 hover:underline">Facebook</a>
            <a href="#" className="text-blue-600 hover:underline">Twitter</a>
            <a href="#" className="text-blue-600 hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
