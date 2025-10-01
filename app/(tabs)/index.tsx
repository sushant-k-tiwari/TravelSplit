import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const Trips = () => {
  const router = useRouter();
  const { trips, selectTrip, selectedTripId, deleteTrip } = useTrips();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <View className="p-6 flex-1">
        {trips.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="items-center mb-12">
              <View className="bg-[#E3F5EA] rounded-full p-8 mb-6">
                <Text className="text-6xl">✈️</Text>
              </View>
              <Text className="text-2xl font-bold text-slate-800 mb-3">
                No trips yet
              </Text>
              <Text className="text-slate-600 text-center mb-8 max-w-xs">
                Create your first trip to start splitting expenses with friends
              </Text>
              <TouchableOpacity
                className="bg-[#38E07B] px-8 py-4 rounded-2xl shadow-lg"
                onPress={() => router.push("/screens/NewTrip")}
              >
                <Text className="font-bold text-xl text-white">
                  Create Your First Trip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-3xl font-bold text-slate-800">
                Your Trips
              </Text>
              <View className="bg-[#38E07B] rounded-full p-3 size-12 items-center">
                <Text className="text-white font-bold text-lg">
                  {trips.length}
                </Text>
              </View>
            </View>

            <FlatList
              data={trips}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectTrip(item.id)}
                  onLongPress={() =>
                    Alert.alert(
                      "Delete trip?",
                      `Are you sure you want to delete "${item.name}" and all its data (friends and expenses)? This cannot be undone.`,
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteTrip(item.id),
                        },
                      ]
                    )
                  }
                  className={`p-6 rounded-2xl mb-4 shadow-sm border-2 ${
                    selectedTripId === item.id
                      ? "bg-[#CFF7DD] border-[#38E07B]"
                      : "bg-white border-[#E3F5EA]"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <Text className="font-bold text-xl text-slate-800 flex-1">
                      {item.name}
                    </Text>
                    {selectedTripId === item.id && (
                      <View className="bg-[#38E07B] rounded-full px-3 py-1">
                        <Text className="text-white text-sm font-semibold">
                          Selected
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="bg-[#E3F5EA] rounded-full p-2 mr-3">
                      <Text className="text-[#38E07B] font-bold">👥</Text>
                    </View>
                    <Text className="text-slate-600 font-medium">
                      {item.friends.length} friend
                      {item.friends.length !== 1 ? "s" : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-[#E3F5EA] rounded-full p-2 mr-3">
                      <Text className="text-[#38E07B] font-bold">💰</Text>
                    </View>
                    <Text className="text-slate-600 font-medium">
                      {item.expenses.length} expense
                      {item.expenses.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              className="bg-[#38E07B] p-5 rounded-2xl shadow-lg mb-6"
              onPress={() => router.push("/screens/NewTrip")}
            >
              <Text className="font-bold text-xl text-white text-center">
                + Create New Trip
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Trips;
