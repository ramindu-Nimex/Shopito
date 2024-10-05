import React from "react";
import aboutUS from "/shopping_mall.jpg";

const AboutUs = () => {
  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${aboutUS})` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative bg-white bg-opacity-90 py-10 rounded-lg shadow-2xl max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-white mb-6 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          About Us
        </h1>{" "}
        <p className="text-lg text-gray-700 text-center mb-8">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">MallName</span>, your
          one-stop destination for shopping, dining, and entertainment. We are
          dedicated to providing our customers with the best shopping experience
          possible, with a wide range of stores and services to cater to all
          your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-300 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-800">
              At MallName, our mission is to create a vibrant shopping
              environment that inspires and delights our customers. We strive to
              bring together a diverse range of brands and experiences, ensuring
              that there is something for everyone.
            </p>
          </div>

          <div className="bg-gray-300 p-6 rounded-lg shadow-xl transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-800">
              Our vision is to be the premier shopping destination in the
              region, recognized for our exceptional customer service, diverse
              retail offerings, and commitment to sustainability. We aim to
              create a space where the community can come together and enjoy a
              unique shopping experience.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Us</h2>
          <p className="text-gray-800 mb-4">
            We invite you to explore our mall, discover new brands, and enjoy
            our various events and activities. Whether you're looking for the
            latest fashion trends, a delicious meal, or a fun day out with
            family and friends, MallName has it all!
          </p>
          <p className="text-gray-800">
            Thank you for being a part of our community. We look forward to
            serving you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
