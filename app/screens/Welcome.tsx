import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcome = () => {
  const router = useRouter();
  const { setUserName } = useTrips();
  const [name, setName] = useState("");

  // If a name is already stored, skip this screen
  useEffect(() => {
    const checkStoredName = async () => {
      try {
        const stored = await AsyncStorage.getItem("travelsplit_user_name");
        if (stored && stored.trim().length > 0) {
          router.replace("/(tabs)");
        }
      } catch {
        // ignore and stay on screen
      }
    };
    checkStoredName();
  }, [router]);

  const handleContinue = () => {
    if (name.trim().length > 0) {
      setUserName(name.trim());
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      {/* Keyboard Avoiding added*/}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 justify-center items-center px-6">
            {/* Header Section */}
            <View className="items-center mb-16">
              <View className=" rounded-full p-4 mb-4">
                <LottieView 
                source={require("../../assets/animations/airplane.json")}
                autoPlay
                loop
                style={{height:215, width: 215}}
                />
              </View>
              <Text className="text-4xl font-bold text-slate-800 text-center mb-4">
                TravelSplit
              </Text>
              <Text className="text-lg text-slate-600 text-center leading-6 max-w-sm">
                Split your travel expenses easily with friends and family
              </Text>
            </View>

            {/* Name Input Section */}
            <View className="w-full mb-8">
              <Text className="text-xl font-semibold mb-4 text-slate-700 text-center">
                What&#39;s your name?
              </Text>

              <View className="bg-white rounded-2xl p-1 shadow-sm border border-[#E3F5EA]">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name..."
                  placeholderTextColor="#94A3B8"
                  className="w-full h-16 px-6 text-xl text-slate-800 font-medium"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              disabled={name.trim().length === 0}
              onPress={handleContinue}
              className={`w-full h-16 rounded-2xl items-center justify-center shadow-lg ${
                name.trim().length > 0 ? "bg-[#38E07B]" : "bg-gray-300"
              }`}
            >
              <Text
                className={`text-xl font-bold ${
                  name.trim().length > 0 ? "text-white" : "text-gray-500"
                }`}
              >
                Get Started
              </Text>
            </TouchableOpacity>

            {/* Footer Section */}
            <Text className="text-sm text-slate-500 text-center mt-8 leading-5">
              Start splitting your travel expenses today
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Welcome;
