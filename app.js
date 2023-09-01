const express = require("express"); 
const cors = require("cors");
const connection = require("./db/connection");
require("dotenv").config();
const contactsRouter = require("./routes/api/contacts"); 
const { getUserByVerificationToken, verifyUser } = require("./service/index");



const app = express();

const logger = require("morgan");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");

app.use("/api/contacts", contactsRouter);

app.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const existingUser = await getUserByVerificationToken(
      req.params.verificationToken
    );

    if (existingUser) {
      await verifyUser(existingUser._id); 
      res.send(" message: Verification successful ");
      } else next("message: User not found");
   } catch (err) {
    next(err);
  }
});

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
