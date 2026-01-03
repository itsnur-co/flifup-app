# Flifup Bug Fixes & Feature Updates

## Summary of Changes

This package contains fixes for the following issues:
1. **Google Sign-In Errors** (DEVELOPER_ERROR, No ID token)
2. **Email OTP Not Sending on Deployed Backend** (Render.com)
3. **Splash Screen Navigation Flow** (skipping to home, animation not playing)
4. **Habits API Integration Issues** (endpoint mismatch)
5. **Facebook Login Implementation** (new feature)

---

## Issue 1: Google Sign-In Errors

### Root Causes
- `webClientId` was incorrectly configured (must be **Web Client ID**, not Android Client ID)
- SHA-1 fingerprint not added to Google Cloud Console
- Package name mismatch

### Files Changed
- `frontend/services/googleAuth.service.ts` - Complete rewrite with proper configuration
- `frontend/app/auth/login.tsx` - Updated Google sign-in handling
- `frontend/app/auth/signup.tsx` - Added Google sign-up support

### Setup Instructions

1. **Go to Google Cloud Console**: https://console.cloud.google.com

2. **Create OAuth 2.0 Credentials** (APIs & Services > Credentials):
   
   **Web Client** (REQUIRED):
   - Create OAuth 2.0 Client ID > Web application
   - Name: "Flifup Web Client"
   - Copy the Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
   - **This is the ID you use in `webClientId`**

   **Android Client** (REQUIRED for Android):
   - Create OAuth 2.0 Client ID > Android
   - Package name: `com.flifup.app`
   - SHA-1 fingerprint: Get from debug/release keystore
   
   For debug SHA-1:
   ```bash
   cd android && ./gradlew signingReport
   ```
   Or:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

3. **Update the webClientId** in `services/googleAuth.service.ts`:
   ```typescript
   const WEB_CLIENT_ID = "YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com";
   ```

4. **Update Environment Variables** (optional, recommended):
   ```bash
   # In your .env or app.json/app.config.js
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
   ```

5. **Rebuild the App**:
   ```bash
   npx eas build --platform android --profile development
   ```

---

## Issue 2: Email OTP Not Sending on Deployed Backend

### Root Cause
SMTP environment variables not configured on Render.com or Gmail blocking connections.

### Files Changed
- `backend/src/mail/mail.service.ts` - Improved with retry logic, better logging, connection verification

### Setup Instructions

1. **For Production**, use a proper email service (NOT Gmail):
   - **SendGrid** (recommended): https://sendgrid.com
   - **Mailgun**: https://www.mailgun.com
   - **Amazon SES**: https://aws.amazon.com/ses/
   - **Resend**: https://resend.com

2. **For Development/Testing with Gmail**:
   - Enable 2FA on your Google account
   - Create an App Password: https://myaccount.google.com/apppasswords
   - Use the App Password as `SMTP_PASS`

3. **Environment Variables** (add in Render Dashboard > Environment):
   ```bash
   # For Gmail (development only)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your.email@gmail.com
   SMTP_PASS=your_app_password_here
   SMTP_FROM_NAME=Flifup
   SMTP_FROM_EMAIL=your.email@gmail.com

   # For SendGrid (production)
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   SMTP_FROM_NAME=Flifup
   SMTP_FROM_EMAIL=noreply@flifup.com
   ```

4. **After adding variables**, redeploy your backend on Render.

5. **Check logs** for SMTP connection verification messages.

---

## Issue 3: Splash Screen Navigation Flow

### Root Cause
Race condition between AuthContext loading user state and splash screen animation.

### Files Changed
- `frontend/app/splash.tsx` - Fixed animation sequence and auth state checking
- `frontend/app/_layout.tsx` - Fixed auth flow and route protection

### How It Works Now
1. Splash screen shows with road lines animation
2. Logo appears and animates
3. Circle expands
4. **Only after** both animation completes AND auth state is determined:
   - Authenticated users → Navigate to `/(tabs)`
   - Unauthenticated users → Navigate to `/auth/start`

---

## Issue 4: Habits API Integration Issues

### Root Cause
Backend endpoint `DELETE /habits/:id/complete/:date` required a date, but frontend was calling `DELETE /habits/:id/complete` without date for today's uncomplete.

### Files Changed
- `backend/src/habits/habits.controller.ts` - Added separate endpoint for today's uncomplete
- Added missing endpoints:
  - `GET /habits/:id/progress` - Get progress for a specific habit
  - `GET /habits/:id/history` - Get completion history
  - `POST /habits/:id/complete/:date` - Complete for specific date
  - `DELETE /habits/:id/complete` - Uncomplete for today (NEW)
  - `DELETE /habits/:id/complete/:date` - Uncomplete for specific date

---

## Issue 5: Facebook Login Implementation (NEW FEATURE)

### Files Added
- `frontend/services/facebookAuth.service.ts` - Facebook authentication service
- `backend/src/auth/dto/facebook-login.dto.ts` - DTO for Facebook login
- `backend/src/auth/auth.controller.ts` - Added Facebook endpoint
- `backend/src/auth/auth.service.ts` - Added Facebook login method
- `frontend/services/api/auth.service.ts` - Added Facebook login API call
- `frontend/services/api/config.ts` - Added Facebook endpoint

### Database Migration Required
Add `facebookId` field to User model:

```prisma
// prisma/schema.prisma
model User {
  // ... existing fields ...
  facebookId String? @unique
}
```

Run migration:
```bash
npx prisma migrate dev --name add_facebook_id
```

### Facebook Developer Setup

1. **Create Facebook App**: https://developers.facebook.com
   - Create new app (Consumer type)
   - Add "Facebook Login" product

2. **Get Credentials**:
   - App ID: Settings > Basic
   - Client Token: Settings > Advanced > Client Token

3. **Configure Facebook App**:
   - Settings > Basic:
     - App Domains: your-domain.com
     - Privacy Policy URL: (required for production)
   - Facebook Login > Settings:
     - Valid OAuth Redirect URIs:
       - `fb{APP_ID}://authorize` (for mobile)

4. **Add Key Hash** (Android):
   ```bash
   keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
   ```
   - Package Name: `com.flifup.app`
   - Class Name: `com.flifup.app.MainActivity`

5. **Install SDK**:
   ```bash
   npx expo install react-native-fbsdk-next
   ```

6. **Update app.json**:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-fbsdk-next",
           {
             "appID": "YOUR_FACEBOOK_APP_ID",
             "clientToken": "YOUR_CLIENT_TOKEN",
             "displayName": "Flifup",
             "scheme": "fbYOUR_FACEBOOK_APP_ID",
             "advertiserIDCollectionEnabled": false,
             "autoLogAppEventsEnabled": false,
             "isAutoInitEnabled": true
           }
         ]
       ]
     }
   }
   ```

7. **Rebuild App**:
   ```bash
   npx eas build --platform android --profile development
   ```

---

## Installation Instructions

### Frontend Updates

1. Copy files from `frontend-fixes/` to your frontend project:
   ```bash
   cp -r frontend-fixes/services/* src/services/
   cp -r frontend-fixes/app/* app/
   ```

2. Install Facebook SDK (if using Facebook login):
   ```bash
   npx expo install react-native-fbsdk-next
   ```

3. Update app.json with Facebook configuration

4. Rebuild with EAS Build:
   ```bash
   npx eas build --platform android --profile development
   ```

### Backend Updates

1. Copy files from `backend-fixes/` to your backend project:
   ```bash
   cp -r backend-fixes/src/* src/
   ```

2. Add Prisma migration for Facebook ID:
   ```bash
   npx prisma migrate dev --name add_facebook_id
   ```

3. Set environment variables in Render Dashboard

4. Deploy to Render

---

## Environment Variables Checklist

### Backend (Render.com)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random 64-char string |
| `GOOGLE_CLIENT_ID` | Google Web Client ID | `xxx.apps.googleusercontent.com` |
| `SMTP_HOST` | Email server host | `smtp.sendgrid.net` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_SECURE` | Use SSL | `false` |
| `SMTP_USER` | Email username/API key | `apikey` |
| `SMTP_PASS` | Email password/API secret | `SG.xxx...` |
| `SMTP_FROM_NAME` | Sender name | `Flifup` |
| `SMTP_FROM_EMAIL` | Sender email | `noreply@flifup.com` |

### Frontend (app.json or .env)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google Web Client ID |
| `EXPO_PUBLIC_FACEBOOK_APP_ID` | Facebook App ID |

---

## Testing Checklist

- [ ] Google Sign-In works on Android APK
- [ ] OTP emails are sent and received
- [ ] Splash screen animation plays fully
- [ ] Authenticated users go to home screen
- [ ] New users see start/login screen
- [ ] Creating habits works without errors
- [ ] Completing/uncompleting habits works
- [ ] Facebook login works (if configured)

---

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure SHA-1 fingerprints match in Google Cloud Console
4. For Gmail SMTP issues, verify you're using an App Password
