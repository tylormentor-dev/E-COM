# Mechanic Connect System – Backend & Database

**Group Number:** 4

## 👥 Team Members

- **Member 1: Tylor** Database & Data Integrity (SQL Specialist)
- **Member 2: Mish-al Ismail** Back-End Logic & API (Node.js Developer)
- **Member 3: Samnkelisiwe Mpiyonke** Front-End Integration & UI
- **Member 4: Ntsapo Tena** Front-End Integration & UI


## 📌 Project Overview

The **Mechanic Connect System** is a full-stack platform that integrates a secure relational database, a Node.js + Express backend, and a responsive front-end interface.

The platform allows users to:

- Register and authenticate accounts
- Book mechanics and services
- List and purchase cars or car parts
- Make secure payments
- Leave reviews and ratings
- Receive notifications

This system demonstrates:

- Structured relational database design
- Secure authentication & authorization
- Server-side validation
- Role-based access control
- End-to-end integration

## 🛠 Technologies Used

- Node.js (v18+ recommended)
- Express.js
- MySQL 8+
- JWT Authentication
- bcrypt (password hashing)
- dotenv (environment variables)
- Git & GitHub
- HTML, CSS, JavaScript

# 🗄 Database Documentation (Member 1)

## Responsibilities

- Design database schema
- Create tables (Users, Mechanics, Bookings, Payments, Reviews, etc.)
- Define relationships
- Store hashed passwords
- Implement user roles (customer, mechanic, admin)
- Optimize queries
- Provide database structure to backend developer

## Database Design

The database is normalized to **Third Normal Form (3NF)** and enforces strict referential integrity.

## 📊 Tables & Relationships

### 1️⃣ Users
**Primary Key:** `id`

Attributes:
- fullname
- email
- phone
- address
- id_number
- password_hash
- profile_image
- dob
- role
- created_at
- updated_at

Relationships:
- 1–1 → Mechanics
- 1–M → Bookings
- 1–M → Car Listings
- 1–M → Orders
- 1–M → Reviews
- 1–M → Notifications
- 1–M → Payments

### 2️⃣ Mechanics
**Primary Key:** `id`  
**Foreign Key:** `user_id → users.id`

Attributes:
- location
- bio
- years_experience
- rating
- availability
- notes_on_pricing
- updated_at

### 3️⃣ Services
**Primary Key:** `id`  
**Foreign Key:** `mechanic_id → mechanics.id`

Attributes:
- name
- description
- duration
- price
- created_at
- updated_at

### 4️⃣ Bookings
**Primary Key:** `id`

Foreign Keys:
- mechanic_id → mechanics.id
- service_id → services.id
- user_id → users.id

Attributes:
- booking_date
- status
- car_model
- total_price
- payment_method
- created_at
- confirmed_at
- updated_at

### 5️⃣ Car Listing
**Primary Key:** `id`  
**Foreign Key:** `seller_id → users.id`


### 6️⃣ Car Images
**Primary Key:** `id`  
**Foreign Key:** `car_id → car_listing.id`


### 7️⃣ Car Parts
**Primary Key:** `id`


### 8️⃣ Orders
**Primary Key:** `id`  
**Foreign Key:** `user_id → users.id`


### 9️⃣ Order Items
**Primary Key:** `id`

Foreign Keys:
- order_id → orders.id
- car_id → car_listing.id (nullable)
- part_id → car_parts.id (nullable)

Constraint:
- Only one of `car_id` or `part_id` can be NOT NULL


### 🔟 Reviews
**Primary Key:** `id`

Foreign Keys:
- user_id → users.id
- mechanic_id → mechanics.id

Constraint:
- UNIQUE (user_id, mechanic_id)


### 1️⃣1️⃣ Notifications
**Primary Key:** `id`  
**Foreign Key:** `user_id → users.id`


### 1️⃣2️⃣ Payments
**Primary Key:** `id`

Foreign Keys:
- user_id → users.id
- order_id → orders.id (nullable)

Constraint:
- `transaction_ref` must be UNIQUE


## 🔐 Authentication Contribution (Member 1)

- Secure user table structure
- Password hashing (hash + salt)
- Role-based access system


# 🌐 Server & API Documentation (Member 2)

## Responsibilities

- Build Node.js server
- Create REST API endpoints
- Implement login/register logic
- Handle password hashing
- Implement JWT tokens
- Input validation
- Authorization middleware
- Booking & payment logic

## 🚀 Server Setup

```bash
npm install
npm install express cors dotenv jsonwebtoken bcrypt nodemon
```

## 🔑 Authentication Routes

```
POST /register
POST /login
GET /profile
POST /logout
POST /bookings
GET /mechanics
POST /payments
```

## 🎨 Front-End Integration (Member 3)

### Responsibilities
- Landing page
- Login page
- Register page
- Dashboard UI
- Booking interface
- Mechanic listing
- Responsive design
- Form validation

# Authentication Tasks

- **Login endpoint**
- **Register endpoint**
- **Token generation**
- **Route protection**
- **Logout logic**

⚙ Setup Instructions

## Prerequisites

- **Node.js (v18+)**
- **MySQL 8+**
- **Git**
- **VS Code**

## Installation Steps

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mechanic-connect.git
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Database
```sql
CREATE DATABASE mechanic_connect;
USE mechanic_connect;
SOURCE database/database.sql;
```
### 4️⃣ Create `.env` File
```env
DB_HOST=localhost
DB_NAME=mechanic_connect
DB_USER=root
DB_PASSWORD=your_password
```
### 5️⃣ Start Server
```bash
npm run dev
```

| Requirement                 | Status      |
| --------------------------- | ----------- |
| Database schema design      | ✅ Completed |
| Relationships & constraints | ✅ Completed |
| Secure password storage     | ✅ Completed |
| Authentication system       | ✅ Completed |
| API endpoints               | ✅ Completed |
| Role-based authorization    | ✅ Completed |
| Booking logic               | ✅ Completed |
| Payment logic               | ✅ Completed |
| Front-end integration       | ✅ Completed |
| Documentation               | ✅ Completed |

# 👨‍💻 Team Contributions Summary

## Member 1 – Database
- Schema design
- Data integrity
- ERD & documentation
- Authentication structure

## Member 2 – Backend
- Express server
- REST API
- JWT authentication
- Middleware protection
- Booking & payment processing

## Member 3 – Frontend
- UI implementation
- API integration
- Form validation
- Error handling