# API 文档

## 1. 用户认证（User Authentication）

### 用户注册
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: 用户注册，可指定角色，自动初始化会员信息
- **Access**: 公共
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
    "message": "注册成功",
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "role": "customer"
      }
    }
  }
  ```

### 用户登录
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: 用户登录，返回JWT
- **Access**: 公共
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

### 获取当前用户信息
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Description**: 获取当前登录用户的基本信息
- **Access**: 需要用户认证
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "用户名",
      "role": "customer"
    }
  }
  ```

## 2. 会员管理（Membership Management）

### 获取所有会员计划
- **URL**: `/api/memberships/plans`
- **Method**: `GET`
- **Description**: 获取所有可用的会员计划
- **Access**: 公共
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "plan_id",
        "name": "月度会员",
        "price": 99,
        "durationDays": 30
      }
    ]
  }
  ```

### 获取当前用户会员状态
- **URL**: `/api/memberships/me/membership`
- **Method**: `GET`
- **Description**: 获取当前登录用户的会员状态
- **Access**: 需要用户认证
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

### 取消会员订阅
- **URL**: `/api/memberships/me/membership/cancel`
- **Method**: `POST`
- **Description**: 取消当前用户的会员订阅
- **Access**: 需要用户认证
- **Response**:
  ```json
  {
    "success": true,
    "message": "会员订阅已取消",
    "data": {
      "membership": {
        "status": "cancelled",
        "endDate": "2023-12-31T00:00:00.000Z"
      }
    }
  }
  ```

### 续订会员
- **URL**: `/api/memberships/me/membership/renew`
- **Method**: `POST`
- **Description**: 续订会员（需传递planId）
- **Access**: 需要用户认证
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
    "message": "会员续订成功",
    "data": {
      "membership": {
        "status": "active",
        "endDate": "2024-01-31T00:00:00.000Z"
      }
    }
  }
  ```

## 3. 课程管理（Class Management）

### 创建课程
- **URL**: `/api/classes`
- **Method**: `POST`
- **Description**: 创建课程
- **Access**: 仅限管理员
- **Request Body**:
  ```json
  {
    "name": "瑜伽课",
    "description": "初级瑜伽课程",
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
      "name": "瑜伽课"
    }
  }
  ```

### 获取所有课程
- **URL**: `/api/classes`
- **Method**: `GET`
- **Description**: 获取所有课程，可通过 level、category、instructor 筛选
- **Query Params**:
  - `level` (可选)
  - `category` (可选)
  - `instructor` (可选)
- **Access**: 公共
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "class_id",
        "name": "瑜伽课"
      }
    ]
  }
  ```

### 获取课程详情
- **URL**: `/api/classes/:id`
- **Method**: `GET`
- **Description**: 获取指定课程详情
- **Access**: 公共
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "class_id",
      "name": "瑜伽课",
      "description": "初级瑜伽课程"
    }
  }
  ```

### 更新课程
- **URL**: `/api/classes/:id`
- **Method**: `PUT`
- **Description**: 更新课程信息
- **Access**: 仅限管理员
- **Request Body**:
  ```json
  {
    "name": "高级瑜伽课",
    "description": "高级瑜伽课程"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "class_id",
      "name": "高级瑜伽课"
    }
  }
  ```

### 删除课程
- **URL**: `/api/classes/:id`
- **Method**: `DELETE`
- **Description**: 删除课程
- **Access**: 仅限管理员
- **Response**:
  ```json
  {
    "success": true,
    "message": "课程已删除"
  }
  ```

### 获取课程排班（某课程下所有排班）
- **URL**: `/api/classes/:classId/schedules`
- **Method**: `GET`
- **Description**: 获取指定课程的所有排班
- **Access**: 公共
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

## 4. 排班管理（Schedule Management）

### 创建排班
- **URL**: `/api/schedules`
- **Method**: `POST`
- **Description**: 创建课程排班
- **Access**: 仅限管理员
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

### 获取所有排班
- **URL**: `/api/schedules`
- **Method**: `GET`
- **Description**: 获取所有排班，可通过 date、instructor、level、category、classId 筛选
- **Query Params**:
  - `date` (可选)
  - `instructor` (可选)
  - `level` (可选)
  - `category` (可选)
  - `classId` (可选)
- **Access**: 公共
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

### 获取排班详情
- **URL**: `/api/schedules/:id`
- **Method**: `GET`
- **Description**: 获取指定排班详情
- **Access**: 公共
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

### 更新排班
- **URL**: `/api/schedules/:id`
- **Method**: `PUT`
- **Description**: 更新排班信息
- **Access**: 仅限管理员
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

### 删除排班
- **URL**: `/api/schedules/:id`
- **Method**: `DELETE`
- **Description**: 删除排班
- **Access**: 仅限管理员
- **Response**:
  ```json
  {
    "success": true,
    "message": "排班已删除"
  }
  ```

## 5. 预约管理（Booking Management）

### 创建预约
- **URL**: `/api/bookings`
- **Method**: `POST`
- **Description**: 用户预订课程排班
- **Access**: 需要用户认证（仅限customer角色）
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
    "message": "预约创建成功",
    "data": {
      "id": "booking_id",
      "status": "confirmed"
    }
  }
  ```

### 获取当前用户所有预约
- **URL**: `/api/bookings/me`
- **Method**: `GET`
- **Description**: 获取当前用户的所有预约
- **Access**: 需要用户认证
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

### 获取排班所有预约
- **URL**: `/api/bookings/schedule/:scheduleId`
- **Method**: `GET`
- **Description**: 获取某个排班下的所有预约
- **Access**: 仅限管理员
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

### 获取预约详情
- **URL**: `/api/bookings/:id`
- **Method**: `GET`
- **Description**: 获取预约详情
- **Access**: 需要用户认证
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

### 取消预约
- **URL**: `/api/bookings/:bookingId`
- **Method**: `DELETE`
- **Description**: 用户取消自己的预约
- **Access**: 需要用户认证（仅限预约本人）
- **Response**:
  ```json
  {
    "success": true,
    "message": "预约已成功取消",
    "data": {
      "id": "booking_id",
      "status": "cancelled"
    }
  }
  ```

## 主要数据模型依赖

- **User**: 用户信息、角色、会员信息
- **MembershipPlan**: 会员计划
- **Class**: 课程信息
- **Schedule**: 课程排班（与Class、Instructor关联）
- **Booking**: 预约信息（与User、Schedule关联）

## 权限说明

- **公共**: 无需登录即可访问
- **需要用户认证**: 需携带有效JWT
- **仅限管理员**: 需登录且角色为admin
- **仅限预约本人**: 需登录且只能操作自己的预约

## 备注

- 所有核心业务均有Jest自动化测试覆盖，确保接口的正确性和健壮性。
- 会员、课程、排班、预约等模块均已实现基本的CRUD和业务规则校验。
- 预约取消、权限校验、并发名额控制等关键场景已通过测试。 