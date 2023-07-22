import dotenv from 'dotenv';
import morgan from "morgan";
import express from "express";
import cors from "cors";
import helmet from 'helmet'
import foodRoutes from "./routes/foodRoutes.js";



const app = express();

// Middleware
dotenv.config();
app.use(helmet())
app.use(morgan("dev"));
// cors options
const whiteList = [`${process.env.PRODUCTION_URL}`,`${process.env.LOCALHOST_URL}`]

var corsOptions = {
    origin: function (origin, callback) {
      if (whiteList .indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));



const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Listneing on port ${port}`);
});



app.use("/food", foodRoutes);
