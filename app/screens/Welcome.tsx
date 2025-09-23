import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTrips } from "../context/TripsContext";

const Welcome = () => {
  const router = useRouter();
  const { setUserName } = useTrips();
  return (
    <View className="flex-1 p-8 items-center justify-center bg-white flex-col gap-4">
      <TextInput
        onChangeText={(text) => {
          setUserName(text);
        }}
        placeholder="Enter your name..."
        className="w-[90%] h-16 border border-gray-300 rounded-xl p-2 text-xl"
      />
      <TouchableOpacity
        className="bg-[#38e07b] rounded-xl h-16 w-[90%] items-center justify-center"
        onPress={() => router.push("/(tabs)")}
      >
        <Text className="text-white text-xl">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Welcome;
