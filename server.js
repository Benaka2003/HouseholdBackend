const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 8000;

const connectDB = require("./config/db");

connectDB();
      
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Household Inventory API");
});

const authMiddleware = require("./middleware/authMiddleware");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // for profile


app.use("/api/auth", authRoutes);


app.use("/api/users", authMiddleware, userRoutes);


const householdRoutes = require("./routes/householdRoutes");

app.use("/api/households", householdRoutes);


const itemRoutes = require("./routes/itemRoutes");

app.use("/api/items", itemRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/dashboard", dashboardRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Error:", err.message);
  });