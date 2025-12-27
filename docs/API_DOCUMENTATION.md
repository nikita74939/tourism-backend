# 📡 TOURISM API DOCUMENTATION

## Base URL
```
http://localhost:3000/api
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // Optional
}
```

---

## 🔐 AUTHENTICATION

### Register
Create new user account

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-12-27T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
Authenticate user and get JWT token

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
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

---

### Get Profile
Get current logged in user profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-12-27T10:00:00.000Z"
  }
}
```

---

## 📍 DESTINATIONS

### Get All Destinations
Get list of all tourist destinations

**Endpoint:** `GET /destinations`

**Query Parameters:**
- `search` (optional): Search by destination name
- `city` (optional): Filter by city

**Example:**
```
GET /destinations?search=borobudur&city=Magelang
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Destinations retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Candi Borobudur",
      "description": "Candi Buddha terbesar di dunia...",
      "latitude": -7.6079,
      "longitude": 110.2038,
      "city": "Magelang",
      "image_url": "https://...",
      "created_at": "2024-12-27T10:00:00.000Z"
    }
  ]
}
```

---

### Get Destination by ID
Get single destination details

**Endpoint:** `GET /destinations/:id`

**Response:** `200 OK`

---

### Get Nearby Destinations (LBS)
Get destinations near a coordinate point

**Endpoint:** `GET /destinations/nearby`

**Query Parameters:** (Required)
- `latitude`: User's latitude
- `longitude`: User's longitude
- `radius` (optional): Search radius in km (default: 50)

**Example:**
```
GET /destinations/nearby?latitude=-7.7928&longitude=110.3658&radius=20
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Nearby destinations retrieved successfully",
  "data": [
    {
      "id": 3,
      "name": "Malioboro",
      "city": "Yogyakarta",
      "latitude": -7.7928,
      "longitude": 110.3658,
      "distance": 0.5,
      "image_url": "..."
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

---

## 🗺️ TRIPS

All trip endpoints require authentication.

### Create Trip
Create new trip plan

**Endpoint:** `POST /trips`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "destination_id": 1,
  "start_date": "2024-12-28T08:00:00Z",
  "end_date": "2024-12-30T17:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "destination_id": 1,
    "start_date": "2024-12-28T08:00:00.000Z",
    "end_date": "2024-12-30T17:00:00.000Z",
    "Destination": {
      "id": 1,
      "name": "Candi Borobudur",
      "city": "Magelang"
    }
  }
}
```

---

### Get User Trips
Get all trips for logged in user

**Endpoint:** `GET /trips`

**Query Parameters:**
- `status` (optional): Filter by status
  - `upcoming`: Future trips
  - `ongoing`: Current trips
  - `past`: Past trips

**Example:**
```
GET /trips?status=upcoming
```

**Response:** `200 OK`

---

### Get Trip by ID
Get single trip with full details including itineraries

**Endpoint:** `GET /trips/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Trip retrieved successfully",
  "data": {
    "id": 1,
    "start_date": "2024-12-28T08:00:00.000Z",
    "end_date": "2024-12-30T17:00:00.000Z",
    "Destination": {
      "id": 1,
      "name": "Candi Borobudur",
      "description": "...",
      "latitude": -7.6079,
      "longitude": 110.2038
    },
    "Itineraries": [
      {
        "id": 1,
        "title": "Sunrise at Borobudur",
        "activity_time": "2024-12-28T04:30:00.000Z",
        "notes": "Don't forget camera!"
      }
    ]
  }
}
```

---

### Update Trip
Update trip dates

**Endpoint:** `PUT /trips/:id`

**Request Body:**
```json
{
  "start_date": "2024-12-29T08:00:00Z",
  "end_date": "2024-12-31T17:00:00Z"
}
```

**Response:** `200 OK`

---

### Delete Trip
Delete a trip (will also delete all itineraries and notifications)

**Endpoint:** `DELETE /trips/:id`

**Response:** `200 OK`

---

## 📅 ITINERARIES

All itinerary endpoints require authentication.

### Create Itinerary
Add activity to trip

**Endpoint:** `POST /itineraries`

**Request Body:**
```json
{
  "trip_id": 1,
  "title": "Sunrise at Borobudur",
  "activity_time": "2024-12-28T04:30:00Z",
  "notes": "Don't forget camera and jacket!"
}
```

**Response:** `201 Created`

---

### Get Trip Itineraries
Get all itineraries for a specific trip

**Endpoint:** `GET /itineraries/trip/:tripId`

**Response:** `200 OK`

---

### Update Itinerary
Update itinerary details

**Endpoint:** `PUT /itineraries/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "activity_time": "2024-12-28T05:00:00Z",
  "notes": "Updated notes"
}
```

**Response:** `200 OK`

---

### Delete Itinerary
Delete an itinerary

**Endpoint:** `DELETE /itineraries/:id`

**Response:** `200 OK`

---

## 🔔 NOTIFICATIONS

All notification endpoints require authentication.

### Create Notification
Create reminder for itinerary

**Endpoint:** `POST /notifications`

**Request Body:**
```json
{
  "itinerary_id": 1,
  "notify_time": "2024-12-28T03:30:00Z"
}
```

**Response:** `201 Created`

---

### Get User Notifications
Get all notifications for current user

**Endpoint:** `GET /notifications`

**Query Parameters:**
- `is_sent` (optional): Filter by sent status (true/false)

**Response:** `200 OK`

---

### Mark as Sent
Mark notification as sent (after sending)

**Endpoint:** `PATCH /notifications/:id/sent`

**Response:** `200 OK`

---

## 🏃 ACTIVITIES (Sensor)

All activity endpoints require authentication.

### Record Activity
Record user activity from accelerometer sensor

**Endpoint:** `POST /activities`

**Request Body:**
```json
{
  "activity_type": "walking"
}
```

**Valid activity types:**
- `walking`
- `idle`
- `traveling`
- `running`
- `cycling`

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Activity recorded successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "activity_type": "walking",
    "recorded_at": "2024-12-27T10:00:00.000Z"
  }
}
```

---

### Get User Activities
Get activity history

**Endpoint:** `GET /activities`

**Query Parameters:**
- `type` (optional): Filter by activity type
- `date` (optional): Filter by date (YYYY-MM-DD)
- `limit` (optional): Limit results (default: 100)

**Example:**
```
GET /activities?type=walking&date=2024-12-27&limit=50
```

**Response:** `200 OK`

---

### Get Activity Statistics
Get activity summary statistics

**Endpoint:** `GET /activities/stats`

**Query Parameters:**
- `startDate` (optional): Start date for stats
- `endDate` (optional): End date for stats

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Activity statistics retrieved successfully",
  "data": {
    "walking": 120,
    "idle": 45,
    "traveling": 15,
    "running": 8
  }
}
```

---

## 💱 CURRENCIES

Currency endpoints are public (no authentication required).

### Get All Currencies
Get list of all supported currencies

**Endpoint:** `GET /currencies`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Currencies retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "IDR",
      "rate_to_idr": 1.0000,
      "updated_at": "2024-12-27T10:00:00.000Z"
    },
    {
      "id": 2,
      "code": "USD",
      "rate_to_idr": 15600.0000,
      "updated_at": "2024-12-27T10:00:00.000Z"
    }
  ]
}
```

---

### Get Currency by Code
Get single currency info

**Endpoint:** `GET /currencies/:code`

**Example:** `GET /currencies/USD`

**Response:** `200 OK`

---

### Convert Currency
Convert amount between currencies

**Endpoint:** `GET /currencies/convert`

**Query Parameters:** (All required)
- `from`: Source currency code
- `to`: Target currency code
- `amount`: Amount to convert

**Example:**
```
GET /currencies/convert?from=USD&to=IDR&amount=100
```

**Response:** `200 OK`
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

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 500 | Internal Server Error |

---

## 📝 Notes

1. All datetime values use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
2. Authentication token expires in 7 days (configurable)
3. Location coordinates use decimal degrees format
4. Distance calculations use kilometers (km)
5. Timezone: Server uses WIB (UTC+7)

---

## 🔧 Testing Tips

### Using cURL

```bash
# Save token to variable
TOKEN="your-jwt-token-here"

# Test authenticated endpoint
curl -X GET http://localhost:3000/api/trips \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Set environment variable `baseUrl` = `http://localhost:3000/api`
2. Set environment variable `token` after login
3. Use `{{baseUrl}}` and `{{token}}` in requests

---

**Last Updated:** December 27, 2024