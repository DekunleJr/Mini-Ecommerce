# E-Commerce API

## Overview

This is a RESTful API for managing products in an e-commerce store. The API supports CRUD operations, user authentication, product search, filtering, pagination, and sorting.

## Features

- **User Authentication**:
  - User signup and login with JWT-based authentication.
  - Admin role support for protected endpoints.
- **Product Management**:
  - Create, read, update, and delete products.
  - Search products by name with partial match support.
  - Filter products by category and price range.
  - Pagination for product listing.
  - Sorting by price, name, or stock quantity.
- **Error Handling**:
  - Comprehensive error handling for invalid inputs and unauthorized access.
- **Swagger Documentation**:
  - Interactive API documentation available at `/api-docs`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```
4. Set up the database:
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

### Running the Application

1. Start the server:
   ```bash
   npm start
   ```
2. Access the API documentation:
   - Navigate to `http://localhost:5000/api-docs`.

### Running Tests

To run the test suite:

```bash
npm test
```

## API Endpoints

### Authentication

- **POST** `/users/signup`: Register a new user.
- **POST** `/users/login`: Authenticate a user and get a JWT token.

### Products

- **GET** `/api/products`: Get all products with support for pagination, filtering, and sorting.
- **POST** `/api/products`: Create a new product (admin-only).
- **GET** `/api/products/{id}`: Get a single product by ID.
- **PUT** `/api/products/{id}`: Update a product (admin-only).
- **DELETE** `/api/products/{id}`: Delete a product (admin-only).

## Deployment

### Hosting Options

- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/)
- [AWS](https://aws.amazon.com/)

### Steps

1. Set up your environment variables on the hosting platform.
2. Deploy the application using the hosting provider's instructions.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add feature-name'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License.
