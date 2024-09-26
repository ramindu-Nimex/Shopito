import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    shopID: 
    { 
        type: String, 
        required: true },
    
    productID: 
    { 
        type: String, 
        required: true },
    
    productName: 
    { 
        type: String, 
        required: false },
    
    productCategory: 
    { 
        type: String, 
        required: false },
    
    productDescription: 
    { 
        type: String },
    
    attributes: [
        {
            key: { type: String, required: false },
            value: { type: String, required: false }
        }
    ],
    
    variations: [
        {
            variantName: { type: String, required: false },
            quantity: { type: Number, required: false },
            price: { type: Number, required: false },
            images: [{ type: String }]
        }
    ],

    imageURLs:
    {
        type: Array,
    },
    
    date: 
    { 
        type: Date, 
        default: Date.now },
    
    productStatus: 
    { 
        type: String, 
        default: "Available" }
});


const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;