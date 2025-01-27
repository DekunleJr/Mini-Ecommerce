const Product = require('../models/products');
const { Op } = require('sequelize');

exports.postProduct = async (req, res, next) => {
    try {
        const { name, price, description, stock_quantity, category } = req.body;
        const product = await Product.create({ name, price, description, stock_quantity, category });
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sortBy = 'name', order = 'ASC' } = req.query;
    // Validate query parameters
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedPage) || parsedPage < 1 || isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const offset = (parsedPage - 1) * parsedLimit;

    // Build the filter object
    const filter = {};
    if (search) {
      filter.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { [Op.gte]: parseFloat(minPrice) }),
        ...(maxPrice && { [Op.lte]: parseFloat(maxPrice) }),
      };
    }

    // Fetch products with filters, sorting, and pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: filter,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

exports.editProduct = async (req, res, next) => {
    try {
        const { name, price, description, stock_quantity, category } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.update({ name, price, description, stock_quantity, category });
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
    await product.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}