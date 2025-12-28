# Flifup API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## API Documentation

This file covers authentication and profile management endpoints. For other features, see:
- **[Habits API](./habits.md)** - Complete habits tracking system with CRUD, completions, and statistics
- **[Tasks API](./TASKS-API.md)** - Task management with subtasks, categories, collaborators, and time tracking
- **[Journal API](./JOURNAL-API.md)** - Journal entries with categories, mood tracking, and insights

---

## Authentication

All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Signup Flow (2-Step Email Verification)

### 1. Initiate Signup

**POST** `/auth/initiate-signup`

Starts the signup process. Validates email (MX check + disposable email block) and sends 4-digit OTP.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP sent to your email. Please verify to complete registration.",
  "expiresIn": 600
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error / Disposable email / Invalid domain |
| 400 | Too many signup attempts (3/hour) |
| 409 | Email already registered |
| 429 | Rate limit exceeded |

**Rate Limit:** 5 requests per minute

---

### 2. Verify Signup OTP

**POST** `/auth/verify-signup-otp`

Verifies email OTP and creates the user account. Returns tokens for immediate login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```

**Response (201 Created):**
```json
{
  "message": "Account created successfully. Welcome to Flifup!",
  "user": {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-04T12:00:00.000Z"
  },
  "accessToken": "eyJhbG...",
  "refreshToken": "a1b2c3d4...",
  "expiresIn": 900
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | No pending signup found |
| 400 | OTP has expired (10 min) |
| 400 | Too many failed attempts (max 5) |
| 400 | Invalid OTP (shows remaining attempts) |

**Rate Limit:** 10 requests per minute

---

## Auth Endpoints

### 3. Login

**POST** `/auth/login`

Authenticates user and returns tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "isActive": true,
    "createdAt": "2025-12-04T12:00:00.000Z"
  },
  "accessToken": "eyJhbG...",
  "refreshToken": "a1b2c3d4...",
  "expiresIn": 900
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error |
| 401 | Invalid credentials |
| 429 | Too many requests |

---

### 4. Refresh Token

**POST** `/auth/refresh`

Generates new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "x1y2z3...",
  "expiresIn": 900
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Invalid or expired refresh token |

---

### 5. Logout

**POST** `/auth/logout`

Invalidates the refresh token.

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. Logout All Devices

**POST** `/auth/logout-all`

Invalidates all refresh tokens for the user. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out from all devices"
}
```

---

## Forgot Password Flow

### 7. Forgot Password (Request OTP)

**POST** `/auth/forgot-password`

Sends 4-digit OTP to email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP sent to your email",
  "expiresIn": 600
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Too many requests (3/hour limit) |
| 401 | Account is deactivated |
| 429 | Rate limit exceeded |

**Rate Limit:** 3 requests per minute

---

### 8. Verify OTP (Password Reset)

**POST** `/auth/verify-otp`

Verifies 4-digit OTP and returns reset token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "1234"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP verified successfully",
  "resetToken": "a1b2c3d4e5f6...",
  "expiresIn": 900
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | No OTP request found |
| 400 | OTP has expired (10 min) |
| 400 | Too many failed attempts (max 5) |
| 400 | Invalid OTP (shows remaining attempts) |

**Rate Limit:** 10 requests per minute

---

### 9. Reset Password

**POST** `/auth/reset-password`

Resets password using reset token.

**Request Body:**
```json
{
  "resetToken": "a1b2c3d4e5f6...",
  "newPassword": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

**Response (200 OK):**
```json
{
  "message": "Password reset successful. Please login with your new password."
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Passwords do not match |
| 400 | Invalid or expired reset token |
| 400 | Reset token has expired (15 min) |
| 401 | Account is deactivated |
| 404 | User not found |

**Rate Limit:** 5 requests per minute

---

## Token Details

| Token | Type | Expiry | Usage |
|-------|------|--------|-------|
| Access Token | JWT | 15 minutes | API authorization |
| Refresh Token | Opaque | 7 days | Get new access token |
| Reset Token | Opaque | 15 minutes | Password reset |
| OTP | 4-digit | 10 minutes | Verify email ownership |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Initiate Signup | 5 req/min |
| Verify Signup OTP | 10 req/min |
| Login | 10 req/min |
| Refresh | 30 req/min |
| Forgot Password | 3 req/min |
| Verify OTP | 10 req/min |
| Reset Password | 5 req/min |
| Update Profile | 10 req/min |
| Change Password | 5 req/min |
| Upload Profile Image | 5 req/min |
| Global | 100 req/min |

---

## Security Features

- Password hashed with bcrypt (cost factor 12)
- Refresh token rotation on each use
- All sessions invalidated on password reset
- Helmet security headers
- CORS protection
- Input validation & sanitization
- Rate limiting per endpoint
- OTP hashed with bcrypt
- Disposable/temporary email blocking
- MX record validation for email domains
- Email enumeration prevention
- Email verification required before account creation
- Secure cloud image storage with Cloudinary CDN
- File type and size validation for uploads
- Automatic image optimization and compression

---

## Profile Management

All profile endpoints require authentication.

### 10. Get Profile

**GET** `/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://res.cloudinary.com/.../profile.jpg",
    "isActive": true,
    "createdAt": "2025-12-04T12:00:00.000Z",
    "updatedAt": "2025-12-04T12:00:00.000Z"
  }
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized (invalid/missing token) |
| 404 | User not found |

---

### 11. Update Profile

**PATCH** `/profile`

Update user's profile information (name and/or email).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "newemail@example.com"
}
```

**Note:** Both fields are optional. Send only the fields you want to update.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "clxxx...",
    "fullName": "John Updated",
    "email": "newemail@example.com",
    "profileImage": "https://res.cloudinary.com/.../profile.jpg",
    "isActive": true,
    "createdAt": "2025-12-04T12:00:00.000Z",
    "updatedAt": "2025-12-04T13:00:00.000Z"
  }
}
```

**Validation:**
- `fullName`: Minimum 2 characters (if provided)
- `email`: Valid email format, MX check, disposable email block (if provided)

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error / Invalid email domain |
| 401 | Unauthorized (invalid/missing token) |
| 404 | User not found |
| 409 | Email already in use |
| 429 | Rate limit exceeded |

**Rate Limit:** 10 requests per minute

---

### 12. Change Password

**PATCH** `/profile/password`

Change user's password (requires current password for verification).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "NewSecurePass@456"
}
```

**Password Requirements:**
- Minimum 8 characters
- New password must be different from current password

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | Validation error / Passwords must be different |
| 401 | Unauthorized / Current password incorrect |
| 404 | User not found |
| 429 | Rate limit exceeded |

**Rate Limit:** 5 requests per minute

---

### 13. Upload Profile Image

**POST** `/profile/image`

Upload or update user's profile image to Cloudinary.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
| Field | Type | Description |
|-------|------|-------------|
| image | File | Image file (JPEG, PNG, WebP) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "id": "clxxx...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://res.cloudinary.com/ddro8vryc/image/upload/v1234567890/profile-images/abc123.jpg",
    "isActive": true,
    "createdAt": "2025-12-04T12:00:00.000Z",
    "updatedAt": "2025-12-04T13:00:00.000Z"
  }
}
```

**Validation:**
- **File Type:** Only JPEG, JPG, PNG, and WebP allowed
- **File Size:** Maximum 5MB
- **Auto Processing:** Image automatically resized to 500x500 (max) and compressed

**Features:**
- ✅ Automatic image resize (500x500 max)
- ✅ Automatic compression for optimal quality
- ✅ Old profile image automatically deleted from Cloudinary
- ✅ Secure cloud storage with Cloudinary CDN

**Errors:**
| Status | Description |
|--------|-------------|
| 400 | No file uploaded |
| 400 | Invalid file type (only JPEG, PNG, WebP allowed) |
| 400 | File size exceeds 5MB |
| 401 | Unauthorized (invalid/missing token) |
| 404 | User not found |
| 429 | Rate limit exceeded |

**Rate Limit:** 5 requests per minute

---

## Frontend Integration Guide

### Signup Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        SIGNUP FLOW                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐     ┌─────────────────┐     ┌────────────┐ │
│  │  Signup Screen  │────▶│  Verify Email   │────▶│  Dashboard │ │
│  │  (Form)         │     │  Screen (OTP)   │     │  (Logged)  │ │
│  └─────────────────┘     └─────────────────┘     └────────────┘ │
│         │                        │                      │        │
│         ▼                        ▼                      ▼        │
│  POST /initiate-signup    POST /verify-signup-otp    Success!   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Step 1: Signup Screen**
- User fills: Full Name, Email, Password
- Click "Sign Up" → Call `POST /auth/initiate-signup`
- On success → Navigate to OTP verification screen

**Step 2: OTP Verification Screen**
- Show email where OTP was sent
- User enters 4-digit OTP
- Click "Verify" → Call `POST /auth/verify-signup-otp`
- On success → Store tokens, navigate to dashboard

**Step 3: User is logged in!**
- Response includes `accessToken`, `refreshToken`, `user`
- No need for separate login after signup

---

## Quick Reference - All Endpoints

| # | Method | Endpoint | Description | Auth Required |
|---|--------|----------|-------------|---------------|
| 1 | POST | `/auth/initiate-signup` | Start signup (send OTP) | ❌ |
| 2 | POST | `/auth/verify-signup-otp` | Complete signup (verify OTP) | ❌ |
| 3 | POST | `/auth/login` | Login user | ❌ |
| 4 | POST | `/auth/refresh` | Refresh access token | ❌ |
| 5 | POST | `/auth/logout` | Logout (single device) | ❌ |
| 6 | POST | `/auth/logout-all` | Logout (all devices) | ✅ |
| 7 | POST | `/auth/forgot-password` | Request password reset OTP | ❌ |
| 8 | POST | `/auth/verify-otp` | Verify OTP for password reset | ❌ |
| 9 | POST | `/auth/reset-password` | Reset password with token | ❌ |
| 10 | GET | `/profile` | Get user profile | ✅ |
| 11 | PATCH | `/profile` | Update profile (name/email) | ✅ |
| 12 | PATCH | `/profile/password` | Change password | ✅ |
| 13 | POST | `/profile/image` | Upload profile image | ✅ |

---
