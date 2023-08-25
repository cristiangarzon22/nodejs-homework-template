const express = require("express"); 
const cors = require("cors");
const connection = require("./db/connection");
require("dotenv").config();
const contactsRouter = require("./routes/api/contacts"); 
const multer = require('multer');

const app = express();

const logger = require("morgan");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");

app.use("/api/contacts", contactsRouter); //

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});


const PORT = process.env.PORT;

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

module.exports = app;
