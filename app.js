const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const sequelize = require('./util/database');

const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());


// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
});
app.use(limiter);


// Swagger Documentation Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for the E-Commerce application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
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