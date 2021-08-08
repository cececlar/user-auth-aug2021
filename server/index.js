if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const cors = require("cors");
const path = require("path");
const app = express();
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
let knex = require("./knexfile");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
