import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTrips } from "../context/TripsContext";

const Expenses = () => {
  const router = useRouter();
  const { selectedTrip } = useTrips();

  if (!selectedTrip) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="mb-4 text-slate-600 text-center">
          Select a trip in the Trips tab to add Expenses.
        </Text>
        <TouchableOpacity
          className="bg-[#38E07B] px-5 py-3 rounded-md"
          onPress={() => router.push("/screens/NewTrip")}
        >
          <Text className="text-white font-semibold">Create New Trip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-5">
      <View className="p-8 bg-neutral-100 rounded-md">
        <Text className="text-2xl font-bold mb-2">{selectedTrip.name}</Text>
        <Text className="text-slate-500 mb-6">
          {selectedTrip.friends.length} friends
        </Text>
        <TouchableOpacity
          className="bg-[#38E07B] p-4 rounded-md"
          onPress={() => router.push("/screens/AddExpense")}
        >
          <Text className="text-center text-white font-semibold">
            Add Expense
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Expenses;
