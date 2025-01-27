const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');
// const multer = require('multer');
const dotenv = require('dotenv');
const sequelize = require('./util/database');

const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

dotenv.config();

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'image');
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toDateString() + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
});
app.use(limiter);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API for managing products in an e-commerce store',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/users', authRoutes);
app.use('/api/products', productRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Start the server
(async () => {
  try {
    await sequelize.sync({ force: true }); // Ensure models are synced
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app;