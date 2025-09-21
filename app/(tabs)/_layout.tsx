import {
  Briefcase01Icon,
  Mailbox01Icon,
  Money01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"dark-content"} />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              flex: 1,
              justifyContent: "center",
              // elevation: 0,
              backgroundColor: "#fff",
              borderTopWidth: 0,
              marginBottom: -24,
              height: 80,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
            },
            tabBarActiveTintColor: "#38E07B",
            tabBarInactiveTintColor: "#64748B",
          }}
          initialRouteName="index"
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Trips",
              tabBarIcon: ({ focused }) => (
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  color={focused ? "#38E07B" : "#64748B"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="expenses"
            options={{
              title: "Expenses",
              tabBarIcon: ({ focused }) => (
                <HugeiconsIcon
                  icon={Money01Icon}
                  color={focused ? "#38E07B" : "#64748B"}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="summary"
            options={{
              title: "Summary",
              tabBarIcon: ({ focused }) => (
                <HugeiconsIcon
                  icon={Mailbox01Icon}
                  color={focused ? "#38E07B" : "#64748B"}
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
