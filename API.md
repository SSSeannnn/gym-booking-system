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

### Cancel Membership Subscription
- **URL**: `/api/memberships/me/membership/cancel`
- **Method**: `POST`
- **Description**: Cancel the current user's membership subscription
- **Access**: Requires user authentication
- **Response**:
  ```json
  {
    "success": true,
    "message": "Membership subscription cancelled",
    "data": {
      "membership": {
        "status": "cancelled",
        "endDate": "2023-12-31T00:00:00.000Z"
      }
    }
  }
  ```

### Renew Membership
- **URL**: `/api/memberships/me/membership/renew`
- **Method**: `POST`
- **Description**: Renew membership (requires planId)
- **Access**: Requires user authentication
- **Request Body**:
  ```json
  {
    "planId": "plan_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Membership renewed successfully",
    "data": {
      "membership": {
        "status": "active",
        "endDate": "2024-01-31T00:00:00.000Z"
      }
    }
  }
  ```

## 3. Class Management

### Create Class
- **URL**: `/api/classes`
- **Method**: `POST`
- **Description**: Create class
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "name": "Yoga Class",
    "description": "Beginner yoga class",
    "durationMinutes": 60,
    "instructor": "instructor_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "class_id",
      "name": "Yoga Class"
    }
  }
  ```

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

### Update Class
- **URL**: `/api/classes/:id`
- **Method**: `PUT`
- **Description**: Update class information
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "name": "Advanced Yoga Class",
    "description": "Advanced yoga class"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "class_id",
      "name": "Advanced Yoga Class"
    }
  }
  ```

### Delete Class
- **URL**: `/api/classes/:id`
- **Method**: `DELETE`
- **Description**: Delete class
- **Access**: Admin only
- **Response**:
  ```json
  {
    "success": true,
    "message": "Class deleted"
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

### Create Schedule
- **URL**: `/api/schedules`
- **Method**: `POST`
- **Description**: Create class schedule
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "classId": "class_id",
    "startTime": "2023-12-01T10:00:00.000Z",
    "endTime": "2023-12-01T11:00:00.000Z",
    "maxCapacity": 10,
    "room": "Room 101"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "schedule_id",
      "classId": "class_id"
    }
  }
  ```

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

### Get Schedule Detail
- **URL**: `/api/schedules/:id`
- **Method**: `GET`
- **Description**: Get details of the specified schedule
- **Access**: public
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "schedule_id",
      "classId": "class_id",
      "startTime": "2023-12-01T10:00:00.000Z"
    }
  }
  ```

### Update Schedule
- **URL**: `/api/schedules/:id`
- **Method**: `PUT`
- **Description**: Update schedule information
- **Access**: Admin only
- **Request Body**:
  ```json
  {
    "startTime": "2023-12-01T11:00:00.000Z",
    "endTime": "2023-12-01T12:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "schedule_id",
      "startTime": "2023-12-01T11:00:00.000Z"
    }
  }
  ```

### Delete Schedule
- **URL**: `/api/schedules/:id`
- **Method**: `DELETE`
- **Description**: Delete schedule
- **Access**: Admin only
- **Response**:
  ```json
  {
    "success": true,
    "message": "Schedule deleted"
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

### Get All Bookings for a Schedule
- **URL**: `/api/bookings/schedule/:scheduleId`
- **Method**: `GET`
- **Description**: Get all bookings under a schedule
- **Access**: Admin only
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "booking_id",
        "userId": "user_id",
        "status": "confirmed"
      }
    ]
  }
  ```

### Get Booking Detail
- **URL**: `/api/bookings/:id`
- **Method**: `GET`
- **Description**: Get booking details
- **Access**: Requires user authentication
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "booking_id",
      "scheduleId": "schedule_id",
      "status": "confirmed"
    }
  }
  ```

### Cancel Booking
- **URL**: `/api/bookings/:bookingId`
- **Method**: `DELETE`
- **Description**: User cancels their booking
- **Access**: Requires user authentication (only for the booking owner)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
      "id": "booking_id",
      "status": "cancelled"
    }
  }
  ```

## Main Data Model Dependencies

- **User**: User information, role, membership information
- **MembershipPlan**: Membership plan
- **Class**: Class information
- **Schedule**: Class schedule (associated with Class and Instructor)
- **Booking**: Booking information (associated with User and Schedule)

## Permission Description

- **Public**: Accessible without login
- **Requires User Authentication**: Must carry a valid JWT
- **Admin Only**: Must login and be role admin
- **Only for Booking Owner**: Must login and can only operate on their own booking

## Notes

- All core business has Jest automated test coverage to ensure interface correctness and robustness.
- Membership, class, schedule, booking modules have implemented basic CRUD and business rule checks.
- Key scenarios such as booking cancellation, permission checks, concurrent seat control have been tested. 