import express from "express";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();
app.use(express.json());

dbConnection();


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);