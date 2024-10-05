import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, FileInput, Label, TextInput, Textarea, Alert } from "flowbite-react";
import { app } from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const generateServiceId = () =>
  `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
const ShopCreate = () => {
  const { shopId } = useParams(); // Get the shop ID from the URL
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    ownerID: currentUser.username,
    shopID: generateServiceId(),
    shopName: "",
    shopLocation: "",
    shopDescription: "",
    shopCategory: "",
    shopPhone: "",
    shopEmail: "",
    shopWebsite: "",
    shopOpeningHours: "",
    isOpen: true,
    imageURLs: [],
  });
  const {
    shopID,
    shopName,
    shopLocation,
    shopDescription,
    shopCategory,
    shopPhone,
    shopEmail,
    shopWebsite,
    shopOpeningHours,
    isOpen,
    imageURLs,
  } = formData;

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch existing shop details if we are editing
  useEffect(() => {
    if (shopId) {
      const fetchShopDetails = async () => {
        try {
          const res = await fetch(`/api/shopListings/read/${shopId}`);
          const data = await res.json();
          if (res.ok) {
            setFormData(data);
          } else {
            setError("Failed to fetch shop details");
          }
        } catch (err) {
          setError("Failed to fetch shop details");
        }
      };

      fetchShopDetails();
    }
  }, [shopId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let processedValue = value;
    if (type === "checkbox") {
      processedValue = checked;
    }
  
    // Real-time validations
    if (name === "shopPhone") {
      // Only allow numeric input
      if (!/^\d*$/.test(value)) return; // Prevent non-numeric characters
    }
  
    if (name === "shopName" || name === "shopDescription") {
      // Limit the length of certain text fields
      const maxLength = name === "shopName" ? 50 : 200;
      if (value.length > maxLength) return; // Prevent typing beyond limit
    }
  
    if (name === "shopEmail") {
      // Email validation (basic pattern)
      if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
        setError("Invalid email format");
      } else {
        setError(null);
      }
    }
  
    if (name === "shopWebsite") {
      // Website URL validation
      if (value && !/^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/.test(value)) {
        setError("Invalid website URL");
      } else {
        setError(null);
      }
    }
  
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.imageURLs.length < 1)
        return setError("You must upload at least one image");

      console.log("Submitting image URLs:", formData.imageURLs);

      const method = shopId ? "PUT" : "POST"; // PUT for edit, POST for new
      const url = shopId
        ? `/api/shopListings/update/${shopId}`
        : `/api/shopListings/create`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/dashboard?tab=shop-list"); // Redirect after success
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to update shop details");
    } finally {
      setLoading(false);
    }
  };
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          console.log('Uploaded image URLs:', urls);  // Log URLs to check if they are correct
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (2mb max per Image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 Images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('Download URL:', downloadURL);  // Log URL to verify if it is correct
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto mb-10">
      <h1 className="text-2xl text-center font-semibold mb-5">
        {shopId ? "Update a Shop Listing" : "Create a Shop Listing"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div>
            <Label htmlFor="ownerID">Owner ID</Label>
            <TextInput
              type="text"
              name="ownerID"
              value={formData.ownerID}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="shopID">Shop ID</Label>
            <TextInput
              type="text"
              name="shopID"
              value={formData.shopID}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="shopName">Shop Name:</Label>
            <TextInput
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="shopLocation">Shop Location</Label>
            <TextInput
              type="text"
              name="shopLocation"
              value={formData.shopLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="shopDescription">Shop Description:</Label>
            <Textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="shopCategory">Shop Category:</Label>
            <select
              id="shopCategory" // Add an id to the select element to match htmlFor in Label
              name="shopCategory"
              value={formData.shopCategory}
              onChange={handleChange} // Ensure the handleChange is properly managing the state
              required
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="" disabled>Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Groceries">Groceries</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Books">Books</option>
              <option value="Food&Beverages">Food & Beverages</option>
              <option value="Beauty&Health">Beauty & Health</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Sports&Fitness">Sports & Fitness</option>
              <option value="Automotive">Automotive</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="shopPhone">Shop Phone:</Label>
            <TextInput
              type="text"
              name="shopPhone"
              value={formData.shopPhone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="shopEmail">Shop Email:</Label>
            <TextInput
              type="email"
              name="shopEmail"
              value={formData.shopEmail}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="shopWebsite">Shop Website:</Label>
            <TextInput
              type="url"
              name="shopWebsite"
              value={formData.shopWebsite}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="shopOpeningHours">Shop Opening Hours:</Label>
            <TextInput
              type="text"
              name="shopOpeningHours"
              value={formData.shopOpeningHours}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="isOpen">Is Open:</Label>
            <input
              type="checkbox"
              name="isOpen"
              checked={formData.isOpen}
              onChange={handleChange}
            />
          </div>

          <div>
            <p className="font-semibold">
              Images:{" "}
              <span className="font-normal text-gray-600 ml-2">
                6 Photos Max
              </span>
            </p>
            <div className="flex gap-4">
              <FileInput
                onChange={(e) => setFiles(Array.from(e.target.files))}
                type="file"
                id="image"
                accept="image/*"
                multiple
                className="w-full"
              />
              <button
                onClick={handleImageSubmit}
                type="button"
                disabled={uploading}
                className="p-1 text-red-700 border border-red-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={`image-${index}`}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt={`listing image ${index}`}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <Button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  gradientDuoTone="pinkToOrange"
                >
                  Delete
                </Button>
              </div>
            ))}
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="uppercase"
          >
            { shopId ? "Update a Shop Listing" : "Create a Shop Listing"}
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