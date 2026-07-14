# Orders API

Related documentation: [API Index](../API_INDEX.md), [Menu](menu.md), [Authentication](auth.md)

## POST /orders

### Endpoint

- HTTP method: `POST`
- Route: `/orders`
- Short description: Create a new order from an existing menu item.
- Feature/module: Orders

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected |
| Required middleware | `middleware.AuthMiddleware` |
| Required headers | `Authorization: Bearer <token>`. Example requests also use `Content-Type: application/json`. |

### Request

#### Path Parameters

None.

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.Order`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `menu_id` | integer | Yes | `required,gt=0,lt=10000` | Used to look up `name` and `price` from `menu_items` |
| `quantity` | integer | Yes | `required,gt=0,lt=21` | Used to compute total price |
| `notes` | string | No | `omitempty,max=500` | Persisted |
| `id` | integer | No | None | Bound if present, but ignored and replaced by database-generated ID |
| `user_id` | integer | No | None | Bound if present, but overwritten from the authenticated `user_id` stored in Echo context |
| `item_name` | string | No | None | Bound if present, but overwritten from `menu_items.name` |
| `total_price` | number | No | None | Bound if present, but overwritten from lookup price × quantity |
| `status` | string | No | None | Bound if present, but overwritten to `pending` |

#### Validation Rules

- Validation failures return the raw `err.Error()` string from the validator.

#### Required Fields

- `menu_id`
- `quantity`

#### Optional Fields

- `notes`
- `id`
- `user_id`
- `item_name`
- `total_price`
- `status`

### Success Responses

#### HTTP 201 Created

```json
{
  "success": true,
  "message": "Order successfully created",
  "code": 201,
  "data": {
    "id": 22,
    "menu_id": 1,
    "user_id": 7,
    "item_name": "Double Bacon Cheeseburger",
    "quantity": 2,
    "notes": "No onions",
    "total_price": 25.98,
    "status": "pending"
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.id` | Generated order ID |
| `data.menu_id` | Menu item ID from request |
| `data.user_id` | The authenticated user ID read from Echo context |
| `data.item_name` | Resolved from `menu_items.name` |
| `data.quantity` | Quantity from request |
| `data.notes` | Stored notes string |
| `data.total_price` | Computed as database price × quantity |
| `data.status` | Always set to `pending` on create |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Echo bind fails |
| `400` | `{"success":false,"message":"<validator error string>","code":400}` | Validation fails for `menu_id`, `quantity`, or `notes` |
| `404` | `{"success":false,"message":"Menu item not found","code":404}` | The `menu_items` lookup query returns no row |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | The authenticated `user_id` is missing or not an `int` in Echo context |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Insert query fails |

### Examples

#### cURL

```bash
curl -X POST http://localhost:8081/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_id": 1,
    "quantity": 2,
    "notes": "No onions"
  }'
```

#### Example JSON Request

```json
{
  "menu_id": 1,
  "quantity": 2,
  "notes": "No onions"
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Order successfully created",
  "code": 201,
  "data": {
    "id": 22,
    "menu_id": 1,
    "user_id": 7,
    "item_name": "Double Bacon Cheeseburger",
    "quantity": 2,
    "notes": "No onions",
    "total_price": 25.98,
    "status": "pending"
  }
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
  "message": "Invalid or expired token",
  "code": 401
}
```

### Notes

- The handler reads `user_id` from Echo context, which is populated by `middleware.AuthMiddleware`.
- `menu_items.is_available` is not checked before order creation.
- The insert query persists `user_id`, `menu_item_id`, `item_name`, `quantity`, `notes`, `total_price`, and `status`.

## GET /orders/:id

### Endpoint

- HTTP method: `GET`
- Route: `/orders/:id`
- Short description: Fetch one order by ID.
- Feature/module: Orders

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected |
| Required middleware | `middleware.AuthMiddleware` |
| Required headers | `Authorization: Bearer <token>` |

### Request

#### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | integer | Yes | Parsed with `strconv.Atoi`; non-integer values return `400` |

#### Query Parameters

None.

#### Request Body

None.

#### Validation Rules

- Only the path parameter is validated in handler code.

#### Required Fields

- Path parameter `id`

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Order status retrieved successfully",
  "code": 200,
  "data": {
    "id": 22,
    "menu_id": 0,
    "user_id": 0,
    "item_name": "Double Bacon Cheeseburger",
    "quantity": 2,
    "notes": "No onions",
    "total_price": 25.98,
    "status": "pending"
  }
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data.id` | Order ID from the `orders` table |
| `data.menu_id` | Always `0` in this response shape because the handler does not select `menu_item_id` |
| `data.user_id` | Always `0` in this response shape because the handler does not select `user_id` |
| `data.item_name` | Stored item name |
| `data.quantity` | Stored quantity |
| `data.notes` | Stored notes |
| `data.total_price` | Stored total price |
| `data.status` | Stored order status |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Route parameter `id` cannot be parsed as an integer |
| `404` | `{"success":false,"message":"Order not found","code":404}` | Query returns no row for the given order ID |
| `500` | `{"success":false,"message":"Server error, failed to retrieve status update","code":500}` | Query fails for another reason |

### Examples

#### cURL

```bash
curl http://localhost:8081/orders/22 \
  -H "Authorization: Bearer <token>"
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Order status retrieved successfully",
  "code": 200,
  "data": {
    "id": 22,
    "menu_id": 0,
    "user_id": 0,
    "item_name": "Double Bacon Cheeseburger",
    "quantity": 2,
    "notes": "No onions",
    "total_price": 25.98,
    "status": "pending"
  }
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Order not found",
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

- The SQL query is `SELECT id, item_name, quantity, notes, total_price, status FROM orders WHERE id = $1`.
- No ownership or admin check is performed after authentication.
- The response serializes the full `Order` model even though `menu_id` and `user_id` are not selected, so both fields remain `0`.

## PATCH /orders/:id/status

### Endpoint

- HTTP method: `PATCH`
- Route: `/orders/:id/status`
- Short description: Update an order's status.
- Feature/module: Orders

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected |
| Required middleware | `middleware.AuthMiddleware` |
| Required headers | `Authorization: Bearer <token>`. Example requests also use `Content-Type: application/json`. |

### Request

#### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string in handler, intended to be order ID | Yes | The handler does not validate the route parameter before executing SQL |

#### Query Parameters

None.

#### Request Body

The handler binds the request into `models.UpdateStatusInput`.

| Field | Type | Required | Validation | Notes |
| --- | --- | --- | --- | --- |
| `status` | string | Yes | `required` plus manual whitelist check | Must be one of `pending`, `preparing`, `ready for pickup`, `completed` |

#### Validation Rules

- Validator check: `required`
- Manual whitelist check:
  - `pending`
  - `preparing`
  - `ready for pickup`
  - `completed`

#### Required Fields

- `status`

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Order 22 status updated to preparing",
  "code": 200
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `message` | Built from the raw route parameter and the accepted status |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Echo bind fails |
| `400` | `{"success":false,"message":"<validator error string>","code":400}` | `status` is missing |
| `400` | `{"success":false,"message":"Invalid status value","code":400}` | `status` is not in the allowed whitelist |
| `500` | `{"success":false,"message":"Server error, order status not updated","code":500}` | SQL update fails, including malformed `id` values that surface as database errors |

### Examples

#### cURL

```bash
curl -X PATCH http://localhost:8081/orders/22/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "preparing"
  }'
```

#### Example JSON Request

```json
{
  "status": "preparing"
}
```

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Order 22 status updated to preparing",
  "code": 200
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Invalid status value",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "Server error, order status not updated",
  "code": 500
}
```

### Notes

- The SQL query is `UPDATE orders SET status = $1 WHERE id = $2`.
- The handler does not check `RowsAffected()`, so updating a non-existent order still returns HTTP `200`.
- No ownership or admin check is performed after authentication.

## DELETE /orders/:id

### Endpoint

- HTTP method: `DELETE`
- Route: `/orders/:id`
- Short description: Delete an order by ID.
- Feature/module: Orders

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected |
| Required middleware | `middleware.AuthMiddleware` |
| Required headers | `Authorization: Bearer <token>` |

### Request

#### Path Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | integer | Yes | Parsed with `strconv.Atoi`; non-integer values return `400` |

#### Query Parameters

None.

#### Request Body

None.

#### Validation Rules

- Only the path parameter is validated in handler code.

#### Required Fields

- Path parameter `id`

#### Optional Fields

None.

### Success Responses

#### HTTP 200 OK

```json
{
  "success": true,
  "message": "Order 22 has been cancelled",
  "code": 200
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `message` | Built from the raw route parameter string |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `400` | `{"success":false,"message":"Invalid request format","code":400}` | Route parameter `id` cannot be parsed as an integer |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Delete query fails |
| `404` | `{"success":false,"message":"Order not found","code":404}` | Delete query affects zero rows |

### Examples

#### cURL

```bash
curl -X DELETE http://localhost:8081/orders/22 \
  -H "Authorization: Bearer <token>"
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Order 22 has been cancelled",
  "code": 200
}
```

#### Example JSON Error Responses

```json
{
  "success": false,
  "message": "Order not found",
  "code": 404
}
```

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "code": 401
}
```

### Notes

- The SQL query is `DELETE FROM orders WHERE id = $1`.
- No ownership or admin check is performed after authentication.

## GET /orders

### Endpoint

- HTTP method: `GET`
- Route: `/orders`
- Short description: Return all orders.
- Feature/module: Orders

### Authentication

| Item | Details |
| --- | --- |
| Access | Protected admin-only |
| Required middleware | `middleware.AuthMiddleware`, then `middleware.AdminMiddleware` |
| Required headers | `Authorization: Bearer <token>` |

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
  "message": "Orders retrieved successfully",
  "code": 200,
  "data": [
    {
      "id": 22,
      "menu_id": 0,
      "user_id": 0,
      "item_name": "Double Bacon Cheeseburger",
      "quantity": 2,
      "notes": "No onions",
      "total_price": 25.98,
      "status": "pending"
    }
  ]
}
```

Field descriptions:

| Field | Description |
| --- | --- |
| `data` | Array of `Order` objects |
| `data[].menu_id` | Always `0` in this response shape because `menu_item_id` is not selected |
| `data[].user_id` | Always `0` in this response shape because `user_id` is not selected |
| `data[].item_name` | Stored item name |
| `data[].quantity` | Stored quantity |
| `data[].notes` | Stored notes |
| `data[].total_price` | Stored total price |
| `data[].status` | Stored order status |

### Error Responses

| HTTP Status | Response Body | When It Occurs |
| --- | --- | --- |
| `401` | `{"success":false,"message":"Missing authorization header","code":401}` | `Authorization` header is missing |
| `401` | `{"success":false,"message":"Invalid authorization format","code":401}` | `Authorization` header is not `Bearer <token>` |
| `401` | `{"success":false,"message":"Invalid or expired token","code":401}` | JWT validation fails |
| `500` | `{"success":false,"message":"User ID not found","code":500}` | `AuthMiddleware` did not provide a usable `user_id` to `AdminMiddleware` |
| `500` | `{"success":false,"message":"Failed to get user role","code":500}` | Admin role lookup query fails |
| `403` | `{"success":false,"message":"Forbidden: admin access required","code":403}` | Authenticated user role is not `admin` |
| `500` | `{"success":false,"message":"Server error, failed to process data","code":500}` | Orders query fails or row scan fails |

### Examples

#### cURL

```bash
curl http://localhost:8081/orders \
  -H "Authorization: Bearer <token>"
```

#### Example JSON Request

No request body.

#### Example JSON Success Response

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "code": 200,
  "data": [
    {
      "id": 22,
      "menu_id": 0,
      "user_id": 0,
      "item_name": "Double Bacon Cheeseburger",
      "quantity": 2,
      "notes": "No onions",
      "total_price": 25.98,
      "status": "pending"
    }
  ]
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
  "message": "Server error, failed to process data",
  "code": 500
}
```

### Notes

- The SQL query is `SELECT id, item_name, quantity, notes, total_price, status FROM orders`.
- No filtering, pagination, or sorting is implemented.
- The handler does not close `rows` explicitly and does not check `rows.Err()` after iteration.
