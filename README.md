# 🏋️ Gym Management System

An academic web development project built to digitize and simplify gym operations — member registration, membership plan management, trainer management, attendance tracking, and fee/payment records — through a centralized web-based system.

**Duration:** Aug 2025 – Nov 2025
**Category:** Web Development

## 📌 Overview

Gyms traditionally rely on manual registers to track members, fees, and attendance, which is error-prone and hard to maintain. This project replaces that manual process with a centralized system that lets staff manage members, trainers, membership plans, attendance, and payments from one dashboard.

## ✨ Features

- **Member Management** — Register, update, view, and remove gym members
- **Trainer Management** — Maintain trainer profiles, specialization, and salary details
- **Membership Plans** — Create and manage subscription plans (duration & pricing)
- **Attendance Tracking** — Mark and review daily member attendance
- **Payment Records** — Log and track member fee payments and their status
- **Dashboard** — At-a-glance stats: total members, trainers, plans, and monthly revenue
- Full **CRUD** (Create, Read, Update, Delete) operations across every module
- RESTful API backend connected to a MySQL relational database

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | HTML, CSS, JavaScript (Vanilla)      |
| Backend    | Node.js, Express.js                  |
| Database   | MySQL                                |
| Tools      | VS Code, Git/GitHub, Postman         |

## 📁 Project Structure

```
gym-management-system/
├── backend/
│   ├── config/
│   │   └── db.js                # MySQL connection pool
│   ├── database/
│   │   └── schema.sql           # Database schema + seed data
│   ├── routes/
│   │   ├── members.js
│   │   ├── trainers.js
│   │   ├── memberships.js
│   │   ├── attendance.js
│   │   └── payments.js
│   ├── .env.example             # Sample environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js               # Fetch wrapper for backend API calls
│   │   ├── dashboard.js
│   │   ├── members.js
│   │   ├── trainers.js
│   │   ├── memberships.js
│   │   ├── attendance.js
│   │   └── payments.js
│   ├── pages/
│   │   ├── members.html
│   │   ├── trainers.html
│   │   ├── memberships.html
│   │   ├── attendance.html
│   │   └── payments.html
│   └── index.html               # Dashboard (home page)
├── .gitignore
└── README.md
```

## 🗄️ Database Schema

The system uses 5 relational tables:

- **members** — member details, linked to a `membership` plan and a `trainer`
- **trainers** — trainer profiles
- **memberships** — subscription plans (name, duration, price)
- **attendance** — daily check-in records per member
- **payments** — fee payment history per member

See [`backend/database/schema.sql`](backend/database/schema.sql) for the full schema, including foreign key relationships and sample seed data.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (v8 or higher)
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/gym-management-system.git
cd gym-management-system
```

### 2. Set up the database

Open MySQL and run the schema file to create the database and tables:

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `gym_management_system` database along with all required tables and a small set of sample membership plans and trainers.

### 3. Configure environment variables

Navigate to the `backend` folder, copy the example env file, and fill in your MySQL credentials:

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=gym_management_system
DB_PORT=3306
```

### 4. Install dependencies

```bash
npm install
```

### 5. Run the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start at **http://localhost:5000** and will also serve the frontend, so you can open that URL directly in your browser to use the application.

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

| Module       | Method | Endpoint                    | Description              |
|--------------|--------|------------------------------|---------------------------|
| Members      | GET    | `/members`                  | Get all members           |
|              | GET    | `/members/:id`               | Get a single member       |
|              | POST   | `/members`                  | Create a member           |
|              | PUT    | `/members/:id`               | Update a member           |
|              | DELETE | `/members/:id`               | Delete a member           |
| Trainers     | GET/POST/PUT/DELETE | `/trainers[/:id]` | Full CRUD for trainers    |
| Memberships  | GET/POST/PUT/DELETE | `/memberships[/:id]` | Full CRUD for plans  |
| Attendance   | GET/POST/PUT/DELETE | `/attendance[/:id]` | Full CRUD + `/attendance/member/:memberId` |
| Payments     | GET/POST/PUT/DELETE | `/payments[/:id]`   | Full CRUD + `/payments/member/:memberId`   |

Import the routes into [Postman](https://www.postman.com/) to test the API independently of the frontend.

## 👥 Team

- **Team Size:** 2
- **My Contributions:** Requirement analysis, database design, frontend development, backend integration, and debugging

## ✅ Key Outcome

Successfully developed a functional web-based system that streamlined gym administration and improved the accessibility and organization of member and operational data — reducing dependency on manual, paper-based record keeping.

## 📄 License

This project was developed for academic purposes. Feel free to fork and adapt it for your own learning.
