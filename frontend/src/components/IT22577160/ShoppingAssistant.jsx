import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Select,
} from "flowbite-react";
import FooterComponent from "../FooterComponent";

const ShoppingAssistant = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [budget, setBudget] = useState("");
  const [discount, setDiscount] = useState("");
  const [products, setProducts] = useState([]);
  const [preferredProduct, setPreferredProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Footwear",
    "Accessories",
    "Clothing",
    "Electronics",
    // Add more categories as needed
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProducts([]); // Clear previous results

    try {
      const res = await fetch(
        `http://localhost:5173/api/chat/getAssist?productCategory=${productCategory}&productName=${productName}&budget=${budget}&Discount_Applied=${discount}&userId=${currentUser._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      const data = await res.json();

      const { matchingProducts, preferredProducts } = data;

      if (res.ok) {
        setProducts(matchingProducts);
        setPreferredProduct(preferredProducts);
        toast.success("Products fetched successfully! 🎉");
      } else {
        toast.error(data.message || "Failed to fetch products. ⚠️");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-3xl w-full mx-auto bg-slate-200 dark:bg-slate-800 border-2 dark:border-teal-600 rounded-md shadow-lg p-8 my-6">
          <h2 className="text-3xl font-bold text-center flex items-center gap-7">
            <img src="/bot.png" alt="" className="botForm w-20 h-20 ml-5" />{" "}
            <span className="style">Fav Finder - Your Shopping Assistant!</span>
          </h2>
          <p className="text-center text-xs font-medium mb-8 text-slate-500">
            Let’s find the perfect product for you!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
            <Label value="1. Choose a Category :" />
            <Select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            <Label value="2. What are you looking for ?" />
            <TextInput
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <Label value="3. What’s your budget ?" />
            <TextInput
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <Label value="4. Do You want Discount ?" />
            <Select
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            >
              <option value="Uncategorized">Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              className="uppercase"
            >
              🔍 Show Me Products!
            </Button>
          </form>
          {loading && (
            <p className="text-center text-gray-600">
              Loading your options... ⏳
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.length > 0
              ? products.map((product) => (
                  <div
                    key={product.productID}
                    className="rounded-lg p-4 bg-slate-300 dark:bg-slate-800  border-2 dark:border-teal-600  shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-teal-600">
                      {product.productName} 🛒
                    </h3>
                    <p>{product.productDescription}</p>
                    <p className="mt-2 font-bold text-teal-600">
                      Shop: {product.shopName} 🏪
                    </p>
                    <p>Location: {product.shopLocation} 📍</p>
                    <p className="text-green-600 font-bold">
                      Price: ${product.price} 💲
                    </p>
                    <p>Open: {product.isOpen ? "yes ✅" : "Closed ❌"}</p>
                    <p>Opening Hours: {product.shopOpeningHours} ⏰</p>
                    <Button className="mt-2" gradientDuoTone="purpleToBlue">
                      🔗 Buy Now
                    </Button>
                    <div className="mt-8 bg-amber-100 dark:bg-slate-700 border-2 dark:border-teal-600  shadow-lg rounded-lg p-4">
                      <h2 className="text-center font-bold text-teal-600 text-2xl mb-5">
                        You may also like
                      </h2>
                      {preferredProduct.map((product) => (
                        <div
                          key={product.productID}
                          className="rounded-lg p-4 border-2 dark:border-teal-600  shadow-lg my-4"
                        >
                          <h3 className="text-lg font-semibold text-teal-600">
                            {product.productName} 🛒
                          </h3>
                          <p>{product.productDescription}</p>
                          <p className="mt-2 font-bold text-teal-600">
                            Shop: {product.shopName} 🏪
                          </p>
                          <p>Location: {product.shopLocation} 📍</p>
                          <p className="text-green-600 font-bold">
                            Price: ${product.price} 💲
                          </p>
                          <p>Open: {product.isOpen ? "yes ✅" : "Closed ❌"}</p>
                          <p>Opening Hours: {product.shopOpeningHours} ⏰</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              : !loading && ""}
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default ShoppingAssistant;
