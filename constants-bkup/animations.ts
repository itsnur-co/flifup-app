/**
 * Animation timing and configuration constants
 * Ensures consistent animation behavior across the app
 */
export const AnimationConfig = {
  // Splash screen animation timings
  splash: {
    roadLinesDuration: 1500,
    logoAppearDelay: 800,
    logoFadeDuration: 600,
    circleExpandDelay: 1800,
    circleExpandDuration: 800,
    totalDuration: 3000,
  },

  // Easing configurations
  easing: {
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;
