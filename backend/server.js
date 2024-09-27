import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

//
import inventoryRoutes from "./routes/IT22003546_Routes/inventory.route.js";




//
import shopListingRoutes from "./routes/IT22350114_Routes/shopListingRoute_02.js";


//




//IT22607232 Routes
import ShopitoMartRoutes from "./routes/IT22607232_Routes/ShopitoMart.route.js";
import checkoutRoutes from "./routes/IT22607232_Routes/checkout.route.js";






const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

dbConnection();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// IT22003546 Routes
app.use("/api/inventory", inventoryRoutes);




// IT22350114 Routes
app.use('/api/shopListings', shopListingRoutes);



//IT22577160 Routes






//IT22607232 Routes
app.use("/api/order", ShopitoMartRoutes);
app.use("/api/checkout", checkoutRoutes);








app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
