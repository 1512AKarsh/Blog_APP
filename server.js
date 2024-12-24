const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
//env config
dotenv.config();
//router import
const userRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoutes");
// mongodb connection

connectDB();

//rest objecct
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Port
const PORT = process.env.PORT || 8080;
//listen
app.get("/", (req, res) => {
  res.status(200).send({ message: "Node Server" });
});

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE}  mode port no ${PORT}`.bgCyan
      .white
  );
});
