const Product = require("../model/productModel");

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) {
      return res.status(402).json({
        success: false,
        message: "not found",
      });
    }
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

exports.getAllProductsOfAUser = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user[0]._id });
    if (!products) {
      res.status(400).json({
        success: false,
        message: "Not found",
      });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};
