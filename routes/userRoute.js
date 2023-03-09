const express = require("express");
const {
  getAllUsers,
  postAUser,
  getAUser,
  deleteAUser,
  updateAUser,
} = require("./../controllers/userController");
const { signUp, logIn } = require("../controllers/authController");

// Routs
const userRoute = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

userRoute.route("/").get(getAllUsers).post(postAUser);
userRoute.route("/:id").get(getAUser).delete(deleteAUser).patch(updateAUser);

module.exports = userRoute;
