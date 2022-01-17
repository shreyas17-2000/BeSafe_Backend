const cors = require("cors");
const express = require("express");
const { PORT, DBURL } = require("./config");
const errorHandler = require("./middleware/errorHandler");
const router = require("./routes");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

const app = express();

app.use(cookieParser());
// const corsOptions = {
//   credentials: true,
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:19002/",
//     "http://192.168.0.108:19002/",
//   ],
// };

mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Db Connected"));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use(errorHandler);

const port = PORT || "5000";

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
