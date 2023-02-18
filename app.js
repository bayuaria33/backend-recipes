const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mainRoute = require(`./src/routes/index`)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', mainRoute);



// console.log(process.env.DB_NAME);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
