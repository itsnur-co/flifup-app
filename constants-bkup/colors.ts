/**
 * Color palette for the Flifup application
 * Maintains consistent branding throughout the app
 */
export const Colors = {
  // Primary brand color
  primary: "#9039FF",

  // Secondary brand color
  secondary: "#2DFDFF",

  // Primary color variants
  primaryVariants: {
    light: "#A768FF",
    dark: "#7621E6",
    gradient: {
      start: "#7621E6",
      end: "#A768FF",
    },
  },

  // Secondary color variants
  secondaryVariants: {
    light: "#5CFEFF",
    dark: "#00E5E8",
    gradient: {
      start: "#00E5E8",
      end: "#5CFEFF",
    },
  },

  // Combined gradients
  gradient: {
    primaryToSecondary: {
      start: "#9039FF",
      end: "#2DFDFF",
    },
    primaryFull: {
      start: "#7621E6",
      end: "#A768FF",
    },
    secondaryFull: {
      start: "#00E5E8",
      end: "#5CFEFF",
    },
    createButton: {
      colors: ["#9039FF", "#6594FF", "#2DFDFF"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },

  // Background colors
  background: {
    dark: "#191B1F",
    primary: "#9039FF",
    secondary: "#2DFDFF",
  },

  // UI colors
  ui: {
    strock: "#2A2E31",
    placeholder: "#6B7280",
    white: "#FFFFFF",
    black: "#000000",
    border: "#E5E7EB",
    text: {
      primary: "#FFFFFF",
      secondary: "#D1D5DB",
      dark: "#1A1A1D",
    },
  },
} as const;
