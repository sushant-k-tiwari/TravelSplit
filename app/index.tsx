import { Redirect } from "expo-router";

export default function Index() {
  // Ensure the app always starts at our custom Splash screen
  return <Redirect href="/screens/Splash" />;
}
