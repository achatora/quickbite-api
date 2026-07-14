# Menu API

Related documentation: [API Index](../API_INDEX.md), [Orders](orders.md)

## GET /menu

### Endpoint

- HTTP method: `GET`
- Route: `/menu`
- Short description: Return all menu items.
- Feature/module: Menu

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
  "message": "Success, menu retrieved",
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "Double Bacon Cheeseburger",
      "description": "Two smash patties, crispy bacon, cheddar, house sauce.",
      "price": 12.99,
      "is_available": true
    }
  ]
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data` | Array of `menu_items` rows |
| `data[].id` | Menu item ID |
| `data[].name` | Menu item name |
| `data[].description` | Menu item description |
| `data[].price` | Menu item price |
| `data[].is_available` | Availability flag from the database |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `500` | `{"success":false,"message":"Failed to process data","code":500}` | Menu query fails or row scan fails |

### Examples

#### cURL

```bash
curl http://localhost:8081/menu
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Success, menu retrieved",
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "Double Bacon Cheeseburger",
      "description": "Two smash patties, crispy bacon, cheddar, house sauce.",
      "price": 12.99,
      "is_available": true
    }
  ]
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Failed to process data",
  "code": 500
}
```

### Notes

- The SQL query is `SELECT id, name, description, price, is_available FROM menu_items`.
- No filtering is applied, so unavailable items are returned too.
- No pagination, sorting, or search parameters are implemented.

## POST /menu

### Endpoint

- HTTP method: `POST`
- Route: `/menu`
- Short description: Create a new menu item.
- Feature/module: Menu

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected admin-only |
| Required middleware | `middleware.AuthMiddleware`, then `middleware.AdminMiddleware` |
| Required headers | `Authorization: Bearer <token>`. Example requests also use `Content-Type: application/json`. |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.MenuItem`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `name` | string | Yes | `required,min=2,max=100` | Persisted |
| `description` | string | No | `omitempty,max=500` | Persisted |
| `price` | number | Yes | `required,gt=0,lt=10000` | Persisted |
| `is_available` | boolean | No | None | Bound if present, but ignored by the insert query |
| `id` | integer | No | None | Bound if present, but ignored by the insert query |

#### Validation Rules

- Validation failures return the raw `err.Error()` string from the validator.

#### Required Fields

- `name`
- `price`

#### Optional Fields

- `description`
- `is_available`
- `id`

### Success Responses

#### HTTP 201 Created

```json
{
  "success": true,
  "message": "Menu item successfully created",
  "code": 201,
  "data": {
    "id": 13,
    "name": "Seasonal Lemonade",
    "description": "Fresh lemonade with mint.",
    "price": 4.25,
    "is_available": true
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.id` | Generated menu item ID |
| `data.name` | Stored menu item name |
| `data.description` | Stored description |
| `data.price` | Stored price |
| `data.is_available` | Database-returned availability flag; defaults to `true` unless the table default changes |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `500` | `{"success":false,"message":"User ID not found","code":500}` | `AuthMiddleware` did not provide a usable `user_id` to `AdminMiddleware` |
| `500` | `{"success":false,"message":"Failed to get user role","code":500}` | Admin role lookup query fails |
| `403` | `{"success":false,"message":"Forbidden: admin access required","code":403}` | Authenticated user role is not `admin` |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Echo bind fails |
| `400` | `{"success":false,"message":"<validator error string>","code":400}` | Validation fails for `name`, `description`, or `price` |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Insert query fails |

### Examples

#### cURL

```bash
curl -X POST http://localhost:8081/menu \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Seasonal Lemonade",
    "description": "Fresh lemonade with mint.",
    "price": 4.25
  }'
```

#### Example JSON Request

```json
{
  "name": "Seasonal Lemonade",
  "description": "Fresh lemonade with mint.",
  "price": 4.25
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Menu item successfully created",
  "code": 201,
  "data": {
    "id": 13,
    "name": "Seasonal Lemonade",
    "description": "Fresh lemonade with mint.",
    "price": 4.25,
    "is_available": true
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Forbidden: admin access required",
  "code": 403
}
```

```json
{
  "success": false,
  "message": "Key: 'MenuItem.Price' Error:Field validation for 'Price' failed on the 'gt' tag",
  "code": 400
}
```

### Notes

- The insert query stores only `name`, `description`, and `price`.
- `is_available` is returned from PostgreSQL after insert and therefore follows the table default.
- The route is implemented as admin-only through middleware, not through a route prefix.

## PATCH /menu/:id/availability

### Endpoint

- HTTP method: `PATCH`
- Route: `/menu/:id/availability`
- Short description: Update a menu item's availability flag.
- Feature/module: Menu

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected admin-only |
| Required middleware | `middleware.AuthMiddleware`, then `middleware.AdminMiddleware` |
| Required headers | `Authorization: Bearer <token>`. Example requests also use `Content-Type: application/json`. |

### Request

#### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | integer | Yes | Parsed with `strconv.Atoi`; non-integer values return `400` |

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.UpdateAvailableMenuItems`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `is_available` | boolean | No | No field validation tags are defined | If omitted, Go's zero value is `false` |

#### Validation Rules

- The handler calls `validator.Validate.Struct`, but the struct has no validation tags.
- No explicit required-field validation exists for `is_available`.

#### Required Fields

None enforced by validation.

#### Optional Fields

- `is_available`

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Menu availability successfully updated",
  "code": 200
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `success` | Always `true` for this response |
| `message` | Exact handler message |
| `code` | Always `200` |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `500` | `{"success":false,"message":"User ID not found","code":500}` | `AuthMiddleware` did not provide a usable `user_id` to `AdminMiddleware` |
| `500` | `{"success":false,"message":"Failed to get user role","code":500}` | Admin role lookup query fails |
| `403` | `{"success":false,"message":"Forbidden: admin access required","code":403}` | Authenticated user role is not `admin` |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Echo bind fails |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Route parameter `id` cannot be parsed as an integer |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Update query fails |
| `404` | `{"success":false,"message":"Menu item not found","code":404}` | Update query affects zero rows |

### Examples

#### cURL

```bash
curl -X PATCH http://localhost:8081/menu/13/availability \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "is_available": false
  }'
```

#### Example JSON Request

```json
{
  "is_available": false
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Menu availability successfully updated",
  "code": 200
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Menu item not found",
  "code": 404
}
```

```json
{
  "success": false,
  "message": "Invalid request format",
  "code": 400
}
```

### Notes

- The SQL query is `UPDATE menu_items SET is_available = $1 WHERE id = $2`.
- The handler checks `RowsAffected()` and returns `404` for missing rows.
- Because `is_available` is not required, an empty JSON object can still result in an update to `false`.
