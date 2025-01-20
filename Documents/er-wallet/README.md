# ER Wallet Application

A modern web application for tracking personal finances across multiple accounts, with features for budget management, expense categorization, and financial reporting.

## Features

- Track income and expenses across multiple accounts
- Categorize transactions with custom categories and subcategories
- Set and monitor budgets with notification alerts
- Generate visual reports and summaries
- Support for multiple account types (bank, mobile money, cash)

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Charts: Chart.js

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the backend directory with the following variables:

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Project Structure

```
er-wallet/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   ├── utils/
    │   └── styles/
    └── package.json
```
