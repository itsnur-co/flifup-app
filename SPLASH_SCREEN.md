# Flifup Animated Splash Screen Documentation

## Overview

This document provides comprehensive details about the animated splash screen implementation for the Flifup mobile application.

## Features

### 1. **Animated Road Lines**
- Multiple curved lines that animate like roads
- Synchronized animations with different delays
- Purple and blue color variants for visual depth

### 2. **Logo Animation**
- Smooth fade-in effect
- Scale animation with bounce
- Centered within circular background

### 3. **Circle Expansion**
- Circular background that expands to fill screen
- Smooth transition to authentication screen
- Purple gradient with border effect

### 4. **Loading Indicator**
- Animated dots that pulse in sequence
- Positioned at the bottom of the screen
- Appears after logo animation

## File Structure

```
flifup/
├── app/
│   ├── _layout.tsx                 # Root navigation layout
│   ├── splash.tsx                  # Main splash screen
│   └── auth/
│       ├── _layout.tsx             # Auth flow layout
│       └── start.tsx               # Auth start screen
├── components/
│   ├── logo/
│   │   ├── Logo.tsx                # Reusable logo component
│   │   └── index.ts                # Export file
│   ├── buttons/
│   │   ├── PrimaryButton.tsx       # Primary button component
│   │   └── index.ts                # Export file
│   └── animations/
│       ├── LoadingSpinner.tsx      # Loading spinner component
│       └── index.ts                # Export file
└── constants/
    ├── colors.ts                   # Color palette
    ├── animations.ts               # Animation configurations
    └── theme.ts                    # Theme constants
```

## Animation Timeline

| Time (ms) | Event |
|-----------|-------|
| 0 - 200 | Road lines start animating |
| 800 | Logo fades in and scales |
| 1000 | Loading spinner appears |
| 2200 | Circle starts expanding |
| 3000 | Navigation to auth screen |

## Components

### Logo Component
**Location:** `components/logo/Logo.tsx`

**Props:**
- `size?: number` - Size of the logo (default: 100)
- `variant?: 'white'` - Logo variant (default: 'white')
- `style?: ViewStyle` - Additional styles

**Assets:**
- Logo is loaded from `assets/logo/white-logo.png`
- Uses actual logo image file instead of SVG

**Usage:**
```tsx
import { Logo } from '@/components/logo';

<Logo size={80} variant="white" />
```

### PrimaryButton Component
**Location:** `components/buttons/PrimaryButton.tsx`

**Props:**
- `title: string` - Button text
- `onPress: () => void` - Click handler
- `variant?: 'filled' | 'outlined'` - Button style (default: 'filled')
- `loading?: boolean` - Show loading state
- `disabled?: boolean` - Disable button
- `style?: ViewStyle` - Additional styles
- `textStyle?: TextStyle` - Additional text styles

**Usage:**
```tsx
import { PrimaryButton } from '@/components/buttons';

<PrimaryButton
  title="Create account"
  onPress={handleCreateAccount}
  variant="filled"
/>
```

### LoadingSpinner Component
**Location:** `components/animations/LoadingSpinner.tsx`

**Props:**
- `size?: number` - Size of each dot (default: 8)
- `color?: string` - Color of dots (default: purple)

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/animations';

<LoadingSpinner size={8} color={Colors.primary} />
```

## Color Palette

### Brand Colors
- **Primary (Purple):** `#9039FF`
- **Secondary (Cyan):** `#2DFDFF`

### Primary Variants
- **Primary Light:** `#A768FF`
- **Primary Dark:** `#7621E6`

### Secondary Variants
- **Secondary Light:** `#5CFEFF`
- **Secondary Dark:** `#00E5E8`

### Background Colors
- **Dark:** `#1A1A1D`
- **Primary Gradient:** `#7621E6` → `#A768FF`
- **Primary to Secondary:** `#9039FF` → `#2DFDFF`

For complete color documentation, see [COLOR_SYSTEM.md](COLOR_SYSTEM.md)

## Logo Assets

The Logo component uses the actual logo image from `assets/logo/white-logo.png`.

### Adding Additional Logo Variants

To add more logo variants (e.g., colored, dark mode):

1. Add the logo file to `assets/logo/` (e.g., `colored-logo.png`)
2. Update the Logo component's `variant` type:
```tsx
variant?: 'white' | 'colored' | 'dark'
```
3. Add the case to the `getLogoSource()` function:
```tsx
case 'colored':
  return require('@/assets/logo/colored-logo.png');
```

## Customization

### Adjusting Animation Duration

Edit [constants/animations.ts](constants/animations.ts):

```typescript
export const AnimationConfig = {
  splash: {
    roadLinesDuration: 1500,    // Duration of road lines
    logoAppearDelay: 800,        // Delay before logo appears
    logoFadeDuration: 600,       // Logo fade duration
    circleExpandDelay: 2200,     // Delay before circle expands
    circleExpandDuration: 800,   // Circle expansion duration
    totalDuration: 3000,         // Total splash duration
  },
};
```

### Changing Colors

Edit [constants/colors.ts](constants/colors.ts):

```typescript
export const Colors = {
  primary: {
    purple: '#8B5CF6',      // Main brand color
    purpleLight: '#A78BFA', // Light variant
    purpleDark: '#7C3AED',  // Dark variant
  },
  // ... more colors
};
```

### Modifying Road Lines

In [app/splash.tsx](app/splash.tsx), adjust the `RoadLine` components:

```tsx
<RoadLine
  delay={0}                    // Animation delay
  startX={SCREEN_WIDTH * 0.6}  // Start X position
  startY={SCREEN_HEIGHT * 0.3} // Start Y position
  endX={SCREEN_WIDTH * 0.85}   // End X position
  endY={SCREEN_HEIGHT * 0.2}   // End Y position
  isBlue={false}               // Use blue color variant
/>
```

## Dependencies

- **react-native-reanimated** - Advanced animations
- **expo-linear-gradient** - Gradient backgrounds
- **react-native-svg** - SVG logo rendering
- **expo-router** - Navigation

## Best Practices

### 1. **Performance**
- All animations use `react-native-reanimated` for 60fps performance
- Animations run on the UI thread
- No JavaScript bridge crossing during animations

### 2. **Code Quality**
- TypeScript for type safety
- Modular component structure
- Clear documentation and comments
- Consistent naming conventions

### 3. **Maintainability**
- Separated concerns (components, constants, screens)
- Reusable components
- Centralized color and animation configuration
- Clean import/export patterns

## Testing

To test the splash screen:

1. Start the development server:
```bash
npm start
```

2. Run on your preferred platform:
```bash
npm run ios     # iOS
npm run android # Android
npm run web     # Web
```

## Troubleshooting

### Common Issues

**Issue:** Splash screen doesn't appear
- **Solution:** Ensure the initial route is set to 'splash' in `app/_layout.tsx`

**Issue:** Animations are choppy
- **Solution:** Make sure you're running on a physical device or using a properly configured emulator

**Issue:** Navigation doesn't work
- **Solution:** Verify that the auth screen exists at `app/auth/start.tsx`

## Future Enhancements

1. Add haptic feedback on logo appearance
2. Implement skip button for returning users
3. Add particle effects around the logo
4. Support for different screen sizes and orientations
5. Add accessibility features (reduced motion support)

## License

This implementation is part of the Flifup mobile application.
