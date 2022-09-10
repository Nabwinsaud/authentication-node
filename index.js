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
// app.use();
app.use(cors({ origin: "*" }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// connect db
// const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL =
  "mongodb+srv://nabwin:fZssV0N0DA0EyNvC@cluster0.jaimm2a.mongodb.net/?retryWrites=true&w=majority";
connectDB(DATABASE_URL);
// PORT
const port = process.env.PORT || 3000;

// JSON DATA
app.use(express.json());
// URLEXTENDED
// app.use(express.urlencoded({ extended: true }));
// LOAD routes
app.use("/api/v1/user", users);

app.listen(port, () => {
  console.log(`port running at http://localhost:${port}`);
});
