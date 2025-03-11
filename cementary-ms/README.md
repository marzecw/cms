# Cemetery Management System

A comprehensive cemetery management system built with NestJS and PostgreSQL. This system is designed to manage cemetery operations, including tenant management, cemetery hierarchy, customer management, reservations, interments, billing, and maintenance.

## Features

- Multi-tenant architecture
- User authentication with JWT
- Cemetery hierarchy management (Cemetery -> Garden -> Lot -> Space -> Level)
- Customer management
- Reservation and interment tracking
- Billing and payment processing
- Maintenance logging

## Tech Stack

- NestJS - A progressive Node.js framework for building efficient and scalable server-side applications
- TypeORM - An ORM for TypeScript and JavaScript
- PostgreSQL - A powerful, open source object-relational database system
- JWT - JSON Web Tokens for authentication
- Swagger - API documentation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cemetery-management-system.git
cd cemetery-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Create a PostgreSQL database:

```sql
CREATE DATABASE cemetery_management;
```

4. Configure environment variables:

Create a `.env` file in the root directory with the following content:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=cemetery_management

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Application Configuration
PORT=3000
NODE_ENV=development
```

5. Run the application:

```bash
npm run start:dev
```

The application will be available at http://localhost:3000.

### API Documentation

Swagger documentation is available at http://localhost:3000/api.

## Database Schema

The database schema consists of the following tables:

- `tenants` - Stores information about tenants in the system
- `users` - Stores user information for authentication
- `cemeteries` - Represents the overall cemetery facility
- `gardens` - Subdivisions within a cemetery
- `lots` - Further subdivisions within a garden
- `spaces` - Specific areas or units within a lot
- `space_levels` - Actual burial spaces within a space
- `customers` - Stores information about individuals or families
- `reservations` - Tracks reservations for a specific space level
- `deceased` - Records for individuals interred
- `interments` - Captures burial events linking a deceased record to a space level
- `billing_invoices` - Stores invoice details for billing customers
- `billing_items` - Provides detailed line items for each invoice
- `payments` - Records payment transactions against invoices
- `maintenance_logs` - Records maintenance activities at any hierarchical level

## License

This project is licensed under the MIT License - see the LICENSE file for details.
