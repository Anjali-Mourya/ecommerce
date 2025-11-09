-- Create Firebase Realtime Database structure
-- This is a reference for the database structure used in the application

-- Users collection structure
{
  "users": {
    "userId": {
      "name": "string",
      "email": "string", 
      "createdAt": "timestamp",
      "orders": {}
    }
  }
}

-- Orders collection structure
{
  "orders": {
    "orderId": {
      "id": "string",
      "userId": "string",
      "userEmail": "string",
      "items": [
        {
          "id": "number",
          "name": "string",
          "price": "number",
          "quantity": "number",
          "image": "string",
          "brand": "string"
        }
      ],
      "total": "number",
      "paymentMethod": "string",
      "address": {
        "street": "string",
        "city": "string", 
        "state": "string",
        "zip": "string",
        "country": "string"
      },
      "status": "string",
      "createdAt": "timestamp",
      "tracking": {
        "confirmed": {
          "status": "boolean",
          "timestamp": "timestamp"
        },
        "processing": {
          "status": "boolean", 
          "timestamp": "timestamp"
        },
        "shipped": {
          "status": "boolean",
          "timestamp": "timestamp"
        },
        "delivered": {
          "status": "boolean",
          "timestamp": "timestamp"
        }
      }
    }
  }
}
