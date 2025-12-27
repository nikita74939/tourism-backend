# 🌴 Tourism Backend API

Backend REST API untuk aplikasi Tourism - Travel Planner dengan fitur Location Based Service, Sensor Integration, dan Time Zone Conversion.

## 📋 Daftar Isi

- [Tech Stack](#tech-stack)
- [Fitur Utama](#fitur-utama)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Database Setup](#database-setup)
- [Running](#running)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## ✨ Fitur Utama

### 1. Authentication & Authorization
- Register & Login dengan JWT
- Password hashing
- Protected routes

### 2. Trip Planning
- Create, Read, Update, Delete trips
- Itinerary management
- Trip filtering (upcoming, ongoing, past)

### 3. Location Based Service (LBS)
- Nearby destinations berdasarkan koordinat GPS
- Distance calculation dengan Haversine formula
- Search destinations by city/name

### 4. Notification System
- Reminder untuk itinerary
- Auto-schedule notification
- Mark as sent tracking

### 5. Sensor Integration (Accelerometer)
- Record activity dari sensor
- Activity classification (walking, idle, traveling, running, cycling)
- Activity statistics & summary

### 6. Time Zone Conversion
- Konversi UTC ↔ WIB
- Date formatting untuk timezone Indonesia
- Trip date validation

### 7. Currency Converter
- Multi-currency support
- Convert antara berbagai mata uang
- Real-time exchange rates

## 📦 Instalasi

```bash
# Clone repository
git clone <repository-url>
cd tourism-backend

# Install dependencies
npm install
```

## ⚙️ Konfigurasi

1. Copy file `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` sesuai environment:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tourism_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

## 🗄️ Database Setup

### 1. Buat Database

```sql
CREATE DATABASE tourism_db;
USE tourism_db;
```

### 2. Run Migrations (Auto)

Sequelize akan otomatis membuat tabel saat server pertama kali dijalankan.

Atau manual dengan query:

```sql
-- Lihat struktur database di file: docs/database-schema.sql
```

### 3. Seed Data

```bash
# Seed destinations
node src/seeders/destinationSeeder.js

# Seed currencies
node src/seeders/currencySeeder.js

# Atau jalankan semua seeder
npm run seed
```

## 🚀 Running

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

### Health Check

```bash
curl http://localhost:3000/health
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user baru |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/profile` | ✅ | Get profile |

### User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/profile` | ✅ | Update profile |
| PUT | `/api/users/password` | ✅ | Change password |

### Destinations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/destinations` | ❌ | Get all destinations |
| GET | `/api/destinations/:id` | ❌ | Get destination by ID |
| GET | `/api/destinations/nearby` | ❌ | Get nearby destinations (LBS) |

### Trips

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/trips` | ✅ | Create new trip |
| GET | `/api/trips` | ✅ | Get user trips |
| GET | `/api/trips/:id` | ✅ | Get trip by ID |
| PUT | `/api/trips/:id` | ✅ | Update trip |
| DELETE | `/api/trips/:id` | ✅ | Delete trip |

### Itineraries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/itineraries` | ✅ | Create itinerary |
| GET | `/api/itineraries/trip/:tripId` | ✅ | Get trip itineraries |
| GET | `/api/itineraries/:id` | ✅ | Get itinerary by ID |
| PUT | `/api/itineraries/:id` | ✅ | Update itinerary |
| DELETE | `/api/itineraries/:id` | ✅ | Delete itinerary |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/notifications` | ✅ | Create notification |
| GET | `/api/notifications` | ✅ | Get user notifications |
| GET | `/api/notifications/pending` | ✅ | Get pending notifications |
| PATCH | `/api/notifications/:id/sent` | ✅ | Mark as sent |
| DELETE | `/api/notifications/:id` | ✅ | Delete notification |

### Activities (Sensor)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/activities` | ✅ | Record activity |
| GET | `/api/activities` | ✅ | Get user activities |
| GET | `/api/activities/stats` | ✅ | Get activity stats |

### Currencies

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/currencies` | ❌ | Get all currencies |
| GET | `/api/currencies/:code` | ❌ | Get currency by code |
| GET | `/api/currencies/convert` | ❌ | Convert currency |

## 📝 Request/Response Examples

### Register

**Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Trip

**Request:**
```json
POST /api/trips
Authorization: Bearer <token>
{
  "destination_id": 1,
  "start_date": "2024-12-20T08:00:00Z",
  "end_date": "2024-12-22T17:00:00Z"
}
```

### Get Nearby Destinations (LBS)

**Request:**
```
GET /api/destinations/nearby?latitude=-7.7928&longitude=110.3658&radius=50
```

**Response:**
```json
{
  "success": true,
  "message": "Nearby destinations retrieved successfully",
  "data": [
    {
      "id": 3,
      "name": "Malioboro",
      "city": "Yogyakarta",
      "distance": 0.5
    },
    {
      "id": 5,
      "name": "Keraton Yogyakarta",
      "city": "Yogyakarta",
      "distance": 1.2
    }
  ]
}
```

### Record Activity (Sensor)

**Request:**
```json
POST /api/activities
Authorization: Bearer <token>
{
  "activity_type": "walking"
}
```

### Convert Currency

**Request:**
```
GET /api/currencies/convert?from=USD&to=IDR&amount=100
```

**Response:**
```json
{
  "success": true,
  "message": "Currency converted successfully",
  "data": {
    "from": "USD",
    "to": "IDR",
    "amount": 100,
    "converted_amount": 1560000,
    "rate": 15600
  }
}
```

## 🔒 Authentication

API menggunakan JWT Bearer Token. Setelah login, simpan token dan gunakan di header:

```
Authorization: Bearer <your-token>
```

## 🧪 Testing

### Manual Testing dengan cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Testing dengan Postman

Import collection: `docs/postman_collection.json`

## 📁 Struktur Project

```
backend/
├── src/
│   ├── config/         # Database & env config
│   ├── models/         # Sequelize models
│   ├── controllers/    # Business logic
│   ├── routes/         # API routes
│   ├── middlewares/    # Auth & error handling
│   ├── services/       # Additional services
│   ├── utils/          # Helper functions
│   ├── seeders/        # Database seeders
│   ├── app.js          # Express app config
│   └── server.js       # Server entry point
├── .env                # Environment variables
├── package.json
└── README.md
```

## 🚧 Development Notes

### Services Layer

- **notificationService**: Handle notification logic & scheduling
- **currencyService**: Currency conversion & rate updates
- **sensorService**: Process accelerometer data & activity classification

### Utilities

- **response.js**: Standardized API response format
- **time.js**: Time zone conversion helpers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request
