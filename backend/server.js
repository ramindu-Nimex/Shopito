import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

//
import inventoryRoutes from "./routes/IT22003546_Routes/inventory.route.js";




//




//




//IT22607232 Routes
import ShopitoMartRoutes from "./routes/IT22607232_Routes/ShopitoMart.route.js";






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





//IT22577160 Routes






//IT22607232 Routes
app.use("/api/ShopitoMart", ShopitoMartRoutes);








app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
