const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not Found in DB",
        });
      }
      req.product = product;
      next();
    });
};

//create
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with photo",
      });
    }

    //destructuring the fields
    const { name, description, category, price, stock } = fields;

    //handles fileds
    if (!name || !description || !category || !price || !stock) {
      return res.status(400).json({
        error: "Please Include ALL Fileds",
      });
    }
    let product = new Product(fields);

    //handles files
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo size should be less tha 2 MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    //save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Saving Product in DB Failed",
        });
      }
      res.json(product);
    });
  });
};

//read
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//update
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with photo",
      });
    }

    //update code
    let product = req.product;
    product = _.extend(product, fields);

    //handles files
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "photo size should be less tha 2 MB",
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    //save product in DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "updating Product in DB Failed",
        });
      }
      res.json(product);
    });
  });
};

//delete
exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the Product",
      });
    }
    return res.json({
      message: `${deletedProduct.name} product deleted successfully`,
    });
  });
};

//product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 25;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO Products Found",
        });
      }
      return res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    // let soldnum = prod.sold + 1;
    // let stocknum = prod.stock - 1;
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Falied",
      });
    }
    next();
  });
};

exports.getAllUniqueProduct = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No Category Found",
      });
    }
    return res.json(category);
  });
};
