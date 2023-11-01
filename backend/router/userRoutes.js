const express = require("express");
const {
  register,
  login,
  updateUserRole,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllUsers,
} = require("../controller/userController");
const { isAuthenticate, autherizedRole } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put(
  "/updaterole/:id",
  isAuthenticate,
  autherizedRole("admin"),
  updateUserRole
);
router.post("/forgotPass", forgotPassword);
router.post("/reset/:token", resetPassword);
router.post("/update/password", isAuthenticate, updatePassword);
router.get('/allUser',getAllUsers)

module.exports = router;
