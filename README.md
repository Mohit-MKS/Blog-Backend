# Blog Backend API

A TypeScript + Express backend for a blog platform with:
- JWT-based authentication
- Role-based access control (Super Admin, Admin, User)
- Category and post management
- File upload support (memory upload + MongoDB storage)
- Email-based verification and password reset

## Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt (`bcryptjs`)
- Nodemailer
- Multer
- Express Validator

## Project Structure

```text
src/
  app.ts
  config/
  controllers/
  db/
  middlewares/
  models/
  routes/
  services/
  validators/
env/
  local.env
  development.env
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas (or compatible MongoDB instance)

## Installation

```bash
npm install
```

## Environment Configuration

Environment files are loaded from:

```text
env/<NODE_ENV>.env
```

For example, with `NODE_ENV=development`, the app loads `env/development.env`.

Add these keys:

```env
PORT=3000
ENV_VALUES_ENCRYPTED=true
MONGO_CONNECTION_URL=<encrypted full mongodb connection string>
JWT_SECRET=<jwt secret>
SENDER_EMAIL=<encrypted sender email>
SENDER_PASSWORD=<encrypted sender app password>
```

### Important notes

- By default, the app expects encrypted values for Mongo and sender creds (see `src/services/encryptionService.ts`).
- Set `ENV_VALUES_ENCRYPTED=false` to use raw/plain values directly (useful for local setup).
- Mongo supports both styles:
  - `MONGO_CONNECTION_URL`: full connection string (recommended)
  - Split Atlas style: `MONGO_URL` + `MONGO_PASSWORD` (legacy support)
- Local Mongo (no auth) example:
  - `ENV_VALUES_ENCRYPTED=false`
  - `MONGO_CONNECTION_URL=mongodb://127.0.0.1:27017/blogDB`

## Run the Project

```bash
# default
npm start

# local env (Windows cmd syntax used in package scripts)
npm run local

# development env
npm run dev
```

Server base URL:

```text
http://localhost:3000
```

API base path:

```text
/api/v1
```

## Authentication

Protected routes require:

```http
Authorization: Bearer <token>
```

Token is returned by `POST /api/v1/auth/signin`.

## API Endpoints

### Auth (`/api/v1/auth`)

- `POST /signup`
- `POST /signin`
- `POST /send-verification-email`
- `POST /verify-user`
- `POST /forgot-password-code`
- `POST /reset-password`
- `POST /change-password` (auth)
- `POST /update-profile` (auth)
- `POST /update-profile-pic` (auth, multipart `profilePic`)
- `GET /get-login-user` (auth)

### Categories (`/api/v1/category`)

All category routes require auth + admin/super-admin role.

- `GET /`
- `POST /`
- `PUT /:categoryId`
- `DELETE /:categoryId`
- `GET /:categoryId`

### Posts (`/api/v1/post`)

All post routes require auth.

- `POST /` (multipart `file`, body: `title`, `category`, optional `desc`)
- `GET /` (supports `search`, `pageSize`, `pageIndex`)
- `GET /:postId`
- `PUT /:postId` (multipart `file`)
- `DELETE /:postId`

### Files (`/api/v1/file`)

- `POST /upload` (auth, multipart `file`)

## Response Pattern

Most endpoints return:

```json
{
  "code": 200,
  "status": true,
  "message": "Some message",
  "data": {}
}
```

Errors are handled centrally and return:

```json
{
  "code": 400,
  "status": false,
  "message": "Error message",
  "stack": "..."
}
```

## Validation

Request validation uses `express-validator`:
- Auth payload checks (email/password/code)
- Post/category id validation with MongoDB ObjectId checks
- Required fields on post/category creation

## Notes for Contributors

- Lint config: `eslint.config.mjs`
- TS config: `tsconfig.json`
- Nodemon config: `nodemon.json`
- No automated tests are currently configured (`npm test` is placeholder).

