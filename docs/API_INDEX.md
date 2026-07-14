# QuickBite API Documentation

This documentation was generated from the Go backend implementation in this repository. It reflects the behavior implemented in Echo handlers, middleware, models, validators, JWT utilities, and SQL usage. If a detail could not be determined from code, it is called out explicitly instead of inferred.

## Project Overview

- Stack: Go, Echo, pgx, PostgreSQL
- Base path: no API prefix is configured in `internal/routes/routes.go`
- Response envelopes:
  - Success responses use:

    ```json
    {
      "success": true,
      "message": "...",
      "code": 200,
      "data": {}
    }
    ```

  - Error responses use:

    ```json
    {
      "success": false,
      "message": "...",
      "code": 400
    }
    ```

- Global middleware configured in `cmd/api/main.go`:
  - Request logging
  - Panic recovery
  - CORS with Echo defaults
  - In-memory rate limiting: `20` requests per second
  - Context timeout: `30s`
- The codebase does not customize the timeout or rate-limit error payloads, so those framework-level responses are not enumerated below.
- Required environment variables at startup:
  - `DATABASE_URL`
  - `JWT_AUTH_URL`

## Authentication Overview

- Public endpoints:
  - `POST /register`
  - `POST /login`
  - `GET /`
  - `GET /menu`
  - `GET /health_check`
- Protected endpoints:
  - `POST /orders`
  - `PATCH /orders/:id/status`
  - `GET /orders/:id`
  - `DELETE /orders/:id`
  - `GET /profile`
- Admin-only endpoints:
  - `POST /menu`
  - `PATCH /menu/:id/availability`
  - `GET /orders`
- Protected routes require:

  ```http
  Authorization: Bearer <token>
  ```

- JWT implementation details from `internal/utils/jwt.go`:
  - Signing algorithm: `HS256`
  - Secret source: `JWT_AUTH_URL`
  - Claims include `user_id`
  - Expiration: `24 hours` from token issuance

## Documentation Files

- [Authentication](api/auth.md)
- [Menu](api/menu.md)
- [Orders](api/orders.md)
- [Profile](api/profile.md)
- [System](api/system.md)

## Endpoint Table

| Feature | Method | Route | Access | Documentation |
| --- | --- | --- | --- | --- |
| Authentication | `POST` | `/register` | Public | [auth.md](api/auth.md#post-register) |
| Authentication | `POST` | `/login` | Public | [auth.md](api/auth.md#post-login) |
| System | `GET` | `/` | Public | [system.md](api/system.md#get-) |
| Menu | `GET` | `/menu` | Public | [menu.md](api/menu.md#get-menu) |
| System | `GET` | `/health_check` | Public | [system.md](api/system.md#get-health_check) |
| Orders | `POST` | `/orders` | Protected | [orders.md](api/orders.md#post-orders) |
| Orders | `PATCH` | `/orders/:id/status` | Protected | [orders.md](api/orders.md#patch-ordersidstatus) |
| Orders | `GET` | `/orders/:id` | Protected | [orders.md](api/orders.md#get-ordersid) |
| Orders | `DELETE` | `/orders/:id` | Protected | [orders.md](api/orders.md#delete-ordersid) |
| Profile | `GET` | `/profile` | Protected | [profile.md](api/profile.md#get-profile) |
| Menu | `POST` | `/menu` | Admin | [menu.md](api/menu.md#post-menu) |
| Menu | `PATCH` | `/menu/:id/availability` | Admin | [menu.md](api/menu.md#patch-menuidavailability) |
| Orders | `GET` | `/orders` | Admin | [orders.md](api/orders.md#get-orders) |

## Documentation Audit

### Missing Endpoint Documentation

- None found.
- `internal/routes/routes.go` defines 13 concrete routes, and all 13 are documented in this `docs/` tree.

### Inconsistent Status Codes

- `POST /login`
  - On bind failure, the handler sends HTTP `500` but the JSON body contains `code: 400`.
  - Message returned: `"Invalid format request"`.
- `PATCH /orders/:id/status`
  - Returns HTTP `200` even when the target order does not exist because the handler does not check `RowsAffected()`.

### Missing Validation

- `PATCH /menu/:id/availability`
  - `UpdateAvailableMenuItems` has no validation tags.
  - If `is_available` is omitted, the bound Go bool stays `false` and the handler can update the record to unavailable.
- `PATCH /orders/:id/status`
  - The route parameter `:id` is not parsed or validated as an integer before the SQL update.
  - Malformed IDs can surface as a database error and return HTTP `500`.
- `POST /register`
  - The handler binds the full `User` struct, but there is no validation that rejects client-supplied `id` or `role`; the SQL insert ignores `id` and hardcodes role to `customer`.
- `POST /menu`
  - The handler binds the full `MenuItem` struct, but client-supplied `id` and `is_available` are ignored by the insert query.
- `POST /orders`
  - The handler binds the full `Order` struct, but only `menu_id`, `quantity`, and `notes` affect the created row. Other fields can be present in the payload and are overwritten or ignored.

### Potential Security Issues

- `GET /orders/:id`
  - Any authenticated user can fetch any order by numeric ID.
  - No ownership or admin check exists.
- `PATCH /orders/:id/status`
  - Any authenticated user can update any order status.
  - No ownership or admin check exists.
- `DELETE /orders/:id`
  - Any authenticated user can delete any order by numeric ID.
  - No ownership or admin check exists.
- CORS is enabled globally with Echo defaults.
  - The repository does not define a stricter allowlist in code.

### Missing Authentication

- No route in `internal/routes/routes.go` is unintentionally public based on the current implementation.
- The main issue is missing authorization scope on protected order endpoints, not missing route-level authentication.

### Database and Query Issues

- `internal/database/sql/schema.sql`
  - `orders` is created before `users`, even though `orders.user_id` references `users(id)`.
  - On a fresh PostgreSQL schema, this foreign key dependency can prevent schema creation.
- `internal/database/sql/schema.sql`
  - The reset section drops `orders` and `menu_items`, but not `users`.
- `GET /orders`
  - `rows.Close()` is not deferred.
- `GET /orders`
  - The handler does not check `rows.Err()` after iteration.
- `GET /menu`
  - The handler does not check `rows.Err()` after iteration.
- `POST /register`
  - Duplicate email conflicts are returned as a generic HTTP `500` instead of a more specific conflict response.
- `POST /login`
  - Missing-user detection uses string comparison (`"no rows in result set"`) instead of `pgx.ErrNoRows`.
- `POST /orders`
  - Menu lookup does not check `is_available`; unavailable items can still be ordered if the row exists.

### Discrepancies Between Implementation and These Docs

- None intentionally omitted.
- The docs preserve several surprising implementation details because they are present in source:
  - `POST /register` returns `"Password successfully created"`.
  - `POST /login` returns `"Successfull login"`.
  - `GET /orders/:id` and `GET /orders` return `menu_id: 0` and `user_id: 0` in serialized `Order` objects because those fields are never scanned from SQL.
