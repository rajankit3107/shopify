# Shopify - E-commerce Platform

A full-stack e-commerce platform built with modern technologies that allows vendors to create stores and sell products, while customers can browse the marketplace, purchase items, and manage their orders.

## Project Structure

The project is divided into two main parts:

```
shopify/
├── shopify-backend/    # Backend API server
└── shopify-frontend/   # Frontend React application
```

## Features

- **User Authentication**: Secure login and signup for customers and vendors
- **Marketplace**: Browse and search for products from different vendors
- **Vendor Dashboard**: Manage products, track orders, and view sales analytics
- **Shopping Cart**: Add products to cart and proceed to checkout
- **Payment Integration**: Secure payment processing with Razorpay
- **Order Management**: Track order status and history
- **Responsive Design**: Modern UI that works across devices

## Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Payment Gateway**: Razorpay

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd shopify-backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/shopify"
   PORT=4000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=1d
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PLATFORM_FEE_PERCENT=20
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd shopify-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:slug` - Get vendor by slug
- `POST /api/vendors` - Create a new vendor
- `PUT /api/vendors/:id` - Update vendor details

### Products
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID
- `POST /api/product` - Create a new product
- `PUT /api/product/:id` - Update product details
- `DELETE /api/product/:id` - Delete a product

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/me` - Get current user's orders
- `GET /api/orders/vendor/me` - Get vendor's orders
- `POST /api/orders/paid` - Mark order as paid

### Payments
- `POST /api/payments/create-order` - Create a payment order
- `POST /api/payments/verify` - Verify payment

## Database Schema

The application uses the following data models:

- **User**: Customer or vendor accounts
- **Vendor**: Store information for sellers
- **Product**: Items available for purchase
- **Order**: Purchase records
- **OrderItem**: Individual items within an order

## License

This project is licensed under the ISC License.

## Acknowledgements

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Razorpay](https://razorpay.com/)