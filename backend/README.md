# Sayona Shipping Service - Backend

This is the Node.js Express backend for the Sayona Shipping Service. It handles authentication, shipment management, and tracking history.

## Requirements
- Node.js (v14 or higher)
- MongoDB running locally or a MongoDB Atlas URI

## Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the `backend` directory (already created locally).
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/sayona_shipping
   JWT_SECRET=supersecretjwtkey_sayona_shipping_2026
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

   The backend will connect to MongoDB and start on `http://localhost:5000/api/...`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token

### Shipments
- `POST /api/shipments` - Create shipment (Private)
- `GET /api/shipments` - Get all shipments
- `GET /api/shipments/:trackingNumber` - Get specific shipment
- `PUT /api/shipments/:trackingNumber` - Update status/location (Private)
- `DELETE /api/shipments/:trackingNumber` - Delete shipment (Private/Admin)

### Tracking
- `GET /api/tracking/:trackingNumber` - Get tracking and history (Public)
- `POST /api/tracking/update` - Push new tracking update (Private)
