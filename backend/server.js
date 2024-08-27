import express from "express";
import dotenv from "dotenv";
import dbConnection from "./dbConfig/dbConnection.js";
import userRoutes from "./routes/user.route.js";

const app = express();
dotenv.config();

dbConnection();


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

app.use('/api/user', userRoutes);