# Hands-on — Exercise Results

Run these requests in order after starting or restarting the server.

| Request | Expected Status |
| --- | --- |
| `GET /tasks` | **200 OK** |
| `POST /tasks (valid title)` | **201 Created** |
| `POST /tasks (empty title)` | **400 Bad Request** |
| `GET /tasks/999999` | **404 Not Found** |

A correct API response can indicate either success or a handled error.

## Expected responses

### 1. GET /tasks

Status: `200 OK`

```json
[]
```

### 2. POST /tasks (valid title)

Request body:

```json
{
  "title": "Learn REST"
}
```

Status: `201 Created`

```json
{
  "id": 1,
  "title": "Learn REST",
  "completed": false
}
```

### 3. POST /tasks (empty title)

Request body:

```json
{
  "title": ""
}
```

Status: `400 Bad Request`

```json
{
  "error": "Title is required"
}
```

### 4. GET /tasks/999999

Status: `404 Not Found`

```json
{
  "error": "Task not found"
}
```
