import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import users from "./routes/userRoute.js";
// env
dotenv.config();
const app = express();

// CORS POLICY
// app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

// connect db
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL);
// PORT
const port = process.env.PORT || 3000;

// JSON DATA
app.use(express.json());
// URLEXTENDED
app.use(express.urlencoded({ extended: true }));
// LOAD routes
app.use("/api/v1/user", users);

app.listen(port, () => {
  console.log(`port running at http://localhost:${port}`);
});
