# Node.js - Express.js - Passport.js - JWT Refresh Token Boilerplate 🚀

This project is a minimalist boilerplate for creating a Node.js application using Express.js, Passport.js for
authentication, and JWT for stateless authentication. It includes support for JWT refresh tokens to ensure seamless user
experience and enhanced security.

## Table of Contents 📚

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
    - [Register](#register)
    - [Login](#login)
    - [Get Current User](#get-current-user)
    - [Refresh Token](#refresh-token)
    - [Logout](#logout)
    - [Logout All Sessions](#logout-all-sessions)
    - [Get All Users](#get-all-users)
    - [Get User by ID](#get-user-by-id)
    - [Update User](#update-user)
    - [Delete User](#delete-user)
    - [Get All Posts](#get-all-posts)
    - [Get a Single Post](#get-a-single-post)
    - [Create a New Post](#create-a-new-post)
    - [Update an Existing Post](#update-an-existing-post)
    - [Delete a Post](#delete-a-post)
- [Middlewares](#middlewares)
    - [Authentication](#authentication)
    - [Request Validation](#request-validation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features ✨

- **Node.js**: Server-side JavaScript runtime. 🖥️
- **Express.js**: Web framework for Node.js. 🌐
- **Passport.js**: Authentication middleware for Node.js. 🔐
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism. 🛡️
- **Refresh Tokens**: Mechanism to refresh JWT tokens without requiring the user to re-authenticate. 🔄
- **Knex.js**: SQL query builder for relational databases. 🛠️
- **Cron Job**: Scheduler for periodic tasks in the application. ⏲️
- **Request Validation**: Ensures incoming request data adheres to expected formats using Zod. ✔️
- **SQLite**: Lightweight, disk-based relational database. 📦
- **Dotenv**: Loads environment variables from a `.env` file. 🌟

This template is ideal for beginners as it provides a simple and clean starting point without the complexity of ORM. It
uses Knex.js for SQL queries to keep things straightforward and SQLite for the database to avoid the need for a separate
database server.

### What is Refresh Token? 🤔

- A refresh token is a special kind of token that can be used to obtain a new access token after the access token has
  expired.
- Refresh tokens are long-lived, and they can be used to refresh the access token without requiring the user to
  re-authenticate.
- This mechanism improves the user experience by preventing the user from having to log in again after the access token
  expires.

**Warning:** ⚠️ This boilerplate does not use HTTP-only, same-site secure cookies for storing refresh and access tokens.
This design choice is intentional and aligns with common practices seen in educational tutorials. Many front-end JWT
implementation guides demonstrate storing tokens in local storage or session storage. However, for production
environments, it's strongly recommended to use secure cookies to protect tokens from XSS attacks, especially when
developing web applications.

## Installation 🛠️

1. Clone the repository:
    ```bash
    git clone https://github.com/onlyjscom/express-jwt-refresh-boilerplate.git
    cd express-jwt-refresh-boilerplate
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    PORT=3000
    JWT_SECRET_AT=your_jwt_secret
    JWT_SECRET_RT=your_jwt_refresh_secret
    ```

4. Run the database migrations:
    ```bash
    npm run db:migrate
    ```

5. Start the server:
    ```bash
    npm start
    ```

## Project Structure 🗂️

```
express-jwt-refresh-boilerplate
├── src
│   ├── database
│   │   ├── index.ts
│   │   ├── instance.ts
│   │   ├── migrations
│   │   │   ├── 20240716211511_create_users_table.ts
│   │   │   ├── 20240716211512_create_refresh_tokens_table.ts
│   │   │   └── 20240716211513_create_posts_table.ts
│   │   ├── parsers.ts
│   │   └── tables.ts
│   ├── index.ts
│   ├── middlewares
│   │   ├── authenticate.ts
│   │   ├── index.ts
│   │   └── validate-request.ts
│   ├── modules
│   │   ├── auth
│   │   │   ├── controller.ts
│   │   │   ├── index.ts
│   │   │   ├── passport.ts
│   │   │   ├── router.ts
│   │   │   ├── request-schemas.ts
│   │   │   ├── service.ts
│   │   │   └── types.ts
│   │   ├── posts
│   │   │   ├── controller.ts
│   │   │   ├── index.ts
│   │   │   ├── router.ts
│   │   │   ├── request-schemas.ts
│   │   │   ├── service.ts
│   │   │   ├── types.ts
│   │   │   └── field-validations.ts
│   │   └── users
│   │       ├── controller.ts
│   │       ├── index.ts
│   │       ├── router.ts
│   │       ├── request-schemas.ts
│   │       ├── service.ts
│   │       ├── types.ts
│   │       └── field-validations.ts
│   ├── tasks
│   │   ├── auth.ts
│   │   └── index.ts
│   └── utils
│       ├── common-field-validations.ts
│       ├── date-helpers.ts
│       ├── http-errors.ts
│       ├── index.ts
│       └── string-helpers.ts
├── db.sqlite
├── knexfile.ts
├── package.json
└── tsconfig.json
```

## Usage 🚀

You can import the Postman collection file in the repository root directory to test the API endpoints.
Alternatively, you can use the following documentation to interact with the API.

### Register

**Endpoint:** `POST /api/auth/register`

Registers a new user.

**Request Body:**

```json
{
  "username": "exampleuser",
  "password": "examplePassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

"role" field is optional. Available roles are "user" and "admin". Default role is "user" if not provided.

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "exampleuser",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T21:15:00.000Z"
  },
  "accessToken": "jwtAccessToken",
  "refreshToken": "jwtRefreshToken"
}
```

### Login

**Endpoint:** `POST /api/auth/login`

Logs in an existing user.

**Request Body:**

```json
{
  "username": "exampleuser",
  "password": "examplePassword"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "exampleuser",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T21:15:00.000Z"
  },
  "accessToken": "jwtAccessToken",
  "refreshToken": "jwtRefreshToken"
}
```

### Get Current User

**Endpoint:** `GET /api/auth/me`

Retrieves the current authenticated user's information.

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Response:**

```json
{
  "id": 1,
  "username": "exampleuser",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T21:15:00.000Z"
}
```

### Refresh Token

**Endpoint:** `POST /api/auth/refresh`

Refreshes the JWT access token using the refresh token.

**Request Headers:**

```plaintext
Authorization: Bearer jwtRefreshToken
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "exampleuser",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T21:15:00.000Z"
  },
  "accessToken": "newJwtAccessToken",
  "refreshToken": "newJwtRefreshToken"
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

Logs out the current user and revokes their refresh token.

**Request Headers:**

```plaintext
Authorization: Bearer jwtRefreshToken
```

**Response:**

```json
{
  "message": "Logged out"
}
```

### Logout All Sessions

**Endpoint:** `POST /api/auth/logout-all`

Logs out the current user from all sessions and revokes all their refresh tokens.

**Request Headers:**

```plaintext
Authorization: Bearer jwtRefreshToken
```

**Response:**

```json
{
  "message": "Logged out all sessions"
}
```

### Get All Users

**Endpoint:** `GET /api/users`

Retrieves a list of all users.

**Query Parameters:**

- `role`: Filter users by role. Available roles are "user" and "admin". (optional)

**Response:**

```json
[
  {
    "id": 1,
    "username": "exampleuser",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T21:15:00.000Z"
  },
  {
    "id": 2,
    "username": "verissimus",
    "firstName": "Marcus",
    "lastName": "Aurelius",
    "role": "admin",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T22:00:00.000Z"
  }
]
```

### Get User by ID

**Endpoint:** `GET /api/users/:id`

Retrieves the details of a user by their ID.

**Request Parameters:**

```plaintext
id: User's ID (integer)
```

**Response:**

```json
{
  "id": 1,
  "username": "exampleuser",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T21:15:00.000Z"
}
```

### Update User

**Endpoint:** `PUT /api/users/:id`

Updates the details of a user by their ID.

**Request Parameters:**

```plaintext
id: User's ID (integer)
```

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Request Body:**

```json
{
  "username": "newUsername",
  "password": "newPassword",
  "firstName": "newFirstName",
  "lastName": "newLastName",
  "role": "user"
}
```

All fields are optional.

**Response:**

```json
{
  "id": 1,
  "username": "newusername",
  "firstName": "Newfirstname",
  "lastName": "Newlastname",
  "role": "user",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T23:35:00.000Z"
}
```

### Delete User

**Endpoint:** `DELETE /api/users/:id`

Deletes a user by their ID.

**Request Parameters:**

```plaintext
id: User's ID (integer)
```

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Response:**

```json
{
  "message": "User deleted"
}
```

### Get All Posts

**Endpoint:** `GET /api/posts`

Retrieves a list of all posts.

**Query Parameters:**

- `userId`: Filter posts by user ID. (optional)

**Response:**

```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Post Title 1",
    "content": "Post content 1",
    "createdAt": "2024-07-16T21:15:00.000Z",
    "updatedAt": "2024-07-16T21:15:00.000Z"
  },
  {
    "id": 2,
    "userId": 1,
    "title": "Post Title 2",
    "content": "Post content 2",
    "createdAt": "2024-07-16T22:00:00.000Z",
    "updatedAt": "2024-07-16T22:15:00.000Z"
  },
  {
    "id": 3,
    "userId": 2,
    "title": "Post Title 3",
    "content": "Post content 3",
    "createdAt": "2024-07-17T15:15:00.000Z",
    "updatedAt": "2024-07-17T15:15:00.000Z"
  }
]
```

### Get a Single Post

**Endpoint:** `GET /api/posts/:id`

Retrieves a single post by its ID.

**Request Parameters:**

- `id`: The ID of the post to retrieve.

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "title": "Post Title",
  "content": "Post content",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T21:15:00.000Z"
}
```

### Create a New Post

**Endpoint:** `POST /api/posts`

Creates a new post.

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Request Body:**

```json
{
  "title": "New Post Title",
  "content": "New Post Content"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "title": "New Post Title",
  "content": "New Post Content",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T21:15:00.000Z"
}
```

### Update an Existing Post

**Endpoint:** `PUT /api/posts/:id`

Updates an existing post by its ID.

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Request Parameters:**

- `id`: The ID of the post to update.

**Request Body:**

```json
{
  "title": "Updated Post Title",
  "content": "Updated Post Content"
}
```

All fields are optional.

**Response:**

```json
{
  "id": 1,
  "userId": 1,
  "title": "Updated Post Title",
  "content": "Updated Post Content",
  "createdAt": "2024-07-16T21:15:00.000Z",
  "updatedAt": "2024-07-16T21:15:00.000Z"
}
```

### Delete a Post

**Endpoint:** `DELETE /api/posts/:id`

Deletes a post by its ID.

**Request Headers:**

```plaintext
Authorization: Bearer jwtAccessToken
```

**Request Parameters:**

- `id`: The ID of the post to delete.

**Response:**

```json
{
  "message": "Post deleted"
}
```

## Middlewares 🛡️

### Authentication

To protect routes, use the `authenticate` middleware:

```typescript
import { authenticate } from '../../middlewares';

app.get('/protected-route', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route' });
});
```

This middleware ensures that the request is authenticated using the JWT access token. If the token is valid, the user
information is attached to the request object, and the request is passed to the next middleware or route handler.

### Request Validation

To validate requests, use the `validateRequest` middleware:

```typescript
import { authenticate, validateRequest } from '../../middlewares';
import { postCreationRequestSchema } from './schemas';

app.post('/posts', [validateRequest(postCreationRequestSchema), authenticate], (req, res) => {
    // Handle post creation
});
```

This middleware uses Zod schemas to validate the incoming request data and ensures that only valid data is processed
further.

## Contributing 🤝

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙏

Special thanks to the authors of the libraries and tools used in this project. Your work is greatly appreciated!

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [Knex.js](https://knexjs.org/)
- [Node-cron](https://www.npmjs.com/package/node-cron)
- [Zod](https://zod.dev/)
- [SQLite](https://www.sqlite.org/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
