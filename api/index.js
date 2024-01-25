const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

dotenv.config();

mongoose.connect(process.env.DB_CONNECT);

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
