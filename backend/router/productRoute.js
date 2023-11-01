const express = require("express");
const {
  createProduct,
  updateProduct,
  getAllProductsOfAUser,
} = require("../controller/productController");
const { isAuthenticate, autherizedRole } = require("../middleware/auth");

const router = express.Router();

router.post("/new", isAuthenticate, createProduct);
router.put("/update/:id", autherizedRole("admin"), updateProduct);
router.get('/getAllPro',isAuthenticate,
getAllProductsOfAUser)

module.exports = router;
