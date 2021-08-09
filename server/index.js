if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/users");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
