import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

const Splash = () => {
  const router = useRouter();
  const [animationDone, setAnimationDone] = useState(false);
  const [targetRoute, setTargetRoute] = useState<"/(tabs)" | "/screens/Welcome" | null>(null);

  // Decide where to go (read from storage)
  useEffect(() => {
    const decideTarget = async () => {
      try {
        const stored = await AsyncStorage.getItem("travelsplit_user_name");
        const trimmed = (stored || "").trim();
        setTargetRoute(trimmed.length > 0 && trimmed !== "You" ? "/(tabs)" : "/screens/Welcome");
      } catch {
        setTargetRoute("/screens/Welcome");
      }
    };
    decideTarget();
  }, []);

  // Fallback in case onAnimationFinish does not fire on some devices
  useEffect(() => {
    const fallback = setTimeout(() => setAnimationDone(true), 2500);
    return () => clearTimeout(fallback);
  }, []);

  // Navigate only after animation finishes at least once AND target is known
  useEffect(() => {
    if (animationDone && targetRoute) {
      router.replace(targetRoute);
    }
  }, [animationDone, targetRoute, router]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <LottieView
        source={require("../../assets/animations/splash.json")}
        autoPlay
        loop={false}
        onAnimationFinish={() => setAnimationDone(true)}
        style={{width:500, height:500}}
        />
        <Text className="text-2xl font-bold text-slate-600 mb-2">TravelSplit</Text>
      </View>
    </SafeAreaView>
  );
};

export default Splash;
