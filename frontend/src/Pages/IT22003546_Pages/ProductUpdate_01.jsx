import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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

const ProductForm = () => {
    const { productId } = useParams(); // Get productId from URL params
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        shopID: '',
        productID: '',
        productName: '',
        productCategory: '',
        productDescription: '',
        attributes: [],
        variations: [],
        productStatus: 'Available',
        imageURLs: [],
    });
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && currentUser.username) {
            setFormData((prev) => ({
                ...prev,
                shopID: currentUser.username,
            }));
        }
        
        if (productId) {
            // Fetch existing product data
            const fetchProduct = async () => {
                try {
                    const response = await fetch(`/api/inventory/${productId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setFormData(data); // Populate form with fetched data
                    } else {
                        setError("Failed to fetch product details");
                    }
                } catch (err) {
                    setError("Something went wrong while fetching the product");
                }
            };
            fetchProduct();
        }
    }, [currentUser, productId]);

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

            const response = await fetch(`/api/inventory/update/${productId}`, {
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
            navigate('/dashboard?tab=inventory');
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
                setFormData((prev) => ({
                    ...prev,
                    imageURLs: prev.imageURLs.concat(urls)
                }));
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
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="min-h-screen mt-20">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Update Product</h1>
            <div className="flex p-3 w-[40%] mx-auto flex-col md:flex-row md:items-center gap-20 md:gap-20 mt-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full justify-center">
                    {/* Other input fields like shopID, productID, etc. */}
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
                    {/* Add other fields like productCategory, productDescription, etc. */}

                    {/* Variations Section */}
                    <div>
                        <h3 className="text-lg font-medium">Variations</h3>
                        {formData.variations && formData.variations.length > 0 ? (
                            formData.variations.map((variation, index) => (
                                <div key={index} className="space-y-2 mb-2">
                                    {/* Variations input fields */}
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
                                    {/* Quantity, Price and images upload buttons */}
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

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="uppercase"
                    >{loading ? "Updating Product..." : "Update Product"}</Button>
                    {error && <Alert className='mt-7 py-3 bg-gradient-to-r from-red-100 via-red-300 to-red-400 shadow-shadowOne text-center text-red-600 text-base tracking-wide animate-bounce'>{error}</Alert>}
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
