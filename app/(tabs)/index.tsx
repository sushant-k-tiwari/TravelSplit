import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const Trips = () => {
  const router = useRouter();
  const { trips, selectTrip, selectedTripId } = useTrips();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5 flex-1">
        {trips.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <TouchableOpacity
              className="bg-[#38E07B] p-4 rounded-md"
              onPress={() => router.push("/screens/NewTrip")}
            >
              <Text className="font-bold text-xl text-white text-center">
                Create New Trip
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-xl font-bold mb-2">Your Trips</Text>
            <FlatList
              data={trips}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectTrip(item.id)}
                  className={`p-4 rounded-md mb-3 ${
                    selectedTripId === item.id ? "bg-[#CFF7DD]" : "bg-[#E3F5EA]"
                  }`}
                >
                  <Text className="font-semibold text-lg">{item.name}</Text>
                  <Text className="text-slate-500">
                    {item.friends.length} friends
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="bg-[#38E07B] p-4 rounded-md mt-2 absolute bottom-16 right-6"
              onPress={() => router.push("/screens/NewTrip")}
            >
              <Text className="font-bold text-xl text-white text-center">
                Create New Trip
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Trips;
