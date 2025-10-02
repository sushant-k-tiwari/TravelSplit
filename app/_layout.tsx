import { Stack } from "expo-router";
import { TripsProvider } from "./context/TripsContext";

export default function RootLayout() {
  return (
    <TripsProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="screens/Welcome"
      >
        <Stack.Screen name="screens/Welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="screens/NewTrip" />
        <Stack.Screen name="screens/AddExpense" />
        <Stack.Screen name="screens/ParticipantSummary" />
      </Stack>
    </TripsProvider>
  );
}
