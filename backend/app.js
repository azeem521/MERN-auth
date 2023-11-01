const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./router/userRoutes");
const productRoute = require("./router/productRoute");
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();
// app.use(bodyParser.urlencoded({
//     extended:true
// }));
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json());

app.use("/auth", userRoute);
app.use("/product", productRoute);

module.exports = app;
