# Gym Booking System API Documentation

## Authentication

### Register
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "email": "user@example.com",
      "role": "customer",
      "_id": "user_id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "user_id",
        "email": "user@example.com",
        "role": "customer",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      "token": "jwt_token"
    }
  }
  ```

### Get Current User Info
- **URL:** `/api/auth/profile`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "customer",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

## Classes

### Get All Classes
- **URL:** `/api/classes`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "class_id",
        "name": "Yoga",
        "description": "A relaxing yoga class",
        "durationMinutes": 60,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Get Class by ID
- **URL:** `/api/classes/:id`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "class_id",
      "name": "Yoga",
      "description": "A relaxing yoga class",
      "durationMinutes": 60,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get Class Schedules
- **URL:** `/api/classes/:classId/schedules`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "_id": "schedule_id",
      "classId": "class_id",
      "startTime": "2023-12-01T10:00:00.000Z",
      "endTime": "2023-12-01T11:00:00.000Z",
      "maxCapacity": 10,
      "room": "Room 101"
    }
  ]
  ```

## Schedules

### Get All Schedules
- **URL:** `/api/schedules`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "schedule_id",
        "classId": "class_id",
        "startTime": "2023-01-01T10:00:00.000Z",
        "endTime": "2023-01-01T11:00:00.000Z",
        "maxCapacity": 20,
        "currentBookings": 0,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Bookings

### Create Booking
- **URL:** `/api/bookings`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "scheduleId": "schedule_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "_id": "booking_id",
      "userId": "user_id",
      "scheduleId": "schedule_id",
      "status": "confirmed",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get All Bookings for Current User
- **URL:** `/api/bookings/me`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "booking_id",
        "userId": "user_id",
        "scheduleId": "schedule_id",
        "status": "confirmed",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

## Membership

### Get All Membership Plans
- **URL:** `/api/memberships/plans`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "plan_id",
        "name": "Monthly Membership",
        "price": 99,
        "durationDays": 30
      }
    ]
  }
  ```

### Get Current User Membership Status
- **URL:** `/api/memberships/me/membership`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "status": "active",
      "type": "monthly",
      "endDate": "2023-12-31T00:00:00.000Z"
    }
  }
  ``` 