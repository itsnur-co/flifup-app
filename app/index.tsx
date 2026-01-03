import { Redirect } from "expo-router";

/**
 * Root Index - Always redirect to splash screen
 * This ensures the app always starts with the splash animation
 */
export default function Index() {
  return <Redirect href="/splash" />;
}
