const Product = require("../models/Product");

const { MENU_LINKS } = require("../constants/navigation");
const { STATUS_CODE } = require("../constants/statusCode");

const cartController = require("./cartController");

exports.getProductsView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const products = await Product.getAll();

  response.render("products.ejs", {
    headTitle: "Shop - Products",
    path: "/",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products",
    products,
    cartCount,
  });
};

exports.getAddProductView = (request, response) => {
  const cartCount = cartController.getProductsCount();

  response.render("add-product.ejs", {
    headTitle: "Shop - Add product",
    path: "/add",
    menuLinks: MENU_LINKS,
    activeLinkPath: "/products/add",
    cartCount,
  });
};

exports.addProduct = async (request, response) => {
  try {
    const { name, description, price } = request.body;
    const product = new Product(name, description, Number(price));
    await product.save();
    response.redirect("/products/new");
  } catch (error) {
    console.error('Error adding product:', error);
    response.status(STATUS_CODE.BAD_REQUEST).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getNewProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const newestProduct = await Product.getLast();

  response.render("new-product.ejs", {
    headTitle: "Shop - New product",
    path: "/new",
    activeLinkPath: "/products/new",
    menuLinks: MENU_LINKS,
    newestProduct,
    cartCount,
  });
};

exports.getProductView = async (request, response) => {
  const cartCount = cartController.getProductsCount();
  const name = request.params.name;

  const product = await Product.findByName(name);

  response.render("product.ejs", {
    headTitle: "Shop - Product",
    path: `/products/${name}`,
    activeLinkPath: `/products/${name}`,
    menuLinks: MENU_LINKS,
    product,
    cartCount,
  });
};

exports.deleteProduct = async (request, response) => {
  const name = request.params.name;
  await Product.deleteByName(name);

  response.status(STATUS_CODE.OK).json({ success: true });
};
