//module
const express = require("express");
require("dotenv").config();
require("./db/db");
const User = require("./models/user");
const userRouter = require("./routes/user");

//code
const app = express();

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

app.use(express.json());
app.use(userRouter);

//compare password
// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

// test("mehul@gmail.com", "mehul13");

app.get("/test", (req, res) => {
  res.send("hello world");
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to backend" });
});

app.listen(8000, () => {
  console.log("port is listening");
});
