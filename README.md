# 💜 Coy Discover

### A Swipe-Based Social Discovery Platform

Coy Discover is a modern, responsive social discovery web application that allows users to explore profiles, express interest through Like and Pass actions, and discover mutual matches through an interactive swipe-based experience.

The project is developed using React, Node.js, Express.js, and SQLite, with a focus on interactive UI, backend API integration, and persistent data storage.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Installation and Setup](#-installation-and-setup)
6. [Running the Application](#-running-the-application)
7. [API Documentation](#-api-documentation)
8. [Database Design](#-database-design)
9. [Testing and Validation](#-testing-and-validation)
10. [Current Project Scope](#-current-project-scope)
11. [Developer](#-developer)

---

## 📖 Project Overview

Coy Discover provides an interactive profile discovery experience where users can:

- Explore different mock user profiles.
- Like or Pass on profiles.
- Swipe profiles left or right on mobile devices.
- Receive a match notification when mutual interest is detected.
- View matched profiles in a separate Matches section.

The application uses a React frontend connected to an Express backend through REST APIs. SQLite is used to store profile and swipe information.

---

## ✨ Features

### 1. Profile Discovery

- Displays 30 mock user profiles.
- Shows profile information including:
  - Name
  - Age
  - Profile photo
  - Bio
  - City
  - College
  - Interests
- Loads available profiles from the backend API.

### 2. Like and Pass Functionality

- Like profiles to express interest.
- Pass on profiles that are not of interest.
- Prevents duplicate swipe actions.
- Removes already-swiped profiles from the discovery feed.
- Saves swipe actions in the database.

### 3. Swipe Interaction

- Left and right drag interactions on mobile devices.
- Separate Like and Pass action buttons.
- Smooth profile transition animations.

### 4. Match System

- Detects a match when a liked profile has its mock `likedYou` property set to true.
- Displays a match notification popup.
- Provides a separate Matches section.
- Displays profiles that satisfy the application's match conditions.

### 5. Database Integration

- SQLite database integration using Better-SQLite3.
- Stores profile and swipe records.
- Imports initial profile data from JSON.
- Checks and migrates existing swipe records during backend startup.
- Maintains swipe records after page refresh and backend restart.

### 6. Responsive User Interface

- Modern dark-themed design.
- Smooth animations using Framer Motion.
- Responsive layout for mobile and desktop devices.
- Interactive navigation between application sections.

---

## 🛠️ Technology Stack

| Category          | Technologies   |
| ----------------- | -------------- |
| Frontend          | React.js       |
| Build Tool        | Vite           |
| Styling           | CSS3           |
| Animations        | Framer Motion  |
| Icons             | Lucide React   |
| Backend           | Node.js        |
| Backend Framework | Express.js     |
| Database          | SQLite         |
| Database Library  | Better-SQLite3 |
| API Communication | REST APIs      |
| Version Control   | Git and GitHub |

---

## 📂 Project Structure

```text
Coy-Discover/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── data/
│   │   ├── profile.json
│   │   └── swipes.json
│   │
│   ├── src/
│   │   ├── database.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- A code editor such as Visual Studio Code

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/Bachan-rajput/coy-discover.git
```

Navigate to the project directory:

```bash
cd coy-discover
```

### Step 2: Install Backend Dependencies

Navigate to the server directory:

```bash
cd server
```

Install the dependencies:

```bash
npm install
```

### Step 3: Start the Backend Server

Run:

```bash
node src/server.js
```

The backend API will start at:

**http://localhost:5000**

Expected startup messages:

```text
Coy Discover SQLite database connected!
Existing swipes migration checked.
Coy Discover API running on http://localhost:5000
```

Keep this terminal running.

### Step 4: Install Frontend Dependencies

Open a second terminal in the project root directory.

Navigate to the client directory:

```bash
cd client
```

Install the dependencies:

```bash
npm install
```

### Step 5: Start the Frontend

Run:

```bash
npm run dev
```

The Vite development server will start at:

**http://localhost:5173**

Open the URL in your browser to access Coy Discover.

---

## 🚀 Running the Application

Both frontend and backend servers must run simultaneously.

| Component   | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:5000 |

**Terminal 1 – Backend**

```bash
cd server
node src/server.js
```

**Terminal 2 – Frontend**

```bash
cd client
npm run dev
```

---

## 🔗 API Documentation

The backend provides the following REST API endpoints.

### 1. API Status

**Endpoint:** `GET /`

Checks whether the backend API is running.

### 2. Get Discovery Feed

**Endpoint:** `GET /feed`

Retrieves available profiles that have not already been swiped.

### 3. Submit a Swipe

**Endpoint:** `POST /swipe`

Accepts Like or Pass actions for a profile.

**Request Headers:**

```http
Content-Type: application/json
```

**Example Request Body:**

```json
{
  "profileId": 1,
  "action": "like"
}
```

**Supported Actions:**

- `like`
- `pass`

The endpoint validates the profile and action, prevents duplicate swipes, stores the swipe record, and checks the mock match condition.

### 4. Get Matches

**Endpoint:** `GET /matches`

Returns profiles that satisfy the application's match conditions.

### API Validation Responses

| HTTP Status | Meaning                   |
| ----------- | ------------------------- |
| 400         | Invalid action or request |
| 404         | Profile not found         |
| 409         | Profile already swiped    |

---

## 🗄️ Database Design

Coy Discover uses SQLite through the Better-SQLite3 library.

The database contains two primary tables.

### 1. Profiles Table

Stores mock profile information.

| Field     | Description                    |
| --------- | ------------------------------ |
| id        | Unique profile ID              |
| name      | Profile name                   |
| age       | Profile age                    |
| photo     | Profile image                  |
| bio       | Profile description            |
| city      | City                           |
| college   | College                        |
| interests | Profile interests              |
| likedYou  | Mock mutual-interest indicator |

### 2. Swipes Table

Stores profile swipe actions.

| Field     | Description              |
| --------- | ------------------------ |
| id        | Unique swipe record ID   |
| profileId | ID of the swiped profile |
| action    | Like or Pass             |
| createdAt | Swipe creation timestamp |

The database uses a unique constraint on `profileId` to prevent duplicate swipe records.

### Initial Data Migration

The project includes JSON files as initial data sources:

- `profile.json`
- `swipes.json`

During backend startup:

1. SQLite database connection is established.
2. Initial profiles are imported when the profiles table is empty.
3. Existing swipe records are checked and migrated.
4. The Express API starts on port 5000.

---

## 🧪 Testing and Validation

The following functionalities have been tested during development:

| Test Case                              | Result |
| -------------------------------------- | ------ |
| Profile loading                        | Passed |
| Like functionality                     | Passed |
| Pass functionality                     | Passed |
| Mobile left/right swipe                | Passed |
| Match popup                            | Passed |
| Matches section                        | Passed |
| Duplicate Like prevention              | Passed |
| Duplicate Pass prevention              | Passed |
| Invalid action validation              | Passed |
| Non-existent profile validation        | Passed |
| Data persistence after refresh         | Passed |
| Data persistence after backend restart | Passed |

### API Validation Test Results

| Test               | Expected Response |
| ------------------ | ----------------- |
| Duplicate Like     | 409 Conflict      |
| Duplicate Pass     | 409 Conflict      |
| Invalid action     | 400 Bad Request   |
| Invalid profile ID | 404 Not Found     |

---

## ⚠️ Current Project Scope

Coy Discover is currently an internship assignment prototype.

- The application uses mock profile data.
- The `likedYou` property simulates mutual interest.
- The current match system is not connected to real registered user accounts.
- User authentication and actual account-to-account matching are not implemented.

---

## 👨‍💻 Developer

**Abhishek Kumar**

B.Tech – Computer Science Engineering

IIMT Engineering College, Meerut

**GitHub:** [Bachan-rajput](https://github.com/Bachan-rajput)

**Project Repository:** [Coy Discover](https://github.com/Bachan-rajput/coy-discover)

---

## 📄 Project Information

Developed as part of an internship assignment.

**Project Name:** Coy Discover

**Repository:** GitHub

**Development Status:** Core prototype implemented and tested.
