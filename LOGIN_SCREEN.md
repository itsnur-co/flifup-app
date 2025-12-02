# Flifup Login Screen Documentation

## Overview

The Login Screen provides a modern, user-friendly authentication interface matching the Figma design. It includes email/phone login, password authentication, social login options, and comprehensive form validation.

## Features

### 1. **Flexible Authentication**
- Email or phone number login
- Real-time form validation
- Password visibility toggle
- Error message display

### 2. **Social Authentication**
- Google sign-in button
- Facebook sign-in button
- Clean, modern button design

### 3. **User Experience**
- Smooth animations on screen entry
- Keyboard-aware scrolling
- Focus states for inputs
- Loading states during authentication

### 4. **Navigation**
- Forgot password link
- Sign up redirection
- Smooth transitions between screens

## File Structure

```
flifup/
├── app/
│   └── auth/
│       ├── _layout.tsx              # Auth flow navigation
│       ├── start.tsx                # Initial auth screen
│       └── login.tsx                # Login screen (main)
├── components/
│   ├── inputs/
│   │   ├── TextInput.tsx            # Custom input component
│   │   └── index.ts
│   ├── buttons/
│   │   ├── PrimaryButton.tsx        # Main action button
│   │   ├── SocialButton.tsx         # Social login buttons
│   │   └── index.ts
│   └── logo/
│       ├── Logo.tsx                 # App logo
│       └── index.ts
└── constants/
    └── colors.ts                    # Color system
```

## Components

### TextInput Component
**Location:** [components/inputs/TextInput.tsx](components/inputs/TextInput.tsx)

**Props:**
- `label: string` - Input field label
- `placeholder?: string` - Placeholder text
- `value: string` - Current input value
- `onChangeText: (text: string) => void` - Value change handler
- `error?: string` - Error message to display
- `isPassword?: boolean` - Enable password field with visibility toggle
- `keyboardType?: KeyboardTypeOptions` - Keyboard type
- `autoCapitalize?: string` - Auto-capitalization behavior
- `autoCorrect?: boolean` - Enable/disable autocorrect
- `containerStyle?: ViewStyle` - Additional container styles

**Features:**
- Built-in error handling
- Password visibility toggle
- Focus state styling
- Customizable styling

**Usage:**
```tsx
import { TextInput } from '@/components/inputs';

<TextInput
  label="Email / Phone"
  placeholder="Enter your email or phone"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  keyboardType="email-address"
/>
```

### SocialButton Component
**Location:** [components/buttons/SocialButton.tsx](components/buttons/SocialButton.tsx)

**Props:**
- `provider: 'google' | 'facebook'` - Social auth provider
- `onPress: () => void` - Button press handler
- `style?: ViewStyle` - Additional styles

**Usage:**
```tsx
import { SocialButton } from '@/components/buttons';

<SocialButton
  provider="google"
  onPress={() => handleSocialSignIn('google')}
/>
```

## Screen Layout

### Header Section
- **Gradient Background**: Purple gradient (primary full)
- **Logo**: Flifup logo with brand name
- **Rounded Bottom**: 32px border radius

### Form Section
- **Dark Background**: Matches app theme
- **Rounded Top**: Overlaps header with 32px radius
- **Form Title**: "Sign In Your Account"

### Input Fields
1. **Email / Phone**
   - Label: "Email / Phone"
   - Placeholder: "Enter your User Email or Phone"
   - Validation: Email format or phone number

2. **Password**
   - Label: "Password"
   - Placeholder: "********"
   - Type: Secure text entry with visibility toggle
   - Validation: Minimum 6 characters

### Action Buttons
1. **Forgot Password**: Right-aligned link
2. **Sign Up Button**: Primary purple button
3. **Social Buttons**: Google and Facebook icons

### Footer
- Sign-up prompt: "Don't have an account? Sign Up"
- Bottom indicator bar

## Form Validation

### Email/Phone Validation
```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (10-15 digits)
const phoneRegex = /^\d{10,15}$/;
```

### Password Validation
- Minimum length: 6 characters
- Required field

### Error Display
- Errors appear below respective input fields
- Red color (#FF4444)
- Clears on input change

## Authentication Flow

```
Start Screen
    │
    ├─> "Sign in" button
    │     │
    │     └─> Login Screen
    │           │
    │           ├─> Email/Phone & Password
    │           │     │
    │           │     └─> Validate → API Call → Main App
    │           │
    │           ├─> Social Login
    │           │     │
    │           │     └─> OAuth → Main App
    │           │
    │           └─> "Sign Up" → Sign Up Screen (TODO)
    │
    └─> "Create account" → Sign Up Screen (TODO)
```

## Styling Details

### Colors
- **Background**: `#1A1A1D` (dark)
- **Header Gradient**: `#7621E6` → `#A768FF`
- **Input Background**: `rgba(255, 255, 255, 0.05)`
- **Input Border**: `rgba(255, 255, 255, 0.1)`
- **Focus Border**: `#9039FF` (primary)
- **Error Color**: `#FF4444`

### Typography
- **Title**: 24px, bold
- **Input Label**: 16px, medium (500)
- **Input Text**: 16px, regular
- **Error Text**: 12px
- **Links**: 14px, medium (600)

### Spacing
- **Container Padding**: 24px horizontal
- **Input Height**: 56px
- **Border Radius**: 12px (inputs), 16px (social buttons), 32px (sections)
- **Gap Between Inputs**: 20px

## Keyboard Handling

The screen uses `KeyboardAvoidingView` for proper keyboard handling:

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.keyboardView}
>
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
  >
    {/* Content */}
  </ScrollView>
</KeyboardAvoidingView>
```

## State Management

### Form State
```typescript
const [emailOrPhone, setEmailOrPhone] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState<{
  emailOrPhone?: string;
  password?: string;
}>({});
const [isLoading, setIsLoading] = useState(false);
```

### Validation Logic
```typescript
const validateForm = (): boolean => {
  const newErrors: { emailOrPhone?: string; password?: string } = {};

  // Validation logic...

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Integration Guide

### Adding Backend Authentication

Replace the mock authentication in `handleSignIn`:

```typescript
const handleSignIn = async () => {
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    // Replace with actual API call
    const response = await fetch('YOUR_API_URL/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store auth token
      // Navigate to main app
      router.replace('/(tabs)');
    } else {
      setErrors({ emailOrPhone: data.message });
    }
  } catch (error) {
    setErrors({ emailOrPhone: 'Network error. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};
```

### Adding Social Authentication

Implement OAuth flow in `handleSocialSignIn`:

```typescript
const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
  try {
    // Example with expo-auth-session
    const result = await promptAsync();

    if (result.type === 'success') {
      // Handle successful authentication
      // Exchange token with your backend
    }
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
  }
};
```

## Accessibility

- All inputs have clear labels
- Error messages are descriptive
- Touch targets meet minimum size (44x44)
- Keyboard navigation supported
- High contrast text

## Testing Checklist

- [ ] Email validation works correctly
- [ ] Phone validation works correctly
- [ ] Password validation (minimum 6 characters)
- [ ] Error messages display properly
- [ ] Password visibility toggle works
- [ ] Social buttons are clickable
- [ ] Forgot password link works
- [ ] Sign up link works
- [ ] Keyboard dismisses on scroll
- [ ] Form submits only when valid
- [ ] Loading state displays during authentication
- [ ] Navigation works correctly

## Future Enhancements

1. **Biometric Authentication**: Face ID / Touch ID support
2. **Remember Me**: Persist login session
3. **Password Strength Indicator**: Visual feedback for password strength
4. **Multi-factor Authentication**: OTP/2FA support
5. **Social Login Expansion**: Apple, Twitter, etc.
6. **Internationalization**: Multi-language support
7. **Accessibility Improvements**: Screen reader support

## Dependencies

- **expo-router**: Navigation
- **react-native-reanimated**: Animations
- **expo-linear-gradient**: Gradient backgrounds
- **@expo/vector-icons**: Icons for password toggle and social buttons

## Related Documentation

- [Color System](COLOR_SYSTEM.md)
- [Splash Screen](SPLASH_SCREEN.md)
- [Component Guidelines](COMPONENT_GUIDELINES.md) (to be created)

## License

This implementation is part of the Flifup mobile application.
