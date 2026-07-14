# Profile API

Related documentation: [API Index](../API_INDEX.md), [Authentication](auth.md)

## GET /profile

### Endpoint

- HTTP method: `GET`
- Route: `/profile`
- Short description: Return the authenticated user's profile.
- Feature/module: Profile

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected |
| Required middleware | `middleware.AuthMiddleware` |
| Required headers | `Authorization: Bearer <token>` |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

None.

#### Validation Rules

None implemented in the handler beyond JWT middleware.

#### Required Fields

None.

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "User profile found",
  "code": 200,
  "data": {
    "id": 7,
    "name": "Ava",
    "surname": "Stone",
    "email": "ava@example.com",
    "role": "customer"
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.id` | User ID from JWT claims stored in Echo context |
| `data.name` | `users.name` from database |
| `data.surname` | `users.surname` from database |
| `data.email` | `users.email` from database |
| `data.role` | `users.role` from database |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `500` | `{"success":false,"message":"User ID not found","code":500}` | `user_id` is missing or not an `int` in Echo context |
| `404` | `{"success":false,"message":"User not found","code":404}` | Query returns no row for the authenticated user ID |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Query fails for another reason |

### Examples

#### cURL

```bash
curl http://localhost:8081/profile \
  -H "Authorization: Bearer <token>"
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "User profile found",
  "code": 200,
  "data": {
    "id": 7,
    "name": "Ava",
    "surname": "Stone",
    "email": "ava@example.com",
    "role": "customer"
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "code": 401
}
```

```json
{
  "success": false,
  "message": "User not found",
  "code": 404
}
```

### Notes

- The handler reads `user_id` from JWT claims stored by `AuthMiddleware`.
- The SQL query is `SELECT name, surname, email, role FROM users WHERE id = $1`.
- The response uses a dedicated `UserProfileResponse` model, so no `password` field is returned.
