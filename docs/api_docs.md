# API Documentation - Fashionista's Haven

This document provides the technical details for all implemented API endpoints, including JSON structures for requests and responses.

## Base URL
`http://localhost:5000/api`

---

## 👤 1. Auth & Users

### POST `/auth/register`
Register a new user account.
- **Request Body**:
```json
{
  "fullname": "Nguyen Van A",
  "email": "vana@example.com",
  "password": "strongpassword123",
  "phone": "0123456789",
  "address": "123 Street, District 1, HCM"
}
```
- **Response (201 Created)**:
```json
{
  "message": "User registered. Please verify with OTP.",
  "userId": 1,
  "otp": "123456" 
}
```
*(Note: OTP is only returned in development mode)*

### POST `/auth/verify-otp`
Activate user account using OTP.
- **Request Body**:
```json
{
  "email": "vana@example.com",
  "otp": "123456"
}
```
- **Response (200 OK)**:
```json
{
  "message": "Account verified successfully"
}
```

### POST `/auth/login`
Authenticate user and receive JWT token.
- **Request Body**:
```json
{
  "email": "vana@example.com",
  "password": "strongpassword123"
}
```
- **Response (200 OK)**:
```json
{
  "userID": 1,
  "fullname": "Nguyen Van A",
  "email": "vana@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

### GET `/users/profile`
Get current user profile (Requires Authorization header).
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "userID": 1,
  "fullname": "Nguyen Van A",
  "email": "vana@example.com",
  "phone": "0123456789",
  "address": "123 Street, District 1, HCM",
  "role": "user",
  "created_at": "2024-02-25T..."
}
```

---

## 👕 2. Products & Categories (Public)

### GET `/products`
List products with filtering and pagination.
- **Query Params**: `?page=1&limit=12&search=shirt&categoryID=1&minPrice=100&maxPrice=500`
- **Response (200 OK)**:
```json
[
  {
    "productID": 1,
    "name": "Classic T-Shirt",
    "slug": "classic-t-shirt",
    "base_price": "25.00",
    "thumbnail": "http://...",
    "category_name": "T-Shirts"
  }
]
```

### GET `/products/:id`
Get detailed product info with variants.
- **Response (200 OK)**:
```json
{
  "productID": 1,
  "name": "Classic T-Shirt",
  "variants": [
    {
      "variantID": 1,
      "color_name": "Red",
      "hex_code": "#FF0000",
      "size_name": "XL",
      "stock_quantity": 50,
      "image_url": "http://..."
    }
  ]
}
```

---

## 🛒 3. Wishlist

### GET `/wishlist`
View user's favorite products.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
[
  {
    "wishlistID": 1,
    "productID": 1,
    "name": "Classic T-Shirt",
    "slug": "classic-t-shirt",
    "base_price": "25.00",
    "thumbnail": "http://..."
  }
]
```

---

## 📦 4. Orders & Payments

### POST `/orders/checkout`
Create a new order.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "items": [
    { "variantID": 1, "quantity": 2, "price": 25.00 }
  ],
  "shipping_address": "456 Main St, HCM",
  "receiver_name": "Nguyen Van A",
  "receiver_phone": "0123456789",
  "total_amount": 50.00
}
```
- **Response (201 Created)**:
```json
{
  "message": "Order created successfully",
  "orderID": 10,
  "order_number": "ORD-1740460..."
}
```

---

## 🛠️ 5. Admin Panel

### POST `/admin/products`
Add new product (Admin Only).
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
```json
{
  "categoryID": 1,
  "name": "New Jacket",
  "slug": "new-jacket",
  "base_price": 99.00,
  "description": "Premium winter jacket",
  "thumbnail": "http://..."
}
```

### GET `/admin/dashboard`
Get shop statistics (Admin Only).
- **Response (200 OK)**:
```json
{
  "totalRevenue": 5000.50,
  "totalOrders": 120,
  "totalProducts": 45
}
```
