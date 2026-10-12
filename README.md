# Blog Backend API (NestJS Microservice)

A NestJS backend microservice for a blog platform converted with standard architectural patterns and practices:
- Modular architecture with Dependency Injection
- JWT-based authentication using Passport (`@nestjs/passport` + `passport-jwt`)
- Role-based access control (`@Roles` decorator and `RolesGuard`)
- MongoDB with Mongoose (`@nestjs/mongoose`)
- Strongly typed Data Transfer Objects (`class-validator` + `class-transformer`) organized by feature domain (all related DTOs grouped into single domain files)
- Centralized exception filter (`AllExceptionsFilter`) ensuring backwards-compatible response payloads
- File upload handling with Multer and format validation
- Email verification and password reset via Nodemailer

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: MongoDB + `@nestjs/mongoose` (Mongoose 7+)
- **Authentication**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
- **Validation**: `class-validator`, `class-transformer`
- **Security**: `bcryptjs`, AES-256-CBC secret decryption
- **File Upload**: `@nestjs/platform-express` + `multer`
- **Emailing**: `nodemailer`

## Project Structure

```text
src/
├── app.module.ts                         # Root application module
├── main.ts                               # Application bootstrap & global pipes/filters
├── common/                               # Cross-cutting utilities and decorators
│   ├── constants/
│   │   └── app.constants.ts              # Collection names, allowed file types, roles
│   ├── decorators/
│   │   ├── current-user.decorator.ts     # @CurrentUser() param decorator
│   │   └── roles.decorator.ts            # @Roles() metadata decorator
│   ├── filters/
│   │   └── all-exceptions.filter.ts      # Global exception filter (matches microservice format)
│   ├── guards/
│   │   ├── jwt-auth.guard.ts             # JWT passport authentication guard
│   │   └── roles.guard.ts                # Role-based access guard
│   └── utils/
│       ├── code-generator.util.ts        # Random verification code generator
│       ├── encryption.util.ts            # Bcrypt hashing & AES cipher decryption
│       ├── file-filter.util.ts           # Multer file type validator
│       └── regex.util.ts                 # Reusable regex helpers
├── config/
│   ├── app-config.module.ts              # Global config module
│   └── app-config.service.ts             # Environment variable loader & secret resolver
└── modules/
    ├── auth/                             # User authentication & profile management
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── dto/
    │   │   └── auth.dto.ts               # All Auth/User related DTOs grouped here
    │   ├── schemas/
    │   │   └── user.schema.ts
    │   └── strategies/
    │       └── jwt.strategy.ts
    ├── category/                         # Category management (Admin only)
    │   ├── category.controller.ts
    │   ├── category.module.ts
    │   ├── category.service.ts
    │   ├── dto/
    │   │   └── category.dto.ts           # All Category related DTOs grouped here
    │   └── schemas/
    │       └── category.schema.ts
    ├── post/                             # Post management
    │   ├── post.controller.ts
    │   ├── post.module.ts
    │   ├── post.service.ts
    │   ├── dto/
    │   │   └── post.dto.ts               # All Post related DTOs grouped here
    │   └── schemas/
    │       └── post.schema.ts
    ├── file/                             # File uploads and storage
    │   ├── file.controller.ts
    │   ├── file.module.ts
    │   ├── file.service.ts
    │   └── schemas/
    │       └── file.schema.ts
    └── email/                            # Email delivery service
        ├── email.module.ts
        └── email.service.ts
```

## DTO Organization

As per requirements, related DTOs are consolidated within single files per domain:
- `src/modules/auth/dto/auth.dto.ts`:
  - `SignUpDto`
  - `SignInDto`
  - `SendVerificationEmailDto`
  - `ForgotPasswordDto`
  - `VerifyUserDto`
  - `ResetPasswordDto`
  - `ChangePasswordDto`
  - `UpdateProfileDto`
- `src/modules/category/dto/category.dto.ts`:
  - `CreateCategoryDto`
  - `UpdateCategoryDto`
  - `QueryCategoryDto`
  - `CategoryParamDto`
- `src/modules/post/dto/post.dto.ts`:
  - `CreatePostDto`
  - `UpdatePostDto`
  - `QueryPostDto`
  - `PostParamDto`

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas (or local MongoDB instance)

## Installation

```bash
npm install
```

## Environment Configuration

Environment files are loaded dynamically from:

```text
env/<NODE_ENV>.env
```

For example, when running with `NODE_ENV=development`, the app loads `env/development.env`.

Keys:

```env
PORT=3000
ENV_VALUES_ENCRYPTED=false
MONGO_CONNECTION_URL=mongodb://127.0.0.1:27017/blogDB
JWT_SECRET=your_jwt_secret_key
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_email_app_password
```

### Encrypted Values

- By default, if `ENV_VALUES_ENCRYPTED=true`, encrypted values will be automatically decrypted using AES-256-CBC.
- Set `ENV_VALUES_ENCRYPTED=false` to use plain text configuration strings.

## Running the Application

```bash
# Build the application
npm run build

# Start the application
npm start

# Development mode with hot-reload
npm run dev
# or
npm run start:dev

# Production mode
npm run start:prod
```

Server base URL: `http://localhost:3000`
API base path: `/api/v1`

## API Endpoints

### Auth (`/api/v1/auth`)
- `POST /signup` - Register a new user
- `POST /signin` - Authenticate user and receive JWT token
- `POST /send-verification-email` - Send account verification code
- `POST /verify-user` - Verify user account with code
- `POST /forgot-password-code` - Send password reset code
- `POST /reset-password` - Reset password with verification code
- `POST /change-password` - Update password (Authenticated)
- `POST /update-profile` - Update name or email (Authenticated)
- `POST /update-profile-pic` - Update profile image (Authenticated, multipart `profilePic`)
- `GET /get-login-user` - Fetch authenticated user details (Authenticated)

### Categories (`/api/v1/category`)
*Requires authentication and Admin/Super-Admin role (Role 1 or 2).*
- `GET /` - List categories (paginated with search)
- `POST /` - Create category
- `GET /:categoryId` - Get category details
- `PUT /:categoryId` - Update category
- `DELETE /:categoryId` - Delete category

### Posts (`/api/v1/post`)
*Requires authentication.*
- `POST /` - Create post (multipart with `file`, body `title`, `category`, `desc`)
- `GET /` - List posts (paginated with search)
- `GET /:postId` - Get post details
- `PUT /:postId` - Update post (multipart `file`)
- `DELETE /:postId` - Delete post

### Files (`/api/v1/file`)
*Requires authentication.*
- `POST /upload` - Upload file (multipart `file`)
