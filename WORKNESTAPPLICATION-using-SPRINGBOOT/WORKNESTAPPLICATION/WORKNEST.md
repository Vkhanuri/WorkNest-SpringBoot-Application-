# WorkNest Task Management System

## Overview

WorkNest is a comprehensive task management web application designed for organizations to streamline workflow and track productivity. The system provides role-based access control with separate interfaces for administrators and regular users. Administrators can manage users, create and assign tasks, and monitor overall system metrics, while users can view and update their assigned tasks with status tracking and commenting capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML, CSS, Bootstrap 5, and JavaScript
- **Structure**: Multi-page application with dedicated views for different user roles
- **Authentication Flow**: JWT token-based authentication stored in localStorage
- **Role-based Routing**: Separate dashboards for admin (`/admin`) and user (`/user`) roles
- **Responsive Design**: Bootstrap-based responsive layout with custom CSS styling

### Backend Architecture->Future enhancements
- **Framework**: Node.js with Express.js web framework
- **Architecture Pattern**: MVC (Model-View-Controller) pattern
- **Authentication**: JWT (JSON Web Tokens) with role-based access control
- **API Design**: RESTful API endpoints organized by resource (auth, users, tasks, dashboard)
- **Middleware**: CORS support, body parsing, and custom authentication middleware
- **File Structure**: Modular organization with separate controllers, models, config, repository, security and service

### Database Design
- **Technology**: MySql Database
- **Schema**: Three main tables with referential integrity
  - **users**: Stores user information with role-based access (admin/user)
  - **tasks**: Task management with status tracking and user assignment
  - **comments**: Task-specific commenting system
- **Relationships**: Foreign key constraints ensuring data integrity
- **Initialization**: Automatic table creation and default admin user setup

### Authentication & Authorization
- **Strategy**: JWT-based authentication with role-based access control
- **Password Security**: bcryptjs for password hashing and validation
- **Token Management**: 24-hour token expiration with Bearer token authorization
- **Route Protection**: Middleware-based authentication checks with admin-only route restrictions
- **User Roles**: Two-tier system (admin, user) with distinct permissions

### API Structure
- **Authentication Routes** (`/api/auth`): Registration, login, logout, profile management
- **User Management** (`/api/users`): CRUD operations for user accounts (admin-only)
- **Task Management** (`/api/tasks`): Task creation, assignment, status updates, and commenting
- **Dashboard Routes** (`/api/dashboard`): Role-specific statistics and metrics

## External Dependencies

### Core Backend Dependencies->Future enhancements
- **express**: Web application framework for Node.js
- **pg**: PostgreSQL client for Node.js
- **bcryptjs**: Password hashing and validation library
- **jsonwebtoken**: JWT token generation and verification
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management
- **body-parser**: HTTP request body parsing middleware

### Frontend Dependencies
- **Bootstrap 5**: CSS framework for responsive design and UI components
- **Font Awesome 6**: Icon library for enhanced user interface
- **Native JavaScript**: No frontend frameworks, using vanilla JavaScript for DOM manipulation

### Database Requirements
- **MysqlSQL**: Primary database system requiring connection string via `DATABASE_URL` environment variable
- **SSL Configuration**: Currently disabled for development (ssl: false in pool configuration)

### Environment Configuration
- **DATABASE_URL**: MysqlSQL connection string
- **JWT_SECRET**: Secret key for JWT token signing (defaults to hardcoded value if not provided)
- **PORT**: Server port configuration (defaults to 5000)
