# Bank Transaction System (Node.js + MongoDB)

## Overview

This project is a backend banking system built using Node.js and MongoDB. It provides core financial functionalities such as user authentication, account management, transaction handling, and ledger tracking. The system ensures secure and consistent handling of account balances through authenticated routes and structured transaction recording.

## Features

* User registration and authentication (JWT-based)
* Account creation and retrieval
* Secure transaction processing
* Initial fund allocation for accounts
* Ledger-based transaction tracking
* Balance inquiry endpoints
* Middleware-based route protection

## Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB (Mongoose ODM)
* Authentication: JSON Web Tokens (JWT)
* Middleware: Custom authentication middleware

## Project Structure (High-Level)

```
/controllers
    authController.js
    transactionController.js
    accountController.js

/middleware
    authMiddleware.js

/models
    userModel.js
    accountModel.js
    transactionModel.js
    ledgerModel.js

/routes
    authRoutes.js
    transactionRoutes.js
    accountRoutes.js

/server.js
```

## API Endpoints

### Authentication Routes

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| POST   | /register | Register new user |
| POST   | /login    | Login user        |

### Transaction Routes

| Method | Endpoint      | Description                  |
| ------ | ------------- | ---------------------------- |
| POST   | /             | Create transaction           |
| POST   | /initialfunds | Add initial funds to account |

> Protected by authentication middleware

### Account Routes

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | /               | Create new account         |
| GET    | /getbalance/:id | Get account balance        |
| GET    | /getaccount     | Get user's account details |

> Protected by authentication middleware

## Authentication Flow

1. User registers via `/register`
2. User logs in via `/login`
3. Server returns JWT token
4. Token must be included in headers for protected routes:

   ```
   Authorization: Bearer <token>
   ```

## Ledger System

Each transaction is recorded in a ledger to maintain:

* Transaction history
* Auditability
* Consistency in balance updates

This ensures that all operations are traceable and verifiable.

## Installation

1. Clone the repository

```
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies

```
npm install
```

3. Setup environment variables
   Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Run the server

```
npm start
```

## Example Request

### Create Transaction

```
POST /api/transactions
Headers:
Authorization: Bearer <token>

Body:
{
  "fromAccount": "account_id",
  "toAccount": "account_id",
  "amount": 1000
}
```

## Key Design Considerations

* Atomic transaction handling to prevent inconsistent balances
* Middleware-based authentication for route security
* Separation of concerns (controllers, models, routes)
* Scalable structure for adding features like:

  * Transaction rollback
  * Multi-currency support
  * Rate limiting
  * Fraud detection

## Future Improvements

* Implement concurrency control (locks or transactions)
* Add unit and integration tests
* API rate limiting and monitoring
* Admin dashboard for audit logs

## Author

Aditya

---

This project demonstrates backend system design for financial applications with a focus on correctness, security, and extensibility.
