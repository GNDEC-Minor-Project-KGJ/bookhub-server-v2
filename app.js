if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./utils/cors");
const morgan = require("morgan");

// DB Connection
const dbConnection = require("./utils/db-connection");

// Routes
const routes = require("./routes");

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use("/api", routes);

// Genric routes handler
app.get("*", (req, res) => {
  console.log("Invalid URL");
  return res.status(404).json({
    message: "Invalid URL",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
