import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Textarea, Alert } from "flowbite-react";

const ShopCreate = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    category: "",
  });

  const { name, location, description, category } = formData;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !location || !description || !category) {
        return setError("Please fill in all fields.");
      }

      setLoading(true);
      setError(false);

      const res = await fetch("/api/shopListings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate("/dashboard?tab=shop-list");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto mb-10">
      <h1 className="text-2xl text-center font-semibold mb-5">
        Create a Shop Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="name">Shop Name</Label>
            <TextInput
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              id="name"
              autocomplete="on" // Added autocomplete attribute
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <TextInput
              type="text"
              name="location"
              value={location}
              onChange={handleChange}
              id="location"
              autocomplete="on" // Added autocomplete attribute
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={description}
              onChange={handleChange}
              id="description"
              autocomplete="on" // Added autocomplete attribute
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <TextInput
              type="text"
              name="category"
              value={category}
              onChange={handleChange}
              id="category"
              autocomplete="on" // Added autocomplete attribute
              required
            />
          </div>
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="uppercase"
          >
            {loading ? "Creating Shop..." : "Create Shop"}
          </Button>
          {error && (
            <Alert className="mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce">
              {error}
            </Alert>
          )}
        </div>
      </form>
    </main>
  );
};

export default ShopCreate;






