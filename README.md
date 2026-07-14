# QuickBite

QuickBite is a full-stack food ordering application with a Go REST API, a React frontend, and a PostgreSQL database. The backend exposes authentication, menu, profile, order, and admin endpoints, while the frontend provides a polished customer ordering flow with protected account and admin screens.

This README is based on the current repository implementation in `cmd/`, `internal/`, `frontend/`, `infrastructure/`, and `internal/database/sql/`.

## Project Overview

- Backend: Go 1.25, Echo, pgx, PostgreSQL, JWT authentication
- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, React Query, React Router
- Infrastructure: Docker Compose for PostgreSQL, pgAdmin, API, and frontend
- API base path: no `/api` prefix is configured

QuickBite supports:

- Customer registration and login
- Public menu browsing
- Cart and checkout flow in the frontend
- Authenticated order creation, order lookup, and order cancellation
- Read-only profile retrieval
- Admin-only menu management and order status updates

## Features

- JWT-based authentication with protected and admin-only routes
- Password hashing with `bcrypt`
- Menu item creation and availability toggling for admins
- Order creation tied to authenticated users
- Order status tracking with supported states:
  - `pending`
  - `preparing`
  - `ready for pickup`
  - `completed`
- API middleware for request logging, panic recovery, CORS, rate limiting, and request timeouts
- Frontend route protection for account, checkout, order tracking, and admin pages
- Cart persistence in `localStorage`
- Dockerized local stack with PostgreSQL and pgAdmin
- SQL schema and seed files in `internal/database/sql/`

## Tech Stack

### Backend

- Go `1.25`
- Echo `v4`
- pgx / pgxpool
- `go-playground/validator`
- `golang-jwt/jwt/v5`
- `bcrypt`

### Frontend

- React `19`
- TypeScript
- Vite `6`
- Tailwind CSS `4`
- React Router
- TanStack React Query
- Axios
- React Hook Form + Zod
- Framer Motion

### Infrastructure

- PostgreSQL `17` via Docker
- pgAdmin 4
- Nginx for the production frontend container

## Installation and Setup

### Prerequisites

- Go `1.25+`
- Node.js `22+`
- npm
- PostgreSQL
- Docker and Docker Compose (optional, but supported)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd quickbite-api
```

### 2. Configure environment variables

The API and Docker Compose setup read from a root `.env` file.
For local frontend development, Vite variables can be supplied from the shell or a `frontend/.env` file.

Create or update `.env` with the variables listed in the [Environment Variables](#environment-variables) section.

Example root `.env`:

```dotenv
DATABASE_URL=postgres://<user>:<password>@localhost:5432/<database>
JWT_AUTH_URL=<jwt-secret>
PORT=8081

POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<database>

PGADMIN_DEFAULT_EMAIL=<email>
PGADMIN_DEFAULT_PASSWORD=<password>
```

Optional `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8081
VITE_APP_NAME=QuickBite
```

### 3. Initialize the database

The repository includes raw SQL files instead of a migration tool:

- `internal/database/sql/schema.sql`
- `internal/database/sql/seed.sql`

Apply the schema before starting the API, and apply the seed file if you want sample menu data. Docker Compose does not automatically run these SQL files for you.

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

## Environment Variables

### Backend / API

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by `internal/database/db.go` |
| `JWT_AUTH_URL` | Yes | JWT signing secret used to generate and validate tokens |
| `PORT` | No | API port; defaults to `8081` if not set |

### Docker Compose / Database services

| Variable | Required | Description |
| --- | --- | --- |
| `POSTGRES_USER` | Yes for Compose | PostgreSQL username |
| `POSTGRES_PASSWORD` | Yes for Compose | PostgreSQL password |
| `POSTGRES_DB` | Yes for Compose | PostgreSQL database name |
| `PGADMIN_DEFAULT_EMAIL` | Yes for Compose | pgAdmin login email |
| `PGADMIN_DEFAULT_PASSWORD` | Yes for Compose | pgAdmin login password |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | API base URL; defaults to `http://localhost:8081` |
| `VITE_APP_NAME` | No | Display name; defaults to `QuickBite` |

## Running the Project

### Option A: Run locally

Start the backend:

```bash
go run ./cmd/api
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8081`

### Option B: Run with Docker Compose

From the repository root:

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

Default container-exposed URLs:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8081`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:8080`

Note: the first-time database setup is still manual because the Compose file does not mount `schema.sql` or `seed.sql` into PostgreSQL initialization hooks.

## Folder Structure

```text
.
├── cmd/api/                    # API entrypoint
├── docs/                       # Endpoint-focused API docs
├── frontend/                   # React frontend
│   ├── src/app/                # App providers and route definitions
│   ├── src/components/         # UI building blocks
│   ├── src/features/           # Feature modules (auth, menu, cart, checkout, orders, admin)
│   ├── src/services/           # API client and request functions
│   └── src/types/              # Shared frontend types
├── infrastructure/             # Docker Compose setup
├── internal/database/          # DB initialization and SQL files
├── internal/handlers/          # Echo request handlers
├── internal/helpers/           # Response helpers
├── internal/middleware/        # Auth and admin middleware
├── internal/models/            # Request/response/data models
├── internal/routes/            # Route registration
├── internal/utils/             # JWT utilities
└── Dockerfile.api              # API container image
```

## API Endpoints

Detailed endpoint writeups are also available in [docs/API_INDEX.md](docs/API_INDEX.md).

All responses use a common envelope:

```json
{
  "success": true,
  "message": "Example message",
  "code": 200,
  "data": {}
}
```

Error responses return:

```json
{
  "success": false,
  "message": "Example error",
  "code": 400
}
```

### Public

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Welcome endpoint |
| `GET` | `/health_check` | Health check with database ping |
| `POST` | `/register` | Create a customer account |
| `POST` | `/login` | Authenticate and receive a JWT |
| `GET` | `/menu` | List all menu items |

### Authenticated

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/orders` | Create an order |
| `GET` | `/orders/:id` | Get a single order status |
| `DELETE` | `/orders/:id` | Cancel an order owned by the authenticated user |
| `GET` | `/profile` | Retrieve the authenticated user's profile |

### Admin-only

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/menu` | Create a menu item |
| `PATCH` | `/menu/:id/availability` | Toggle menu availability |
| `GET` | `/orders` | List all orders |
| `PATCH` | `/orders/:id/status` | Update an order status |

## Authentication

- Auth uses bearer tokens in the `Authorization` header:

```http
Authorization: Bearer <token>
```

- Tokens are signed with `HS256`
- JWTs include `user_id`
- Token expiry is `24` hours from issuance
- Admin access is enforced by looking up `users.role`
- The frontend stores the JWT and user payload in `localStorage` and clears the session on `401` responses

## Database

The current schema defines three tables:

### `users`

- `id`
- `name`
- `surname`
- `email`
- `password`
- `role`

### `menu_items`

- `id`
- `name`
- `description`
- `price`
- `is_available`
- `created_at`

### `orders`

- `id`
- `user_id`
- `menu_item_id`
- `item_name`
- `quantity`
- `notes`
- `total_price`
- `status`
- `created_at`

Sample menu records are provided in `internal/database/sql/seed.sql`.

## Example Usage

### Register a user

```bash
curl -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada",
    "surname": "Lovelace",
    "email": "ada@example.com",
    "password": "password123"
  }'
```

### Log in

```bash
curl -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "password123"
  }'
```

### Fetch the public menu

```bash
curl http://localhost:8081/menu
```

### Create an order

```bash
curl -X POST http://localhost:8081/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "menu_id": 1,
    "quantity": 2,
    "notes": "Extra pickles"
  }'
```

### Update an order status as an admin

```bash
curl -X PATCH http://localhost:8081/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "status": "preparing"
  }'
```

## Frontend Notes

- The frontend includes public pages for the homepage, menu, cart, login, and registration
- Protected frontend pages include account, checkout, order tracking, and admin
- The checkout form collects customer-facing details for the frontend confirmation flow, but the backend order API only receives `menu_id`, `quantity`, and `notes`
- The frontend includes an order history page, but the current backend does not expose a customer order-history list endpoint
- Menu imagery and category styling are currently frontend-derived; the backend only exposes menu text, price, and availability data

## Contributing

Contributions are welcome. A good workflow for this repository is:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the relevant checks
5. Open a pull request with a clear summary

For API changes, update the backend documentation in `docs/` as needed.

## License

No license file is currently included in this repository. If you plan to publish or reuse the project publicly, add an explicit license first.
