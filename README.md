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

### Create Class (Instructor Only)
- **URL:** `/api/classes`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer jwt_token`
- **Body:**
  ```json
  {
    "name": "Yoga",
    "description": "A relaxing yoga class",
    "durationMinutes": 60
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Class created successfully",
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

### Update Class (Instructor Only)
- **URL:** `/api/classes/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer jwt_token`
- **Body:**
  ```json
  {
    "name": "Advanced Yoga",
    "description": "An advanced yoga class",
    "durationMinutes": 90
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Class updated successfully",
    "data": {
      "_id": "class_id",
      "name": "Advanced Yoga",
      "description": "An advanced yoga class",
      "durationMinutes": 90,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Class (Instructor Only)
- **URL:** `/api/classes/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Class deleted successfully"
  }
  ```

## Schedules

### Get All Schedules
- **URL:** `/api/schedules`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
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

### Get Schedule by ID
- **URL:** `/api/schedules/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "schedule_id",
      "classId": "class_id",
      "startTime": "2023-01-01T10:00:00.000Z",
      "endTime": "2023-01-01T11:00:00.000Z",
      "maxCapacity": 20,
      "currentBookings": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Create Schedule (Admin Only)
- **URL:** `/api/schedules`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer jwt_token`
- **Body:**
  ```json
  {
    "classId": "class_id",
    "startTime": "2023-01-01T10:00:00.000Z",
    "endTime": "2023-01-01T11:00:00.000Z",
    "maxCapacity": 20
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Schedule created successfully",
    "data": {
      "_id": "schedule_id",
      "classId": "class_id",
      "startTime": "2023-01-01T10:00:00.000Z",
      "endTime": "2023-01-01T11:00:00.000Z",
      "maxCapacity": 20,
      "currentBookings": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Update Schedule (Admin Only)
- **URL:** `/api/schedules/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer jwt_token`
- **Body:**
  ```json
  {
    "maxCapacity": 30
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Schedule updated successfully",
    "data": {
      "_id": "schedule_id",
      "classId": "class_id",
      "startTime": "2023-01-01T10:00:00.000Z",
      "endTime": "2023-01-01T11:00:00.000Z",
      "maxCapacity": 30,
      "currentBookings": 0,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Delete Schedule (Admin Only)
- **URL:** `/api/schedules/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Schedule deleted successfully"
  }
  ```

## Bookings

### Get All Bookings for Current User
- **URL:** `/api/bookings/my-bookings`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
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

### Get All Bookings for a Schedule (Admin Only)
- **URL:** `/api/bookings/schedule/:scheduleId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
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

### Create Booking (Customer Only)
- **URL:** `/api/bookings`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer jwt_token`
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

### Cancel Booking (Customer Only)
- **URL:** `/api/bookings/:id/cancel`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
      "_id": "booking_id",
      "userId": "user_id",
      "scheduleId": "schedule_id",
      "status": "cancelled",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

### Get Booking by ID
- **URL:** `/api/bookings/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
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

## Statistics

### Get Class Statistics (Admin Only)
- **URL:** `/api/stats/classes`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalClasses": 10,
      "activeClasses": 8,
      "totalSchedules": 20,
      "completedSchedules": 5,
      "cancelledSchedules": 2
    }
  }
  ```

### Get Booking Statistics (Admin Only)
- **URL:** `/api/stats/bookings`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalBookings": 100,
      "confirmedBookings": 80,
      "cancelledBookings": 20,
      "averageBookingsPerClass": 10
    }
  }
  ```

### Get Revenue Statistics (Admin Only)
- **URL:** `/api/stats/revenue`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalRevenue": 5000,
      "revenueByClass": [
        {
          "classId": "class_id",
          "className": "Yoga",
          "revenue": 2000
        }
      ]
    }
  }
  ```

### Get Instructor Statistics (Admin Only)
- **URL:** `/api/stats/instructors`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "instructorId": "instructor_id",
        "instructorName": "John Doe",
        "totalClasses": 5,
        "totalSchedules": 10,
        "totalBookings": 50
      }
    ]
  }
  ```

### Get Popular Classes (Admin Only)
- **URL:** `/api/stats/popular-classes`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer jwt_token`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "classId": "class_id",
        "className": "Yoga",
        "totalBookings": 100,
        "averageBookingsPerClass": 20
      }
    ]
  }
  ```

## 前端API调用说明

### 认证与Token
- 登录/注册成功后，前端需将返回的token存入localStorage。
- 后续所有需要认证的API请求，需在header中携带：
  `Authorization: Bearer <token>`

### 用户信息
- **GET** `/api/auth/profile` 获取当前登录用户信息。

### 课程相关
- **GET** `/api/classes` 支持 level、category、instructor 查询参数筛选。
- **GET** `/api/classes/:classId/schedules` 获取某课程下所有排班。

### 排班相关
- **GET** `/api/schedules` 支持 date、instructor、level、category、classId 查询参数筛选。

### 预约相关
- **GET** `/api/bookings/me` 获取当前用户所有预约。
- **POST** `/api/bookings` 创建预约。
- **DELETE** `/api/bookings/:bookingId` 取消预约。

### 会员相关
- **GET** `/api/memberships/plans` 获取会员计划。
- **GET** `/api/memberships/me/membership` 获取当前会员状态。
- **POST** `/api/memberships/me/cancel` 取消会员。
- **POST** `/api/memberships/me/renew` 续订会员。

### 错误处理
- 401 未认证时，前端会自动跳转到登录页。
- 其他错误会在页面以提示信息显示。 