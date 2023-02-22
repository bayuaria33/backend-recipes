const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require('xss-clean')

const app = express();
const port = 3000;
const mainRoute = require(`./src/routes/index`)
const apiErrorHandler = require('./src/middleware/error/api-error-handler');
app.use(cors({
  origin: "*",
  method:"*"
}));
app.use(helmet());
app.use(xss());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', mainRoute);

app.get("/", (req, res, next) => {
  res.status(200).json({ status: "success", statusCode: 200 });
});

//404 on missing route
app.all("*",(req,res,next)=> {
  res.status(404).json({
    message: `404 Main Route Not Found`
  })
})

// console.log(process.env.DB_NAME);
app.use(apiErrorHandler);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
