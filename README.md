# Mini CRM

A simple full-stack CRM application built with the MERN stack (MongoDB, Express, React, Node.js) and Material UI (MUI).

---

## Tech Stack

- **Frontend**: React (Create React App), React Router v6, Axios, Material UI (MUI)
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT (Access Token) and bcryptjs

---

## Features

- **Authentication**: JWT-based login with input validation and API error display.
- **Main Layout**: Persistent sidebar across all pages (Dashboard, Leads, Companies, Tasks) with top bar displaying user name and logout.
- **Dashboard**: 4 business metric cards (Total Leads, Qualified Leads, Tasks Due Today, Completed Tasks) powered directly by MongoDB aggregation pipelines.
- **Leads Module**:
  - List leads with pagination, text search (name, email, phone), and status filtering.
  - Create and edit leads with user and company associations.
  - Soft delete: Deleting a lead sets `isDeleted: true` and excludes it from all normal queries.
- **Companies Module**:
  - List companies (Name, Industry, Location).
  - Create company.
  - View company detail with a list of associated active leads.
- **Tasks Module**:
  - Create and assign tasks to users and leads with due dates.
  - Task status toggle (Pending / Completed).
  - **Strict Authorization**: Only the user assigned to a task can update its status.

---

## Authorization Logic

The application implements token-based authentication and resource-level authorization:

1. **Authentication Middleware (`server/middleware/auth.js`)**:
   - Private routes inspect the `Authorization` header for `Bearer <token>`.
   - The token is verified using `jwt.verify()` with `process.env.JWT_SECRET`.
   - The user record is fetched from the database (excluding password) and attached to `req.user`.
   - Requests without a valid token receive HTTP 401 Unauthorized.

2. **Task Status Authorization (`server/controllers/taskController.js`)**:
   - When `PATCH /api/tasks/:id/status` is called, the server loads the task from MongoDB.
   - It verifies that the authenticated user's ID matches the task's assigned user ID:
     ```javascript
     if (task.assignedTo.toString() !== req.user._id.toString()) {
       return res.status(403).json({
         message: 'Forbidden: Only the assigned user is authorized to update the status of this task.',
       });
     }
     ```
   - If the IDs do not match, the server rejects the request with HTTP 403 Forbidden.
   - On the frontend, action buttons for unassigned tasks are disabled with a locked indicator, providing a clear visual representation of this restriction.

---

## Project Setup & Local Running

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://localhost:27017`

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Populates sample users, companies, leads, and tasks
npm start        # Starts Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm start        # Starts React app on http://localhost:3000
```

---

## Demo Accounts

The seed script creates the following accounts (all use the same password):

| User | Email | Password |
| :--- | :--- | :--- |
| John | john@crm.com | password123 |
| Ravi | ravi@crm.com | password123 |
| Sarah | sarah@crm.com | password123 |

---

## Deployment Notes

- **Backend (e.g. Render / Railway)**:
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `node server.js`
  - Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`

- **Frontend (e.g. Netlify / Vercel)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Publish directory: `client/build`
  - `_redirects` file is included in `public/` to handle single-page client-side routing (`/*  /index.html  200`).
