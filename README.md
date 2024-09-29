# Warehouse Management System

This project is a warehouse management system built with **React** for the frontend and **Node.js**/**Express** for the backend. The system provides functionality for managing inventory, handling inbound and outbound shipments, and user management with role-based access.

## Features

- **Inventory Management**: Add, update, and search for products, managing categories and suppliers.
- **Inbound/Outbound Management**: Track incoming products with supplier info and outgoing products with customer info.
- **User Management**: Administer user roles (warehouse manager, operator), add/delete users, and assign roles.
- **Authentication**: JWT-based authentication with auto-logout after one hour of inactivity.
- **Responsive UI/UX**: Modern design with React-Table for data display and easy navigation.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/warehouse-management.git
   cd warehouse-management

2. **Install dependencies**:

   Frontend:
    ```bash
   cd client
   npm install
   ```

   Backend:
   ```bash
   cd server
   npm install
   ```

3. **Setup the database**:

   Create a MySQL database and update the connection details in the server/db.js file.

4. **Run the application**:

   Backend:
   ```bash
   cd server
   npm start
   ```

   Frontend:
   ```bash
   cd client
   npm start
   ```

## Technologies Used

  - Frontend: React, Tailwind CSS, React-Router, React-Table
  - Backend: Node.js, Express, MySQL, JWT
  - Authentication: JSON Web Token (JWT)
  - Database: MySQL

## License
This project is licensed under the MIT License.
