# System API

Related documentation: [API Index](../API_INDEX.md)

## GET /

### Endpoint

- HTTP method: `GET`
- Route: `/`
- Short description: Return the API welcome message.
- Feature/module: System

### Authentication

| Item | Details |
| --- | --- |
| Access | Public |
| Required middleware | None |
| Required headers | None |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

None.

#### Validation Rules

None implemented.

#### Required Fields

None.

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Welcome to QuickBite API!",
  "code": 200
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `success` | Always `true` |
| `message` | Exact handler message |
| `code` | Always `200` |

### Error Responses

No handler-specific error responses are implemented for this endpoint.

### Examples

#### cURL

```bash
curl http://localhost:8081/
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Welcome to QuickBite API!",
  "code": 200
}
```

#### Example JSON Error Responses

No handler-specific error response is defined in the code for this endpoint.

### Notes

- The response body has no `data` field because `helpers.Success` receives `nil` and `data,omitempty` suppresses it.

## GET /health_check

### Endpoint

- HTTP method: `GET`
- Route: `/health_check`
- Short description: Check whether the server can still reach PostgreSQL.
- Feature/module: System

### Authentication

| Item | Details |
| --- | --- |
| Access | Public |
| Required middleware | None |
| Required headers | None |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

None.

#### Validation Rules

None implemented.

#### Required Fields

None.

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Server is healthy",
  "code": 200,
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.status` | Static string returned by handler |
| `data.database` | Static string returned when `database.Pool.Ping` succeeds |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `503` | `{"success":false,"message":"Database connection failed","code":503}` | `database.Pool.Ping` returns an error |

### Examples

#### cURL

```bash
curl http://localhost:8081/health_check
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Server is healthy",
  "code": 200,
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Database connection failed",
  "code": 503
}
```

### Notes

- The endpoint only checks database reachability with `database.Pool.Ping`.
- The repository contains a test for this handler in `internal/handlers/health_test.go`.
