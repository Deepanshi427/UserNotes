const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const  connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/noteRoutes"));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);