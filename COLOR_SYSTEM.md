# Flifup Color System

## Brand Colors

### Primary Color
```typescript
Colors.primary = '#9039FF'
```
A vibrant purple that represents the Flifup brand.

### Secondary Color
```typescript
Colors.secondary = '#2DFDFF'
```
A bright cyan/turquoise that complements the primary color.

## Color Variants

### Primary Variants
```typescript
Colors.primaryVariants = {
  light: '#A768FF',    // Lighter shade for highlights
  dark: '#7621E6',     // Darker shade for depth
  gradient: {
    start: '#7621E6',  // Gradient start (dark)
    end: '#A768FF',    // Gradient end (light)
  }
}
```

### Secondary Variants
```typescript
Colors.secondaryVariants = {
  light: '#5CFEFF',    // Lighter cyan
  dark: '#00E5E8',     // Darker cyan
  gradient: {
    start: '#00E5E8',  // Gradient start (dark)
    end: '#5CFEFF',    // Gradient end (light)
  }
}
```

## Gradient Combinations

### Primary to Secondary Gradient
```typescript
Colors.gradient.primaryToSecondary = {
  start: '#9039FF',  // Primary purple
  end: '#2DFDFF',    // Secondary cyan
}
```
Use this for eye-catching transitions between brand colors.

### Primary Full Gradient
```typescript
Colors.gradient.primaryFull = {
  start: '#7621E6',  // Dark purple
  end: '#A768FF',    // Light purple
}
```
Use this for subtle purple gradients.

### Secondary Full Gradient
```typescript
Colors.gradient.secondaryFull = {
  start: '#00E5E8',  // Dark cyan
  end: '#5CFEFF',    // Light cyan
}
```
Use this for subtle cyan gradients.

## Background Colors

```typescript
Colors.background = {
  dark: '#1A1A1D',      // Dark background
  primary: '#9039FF',   // Primary purple background
  secondary: '#2DFDFF', // Secondary cyan background
}
```

## UI Colors

```typescript
Colors.ui = {
  white: '#FFFFFF',
  black: '#000000',
  border: '#E5E7EB',
  text: {
    primary: '#FFFFFF',    // White text
    secondary: '#D1D5DB',  // Gray text
    dark: '#1A1A1D',       // Dark text
  }
}
```

## Usage Examples

### Using in Components

#### Basic Color
```tsx
<View style={{ backgroundColor: Colors.primary }} />
<Text style={{ color: Colors.secondary }}>Hello</Text>
```

#### Gradient Background
```tsx
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[Colors.gradient.primaryFull.start, Colors.gradient.primaryFull.end]}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
>
  {/* Content */}
</LinearGradient>
```

#### Primary to Secondary Gradient
```tsx
<LinearGradient
  colors={[Colors.gradient.primaryToSecondary.start, Colors.gradient.primaryToSecondary.end]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Content */}
</LinearGradient>
```

## Color System Location

All colors are defined in:
```
/home/nur/Works/flifup/constants/colors.ts
```

## Benefits of This System

1. **Centralized Management**: All colors in one place
2. **Consistency**: Same colors used throughout the app
3. **Easy Updates**: Change colors in one location
4. **TypeScript Support**: Auto-completion and type safety
5. **Variants Ready**: Light and dark versions of each color
6. **Gradient Support**: Pre-configured gradients for beautiful effects

## Updating the Color System

To add new colors or variants:

1. Open `constants/colors.ts`
2. Add your new color to the `Colors` object
3. TypeScript will auto-update types
4. Use the new color anywhere with `Colors.yourNewColor`

Example:
```typescript
export const Colors = {
  // ... existing colors

  // New accent color
  accent: '#FF6B6B',

  // ... rest of colors
} as const;
```

## Visual Reference

### Primary Purple (#9039FF)
Used for: Main buttons, primary UI elements, brand identity

### Secondary Cyan (#2DFDFF)
Used for: Accents, highlights, secondary actions, animations

### Gradient Combinations
- **Auth Screen**: Primary full gradient (dark to light purple)
- **Splash Screen**: Primary color with lighter border
- **Road Lines**: Primary (purple) and Secondary (cyan) alternating
