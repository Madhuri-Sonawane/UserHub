React User Management CRUD Application


📌 Overview

This is a React-based CRUD (Create, Read, Update, Delete) web application for managing user data.
The application communicates with a REST API and is designed with future extensibility in mind, allowing new form fields to be added with minimal code changes.

The project follows clean React coding standards, uses a configuration-driven form architecture, and provides proper input validation with a user-friendly UI.

✨ Features

Create, Read, Update, and Delete users

Required field validation for all inputs

Country code selection with phone number validation

Config-driven and extensible form structure

Clean UI using Material UI

Fully deployed frontend and backend

🧾 User Fields

The user form includes the following fields:

First Name (required)

Last Name (required)

Email Address (required, validated format)

Phone Number

Country code selected from the dropdown

Exactly 10-digit phone number validation

🔁 CRUD Operations

The application supports the following operations:

Create User

Read Users (list all users)

Update User

Delete User

🔌 API Details

The frontend communicates with a mock REST API powered by JSON Server, deployed separately for production use.

Backend Base URL
https://react-crud-json-server-ljgs.onrender.com

Endpoints
Method	Endpoint	Description
GET	/users	Fetch all users
POST	/users	Create new user
PUT	/users/:id	Update user
DELETE	/users/:id	Delete user

Axios is used for HTTP requests, and the API layer is abstracted to allow easy backend replacement in the future.

🧠 Extensibility (Key Design Decision)

The form is built using a configuration-driven approach.

Example: Adding a New Field

Open:

src/config/userFormConfig.js


Add a new field:

{
  name: "dob",
  label: "Date of Birth",
  type: "date",
  required: false
}


✅ No changes required in:

Form UI logic

Validation logic

API integration

This ensures scalability and maintainability.

🌍 Country Code & Phone Validation

Country codes are selected from a dropdown list

Phone number input accepts only digits

Exactly 10 digits are required

Stored phone format:

+<countryCode><10-digit-number>


This avoids invalid country codes and improves user experience.

🎨 UI & UX

Built using Material UI

Clean layout with top navigation

Separate views for:

Add/Edit User

User List

Hover effects on buttons and cards

Delete confirmation dialog

🛠️ Tech Stack

Frontend: React (Vite)

UI Library: Material UI

HTTP Client: Axios

Backend: JSON Server (hosted)

Language: JavaScript

⚙️ Setup Instructions (Local)
git clone https://github.com/Madhuri-Sonawane/ReactCrudApp
cd ReactCrudApp
npm install
npm run dev

🚀 Deployment

Frontend: Vercel
👉 https://react-crud-app-gamma-nine.vercel.app/

Backend: JSON Server hosted on Render

📌 Assumptions & Design Decisions

JSON Server is used as a mock backend for development and production

Country code validation is handled via a dropdown instead of a regex

Phone number length standardized to 10 digits

Frontend is API-agnostic for easy backend replacement

👤 Author

Madhuri Rajendra Sonawane
