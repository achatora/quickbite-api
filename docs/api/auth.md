# Authentication API

Related documentation: [API Index](../API_INDEX.md), [Profile](profile.md), [Orders](orders.md)

## POST /register

### Endpoint

- HTTP method: `POST`
- Route: `/register`
- Short description: Create a new user account.
- Feature/module: Authentication

### Authentication

| Item | Details |
| --- | --- |
| Access | Public |
| Required middleware | None |
| Required headers | None are enforced by handler code. Example requests use `Content-Type: application/json`. |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.User`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | `required,min=2,max=50` | Persisted |
| `surname` | string | Yes | `required,min=2,max=50` | Persisted |
| `email` | string | Yes | `required,email,max=100` | Persisted |
| `password` | string | Yes | `required,min=8,max=15` | Persisted as bcrypt hash |
| `role` | string | No | `omitempty` | Bound if present, but SQL insert hardcodes role to `customer` |
| `id` | integer | No | None | Bound if present, but ignored by SQL insert |

#### Validation Rules

- Validation is performed with `go-playground/validator`.
- Validation failures return the raw `err.Error()` string from the validator.

#### Required Fields

- `name`
- `surname`
- `email`
- `password`

#### Optional Fields

- `role`
- `id`

### Success Responses

#### HTTP 201 Created

```json
{
  "success": true,
  "message": "Password successfully created",
  "code": 201,
  "data": {
    "id": 7,
    "name": "Ava",
    "surname": "Stone",
    "email": "ava@example.com",
    "password": "",
    "role": "customer"
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `success` | Always `true` for this response |
| `message` | Exact handler message |
| `code` | Mirrors the success status code |
| `data.id` | Newly generated database user ID |
| `data.name` | Stored first name |
| `data.surname` | Stored surname |
| `data.email` | Stored email |
| `data.password` | Always returned as empty string because the handler clears it before responding |
| `data.role` | Always returned as `customer` |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Echo bind fails |
| `400` | `{"success":false,"message":"<validator error string>","code":400}` | Validation fails for `name`, `surname`, `email`, or `password` |
| `500` | `{"success":false,"message":"Server error, failed to create password","code":500}` | bcrypt password hashing fails |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | User insert fails, including unique-email violations |

### Examples

#### cURL

```bash
curl -X POST http://localhost:8081/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ava",
    "surname": "Stone",
    "email": "ava@example.com",
    "password": "secret123"
  }'
```

#### Example JSON Request

```json
{
  "name": "Ava",
  "surname": "Stone",
  "email": "ava@example.com",
  "password": "secret123"
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Password successfully created",
  "code": 201,
  "data": {
    "id": 7,
    "name": "Ava",
    "surname": "Stone",
    "email": "ava@example.com",
    "password": "",
    "role": "customer"
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Invalid request format",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "Key: 'User.Password' Error:Field validation for 'Password' failed on the 'min' tag",
  "code": 400
}
```

### Notes

- Passwords are hashed with bcrypt before insert.
- The SQL query always stores role as `customer`.
- The response uses the full `User` model, so `password` is still present in JSON but as an empty string.
- There is no explicit duplicate-email handling; PostgreSQL uniqueness errors fall through to a generic HTTP `500`.

## POST /login

### Endpoint

- HTTP method: `POST`
- Route: `/login`
- Short description: Authenticate a user and return a JWT.
- Feature/module: Authentication

### Authentication

| Item | Details |
| --- | --- |
| Access | Public |
| Required middleware | None |
| Required headers | None are enforced by handler code. Example requests use `Content-Type: application/json`. |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.LoginRequest`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `email` | string | Yes | `required,email` | Used in user lookup |
| `password` | string | Yes | `required` | Compared against stored bcrypt hash |

#### Validation Rules

- Validation failures return the raw `err.Error()` string from the validator.

#### Required Fields

- `email`
- `password`

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Successfull login",
  "code": 200,
  "data": {
    "user": {
      "id": 7,
      "name": "Ava",
      "surname": "Stone",
      "email": "ava@example.com",
      "password": "",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.user` | Full user object fetched from the database, with `password` cleared to `""` before response |
| `data.token` | Signed JWT generated from the user ID |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `500` | `{"success":false,"message":"Invalid format request","code":400}` | Echo bind fails. HTTP status and JSON `code` are inconsistent in the implementation. |
| `400` | `{"success":false,"message":"<validator error string>","code":400}` | Validation fails for `email` or `password` |
| `404` | `{"success":false,"message":"User not found","code":404}` | Query returns no matching user |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Database lookup fails for a reason other than no rows |
| `401` | `{"success":false,"message":"Invalid credentials","code":401}` | bcrypt password comparison fails |
| `401` | `{"success":false,"message":"Invalid token, failed login request","code":401}` | JWT generation fails |

### Examples

#### cURL

```bash
curl -X POST http://localhost:8081/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ava@example.com",
    "password": "secret123"
  }'
```

#### Example JSON Request

```json
{
  "email": "ava@example.com",
  "password": "secret123"
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Successfull login",
  "code": 200,
  "data": {
    "user": {
      "id": 7,
      "name": "Ava",
      "surname": "Stone",
      "email": "ava@example.com",
      "password": "",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "User not found",
  "code": 404
}
```

```json
{
  "success": false,
  "message": "Invalid credentials",
  "code": 401
}
```

### Notes

- The user lookup query selects `id`, `name`, `surname`, `email`, `password`, and `role` from `users`.
- The handler detects a missing user by string-comparing the database error to `"no rows in result set"`.
- JWT signing uses `JWT_AUTH_URL` as the secret source and sets a `24` hour expiration.
- The response user object still includes a `password` field, but the value is always an empty string.
