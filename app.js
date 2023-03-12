const express = require("express");
const cors = require("cors");
const app = express();
const peopleRoute = require("./routes/peopleRoute");
const AppError = require("./utils/appError");
const { globalErrorController } = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

//Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/avatar", express.static("avatar"));

//Routs
app.use("/api/v1/users", peopleRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't not fine ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
