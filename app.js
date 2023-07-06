import dotenv from 'dotenv';
import morgan from "morgan";
import express from "express";
import cors from "cors";
import pg from "pg";
import foodRoutes from "./routes/foodRoutes.js";



const app = express();

// Middleware
dotenv.config();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));



const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Listneing on port ${port}`);
});



app.use("/food", foodRoutes);
