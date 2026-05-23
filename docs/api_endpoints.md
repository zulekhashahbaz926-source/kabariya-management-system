# AI LearnHub REST API Documentation

This document outlines the API endpoints offered by the AI LearnHub backend server. The base URL for all endpoints is `/api`.

---

## 🔑 Authentication Endpoints (`/api/auth`)

### 1. Register User
* **Endpoint**: `POST /signup`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "username": "student_user",
    "email": "student@university.edu",
    "password": "secure_password"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "username": "student_user",
      "email": "student@university.edu",
      "role": "student"
    }
  }
  ```

### 2. Login User
* **Endpoint**: `POST /login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "student@university.edu",
    "password": "secure_password"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "username": "student_user",
      "email": "student@university.edu",
      "role": "student"
    }
  }
  ```

### 3. Get Student Profile
* **Endpoint**: `GET /profile`
* **Access**: Secured (Requires JWT token)
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "student_user",
      "email": "student@university.edu",
      "role": "student",
      "created_at": "2026-05-23T18:42:00.000Z"
    }
  }
  ```

---

## 📚 Course Store & Student Catalog Endpoints (`/api/courses`)

### 1. List Courses (Storefront Catalog)
* **Endpoint**: `GET /`
* **Access**: Public
* **Query Parameters**:
  * `category` (Optional) - Filters by topic category (e.g. `Software Engineering`)
  * `search` (Optional) - Filters matching terms in titles/descriptions
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "courses": [
      {
        "id": 1,
        "title": "Software Architecture Masterclass",
        "description": "...",
        "instructor": "Dr. Sarah Jenkins",
        "category": "Software Engineering",
        "price": 99.99,
        "discount_price": 79.99,
        "rating": 4.8,
        "image_url": "...",
        "syllabus": [ ... ],
        "resources": [ ... ]
      }
    ]
  }
  ```

### 2. Course Details & Reviews
* **Endpoint**: `GET /:id`
* **Access**: Public
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "course": { ... },
    "reviews": [
      {
        "id": 1,
        "user_id": 2,
        "course_id": 1,
        "rating": 5,
        "review_text": "Incredible content!",
        "username": "another_student"
      }
    ]
  }
  ```

### 3. Simulated Checkout / Course Purchase
* **Endpoint**: `POST /purchase`
* **Access**: Secured (Requires JWT token)
* **Request Body**:
  ```json
  {
    "courseId": 1,
    "cardNumber": "4242 4242 4242 4242",
    "couponCode": "STUDENT50"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Course purchased successfully!",
    "transaction": {
      "courseId": 1,
      "amountPaid": 39.99,
      "date": "2026-05-23T18:42:00.000Z"
    }
  }
  ```
* **Exception Responses**:
  * *402 Payment Required (Invalid Card)*: `{"success": false, "errorType": "PAYMENT_REQUIRED", "message": "Simulated Payment Declined: Invalid credit card number format."}`
  * *402 Payment Required (Insufficient Funds)*: `{"success": false, "errorType": "PAYMENT_REQUIRED", "message": "Simulated Payment Failed: Insufficient funds in this test card account."}`

### 4. Toggle Bookmark
* **Endpoint**: `POST /bookmarks`
* **Access**: Secured (Requires JWT token)
* **Request Body**: `{"courseId": 1}`
* **Success Response (200 OK or 210 Created)**:
  ```json
  {
    "success": true,
    "bookmarked": true,
    "message": "Course bookmarked successfully."
  }
  ```

### 5. Get Student Dashboard Data
* **Endpoint**: `GET /dashboard`
* **Access**: Secured (Requires JWT token)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalCourses": 1,
      "completedCourses": 0,
      "averageProgress": 15,
      "studyHours": 4.5
    },
    "enrollments": [ ... ],
    "bookmarks": [ ... ],
    "recommendations": [ ... ]
  }
  ```

### 6. Update Course Progress
* **Endpoint**: `POST /progress`
* **Access**: Secured (Requires JWT token)
* **Request Body**:
  ```json
  {
    "courseId": 1,
    "chapterId": 2
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "progress": 33,
    "completedChapters": [1, 2],
    "status": "active"
  }
  ```

---

## 🤖 AI Features Endpoints (`/api/ai`)

### 1. AI Tutor Assistant Chat
* **Endpoint**: `POST /chat`
* **Access**: Secured (Requires JWT token)
* **Request Body**: `{"message": "Can you explain SOLID principles?"}`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "response": "### 🌟 Understanding SOLID Principles..."
  }
  ```

### 2. Generate AI Quiz
* **Endpoint**: `POST /quiz`
* **Access**: Secured (Requires JWT token)
* **Request Body**: `{"topic": "react", "courseId": 1}`
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "quizId": 5,
    "topic": "React Server Components",
    "questions": [
      {
        "question": "Which directive must be added...",
        "options": ["'use client'", "'enable client'", ...],
        "answer": 0,
        "explanation": "..."
      }
    ]
  }
  ```

### 3. Summarize Content
* **Endpoint**: `POST /summarize`
* **Access**: Secured (Requires JWT token)
* **Request Body**: `{"content": "..."}`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "summary": "### 📝 Summary..."
  }
  ```
