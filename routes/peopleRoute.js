const express = require("express");
const {
  getAllUsers,
  postAUser,
  deleteAUser,
  upload,
} = require("../controllers/userController");
const { signUp, logIn } = require("../controllers/authController");

// Routs
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

router.route("/").get(getAllUsers).post(upload.single("avatar"), postAUser);
router.route("/:id").delete(deleteAUser);

module.exports = router;
