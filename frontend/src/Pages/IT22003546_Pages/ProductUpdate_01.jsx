import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { app } from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {
    Button,
    Label,
    TextInput,
    Textarea,
    FileInput,
    Alert,
} from "flowbite-react";

const ProductUpdate = () => {
    const location = useLocation(); // Access location to get query parameters
    const queryParams = new URLSearchParams(location.search);
    const shopID = queryParams.get("shopID"); // Get the shopID from the query parameters
    const { Inventoryid } = useParams(); // Assuming you are using react-router to get the product ID from the URL
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        shopID: shopID || '',
        productID: '',
        productName: '',
        productCategory: '',
        productDescription: '',
        productStatus: 'Available',
        imageURLs: [],
    });

    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log("Product ID:", Inventoryid);

    // Fetch existing product data when component mounts
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`/api/inventory/fetch/${Inventoryid}`);
                const data = await response.json();
                setFormData({ attributes: data.attributes }); // Assuming data.attributes contains your attribute data
                console.log("Fetched product data from DB:", data);

                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                
                setFormData((prevData) => ({
                    ...prevData,
                            shopID: shopID || '',
                            productID: data.productID,
                            productName: data.productName,
                            productCategory: data.productCategory,
                            productDescription: data.productDescription,
                            productStatus: data.productStatus,
                            imageURLs: data.imageURLs || [],
                            variations: data.variations || [],
                
                }));

            } catch (err) {
                setError("Failed to fetch product data");
            }
        };

        fetchProductData();
    }, [Inventoryid, currentUser.username]);

    const handleAddAttribute = () => {
        setFormData((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: "", value: "" }]
        }));
    };

    const handleRemoveAttribute = (index) => {
        setFormData((prev) => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }));
    };
    const handleAddVariation = () => {
        setFormData((prev) => ({
            ...prev,
            variations: [...prev.variations, { variantName: "", quantity: "", price: "", images: [] }]
        }));
    };

    const handleRemoveVariation = (index) => {
        setFormData((prev) => ({
            ...prev,
            variations: prev.variations.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageURLs.length < 1) return setError('You must upload at least one image');
            setLoading(true);
            setError(false);

            const payload = {
                ...formData,
                userRef: currentUser._id,
            };

            console.log("Submitting the following data to the backend:", payload);

            const response = await fetch(`/api/inventory/update/${Inventoryid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            setLoading(false);
            if (data.success === false) {
                return setError(data.message);
            }
            navigate(`/inventory-shop/${shopID}`);
        } catch (err) {
            setError(err.message);
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

            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData,
                    imageURLs: formData.imageURLs.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image Upload failed (2mb max per Image)');
                setUploading(false);
            });
        } else {
            setImageUploadError('You can only upload 6 Images per listing');
            setUploading(false);
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((_, i) => i !== index),
        });
    }

    return (
        <div className="min-h-screen mt-20">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Update Product</h1>
            <div className="flex p-3 w-[40%] mx-auto flex-col mt-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full justify-center">
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
                        <Label htmlFor="productID">Product ID</Label>
                        <TextInput
                            type="text"
                            name="productID"
                            value={formData.productID}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <TextInput
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="productCategory" className="block mb-2 text-sm font-medium text-gray-700">Product Category</Label>
                        <select
                            name="productCategory"
                            value={formData.productCategory}
                            onChange={handleChange}
                            required
                            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="" disabled>Select a category</option> {/* Default option */}
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Sports">Sports</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Toys">Toys</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="productDescription">Product Description</Label>
                        <TextInput
                            type="text"
                            name="productDescription"
                            value={formData.productDescription}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Attributes Section */}
                    <div>
                        <h3 className="text-lg font-medium">Color / Size</h3>
                        {formData.attributes && formData.attributes.length > 0 ? (
                            formData.attributes.map((attribute, index) => (
                                <div key={index} className="flex space-x-2 mb-2">
                                    <TextInput
                                        type="text"
                                        placeholder="Key"
                                        value={attribute.key || ""}
                                        onChange={(e) => {
                                            const newAttributes = [...formData.attributes];
                                            newAttributes[index] = {
                                                ...newAttributes[index],
                                                key: e.target.value
                                            };
                                            setFormData(prev => ({ ...prev, attributes: newAttributes }));
                                        }}
                                        className="p-2 border rounded w-1/2"
                                    />
                                    <TextInput
                                        type="text"
                                        placeholder="Value"
                                        value={attribute.value || ""}
                                        onChange={(e) => {
                                            const newAttributes = [...formData.attributes];
                                            newAttributes[index] = {
                                                ...newAttributes[index],
                                                value: e.target.value
                                            };
                                            setFormData(prev => ({ ...prev, attributes: newAttributes }));
                                        }}
                                        className="p-2 border rounded w-1/2"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleRemoveAttribute(index)}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>No attributes added yet.</p>
                        )}
                        <Button
                            type="button"
                            onClick={handleAddAttribute}
                            className="p-2 bg-blue-500 text-white rounded"
                        >
                            Add Attribute
                        </Button>
                    </div>
                    {/* Variations Section */}
                    <div>
                        <h3 className="text-lg font-medium">Variations</h3>
                        {formData.variations && formData.variations.length > 0 ? (
                            formData.variations.map((variation, index) => (
                                <div key={index} className="space-y-2 mb-2">
                                    <TextInput
                                        type="text"
                                        placeholder="Variant Name"
                                        value={variation.variantName || ""}
                                        onChange={(e) => {
                                            const newVariations = [...formData.variations];
                                            newVariations[index] = {
                                                ...newVariations[index],
                                                variantName: e.target.value
                                            };
                                            setFormData(prev => ({ ...prev, variations: newVariations }));
                                        }}
                                        className="p-2 border rounded w-full"
                                    />
                                    <TextInput
                                        type="number"
                                        placeholder="Quantity"
                                        value={variation.quantity || ""}
                                        onChange={(e) => {
                                            const newVariations = [...formData.variations];
                                            newVariations[index] = {
                                                ...newVariations[index],
                                                quantity: e.target.value
                                            };
                                            setFormData(prev => ({ ...prev, variations: newVariations }));
                                        }}
                                        className="p-2 border rounded w-full"
                                    />
                                    <TextInput
                                        type="number"
                                        placeholder="Price"
                                        value={variation.price || ""}
                                        onChange={(e) => {
                                            const newVariations = [...formData.variations];
                                            newVariations[index] = {
                                                ...newVariations[index],
                                                price: e.target.value
                                            };
                                            setFormData(prev => ({ ...prev, variations: newVariations }));
                                        }}
                                        className="p-2 border rounded w-full"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => handleRemoveVariation(index)}
                                        className="p-2 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>No variations added yet.</p> 
                        )}
                        <Button
                            type="button"
                            onClick={handleAddVariation}
                            className="p-2 bg-blue-500 text-white rounded"
                        >
                            Add Variation
                        </Button>
                    </div>

                    <div>
                        <Label htmlFor="productStatus">Product Status</Label>
                        <select
                            id="productStatus"
                            name="productStatus"
                            value={formData.productStatus}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border rounded"
                        >
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="font-semibold">Images: <span className="font-normal text-gray-600 ml-2">6 Photos Max</span></p>
                        <div className="flex gap-4">
                            <FileInput onChange={(e) => setFiles(e.target.files)} type='file' id="image" accept="image/*" multiple className="w-full" />
                            <button onClick={handleImageSubmit} type="button" disabled={uploading} className="p-1 text-red-700 border border-red-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                        <p className="text-red-700">{imageUploadError && imageUploadError}</p>
                        {formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
                            <div key={`image-${index}`} className="flex justify-between p-3 border items-center">
                                <img src={url} alt={`listing image ${index}`} className='w-20 h-20 object-contain rounded-lg' />
                                <Button type="button" onClick={() => handleRemoveImage(index)} gradientDuoTone="pinkToOrange">Delete</Button>
                            </div>
                        ))}
                        <Button type="submit" className="uppercase">
                            {loading ? "Updating Product..." : "Update Product"}
                        </Button>
                        {error && <Alert className='mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce'>{error}</Alert>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductUpdate;
