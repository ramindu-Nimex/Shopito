import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({

    productID: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    productStatus: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;