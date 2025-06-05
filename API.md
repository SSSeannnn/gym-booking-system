# API File

## 1. User Authentication

### register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: User registration, can specify role, automatically initialize membership information
- **Access**: public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "role": "customer"
      }
    }
  }
  ```

### User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: User login, returns JWT
- **Access**: public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt_token"
    }
  }
  ```

### Get Current User Info
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Description**: Get basic information of the currently logged-in user
- **Access**: Requires user authentication
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "role": "customer"
    }
  }
  ```

## 2. Membership Management

### Get All Membership Plans
- **URL**: `/api/memberships/plans`
- **Method**: `GET`
- **Description**: Get all available membership plans
- **Access**: public
- **Response**:
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
- **URL**: `/api/memberships/me/membership`
- **Method**: `GET`
- **Description**: Get the membership status of the currently logged-in user
- **Access**: Requires user authentication
- **Response**:
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

## 3. Class Management

### Get All Classes
- **URL**: `/api/classes`
- **Method**: `GET`
- **Description**: Get all classes, can be filtered by level, category, instructor
- **Query Params**:
  - `level` (optional)
  - `category` (optional)
  - `instructor` (optional)
- **Access**: public
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "class_id",
        "name": "Yoga Class"
      }
    ]
  }
  ```

### Get Class Detail
- **URL**: `/api/classes/:id`
- **Method**: `GET`
- **Description**: Get details of the specified class
- **Access**: public
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "class_id",
      "name": "Yoga Class",
      "description": "Beginner yoga class"
    }
  }
  ```

### Get Class Schedules (All schedules under a class)
- **URL**: `/api/classes/:classId/schedules`
- **Method**: `GET`
- **Description**: Get all schedules for the specified class
- **Access**: public
- **Response**:
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

## 4. Schedule Management

### Get All Schedules
- **URL**: `/api/schedules`
- **Method**: `GET`
- **Description**: Get all schedules, can be filtered by date, instructor, level, category, classId
- **Query Params**:
  - `date` (optional)
  - `instructor` (optional)
  - `level` (optional)
  - `category` (optional)
  - `classId` (optional)
- **Access**: public
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "schedule_id",
        "classId": "class_id"
      }
    ]
  }
  ```

## 5. Booking Management

### Create Booking
- **URL**: `/api/bookings`
- **Method**: `POST`
- **Description**: User books a class schedule
- **Access**: Requires user authentication (customer role only)
- **Request Body**:
  ```json
  {
    "scheduleId": "schedule_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking created successfully",
    "data": {
      "id": "booking_id",
      "status": "confirmed"
    }
  }
  ```

### Get All Bookings for Current User
- **URL**: `/api/bookings/me`
- **Method**: `GET`
- **Description**: Get all bookings for the current user
- **Access**: Requires user authentication
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "booking_id",
        "userId": "user_id",
        "scheduleId": {
          "_id": "schedule_id",
          "classId": {
            "_id": "class_id",
            "name": "Yoga",
            "instructor": { "_id": "instructor_id", "username": "rr345" }
          },
          "startTime": "2025-06-01T18:22:00.000Z",
          "endTime": "2025-06-01T21:23:00.000Z",
          "room": "201"
        },
        "status": "confirmed",
        "createdAt": "2025-06-01T14:42:53.275Z"
      }
    ]
  }
  ```
