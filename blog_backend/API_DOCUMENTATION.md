# Blog Platform API Documentation

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register/`
- **Body:** `{"username": "string", "email": "string", "password": "string"}`
- **Response:** `{"user": {...}, "access": "token", "refresh": "token"}`

### Login User
- **POST** `/api/auth/login/`
- **Body:** `{"username": "string", "password": "string"}`
- **Response:** `{"access": "token", "refresh": "token", "user": {...}}`

## Posts Endpoints

### List Posts
- **GET** `/api/posts/`
- **Response:** `{"count": 10, "results": [...]}`

### Create Post
- **POST** `/api/posts/` (Auth required)
- **Body:** `{"title": "string", "content": "string"}`

### Get Post Detail
- **GET** `/api/posts/{id}/`

### Update Post
- **PUT** `/api/posts/{id}/` (Auth required)

### Delete Post
- **DELETE** `/api/posts/{id}/` (Auth required)

## Comments Endpoints

### List Comments for Post
- **GET** `/api/posts/{post_id}/comments/`

### Create Comment
- **POST** `/api/posts/{post_id}/comments/` (Auth required)