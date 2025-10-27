import {
  CheckmarkBadge04Icon,
  Edit02Icon,
  Invoice01Icon,
  UserGroup03Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const Trips = () => {
  const router = useRouter();
  const { trips, selectTrip, selectedTripId, deleteTrip } = useTrips();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<{ id: string; name: string } | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <View className="p-6 flex-1">
        {trips.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="items-center mb-12">
              <View className="p-4 mb-6">
                {/* added animation */}
                <LottieView
                  source={require("../../assets/animations/travel.json")}
                  autoPlay
                  loop
                  style={{ height: 300, width: 300 }}
                />
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
                  className={`relative p-6 rounded-2xl mb-4 shadow-sm border-2 ${
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
                    {/* added edit button */}
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          router.push({
                            pathname: "/screens/NewTrip",
                            params: { editTripId: item.id },
                          });
                        }}
                        className="bg-[#38E07B] rounded-full p-2 mr-2"
                      >
                        <HugeiconsIcon
                          icon={Edit02Icon}
                          color={"white"}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          setTripToDelete({ id: item.id, name: item.name });
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-500 rounded-full p-2 mr-2"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          color={"white"}
                          size={18}
                        />
                      </TouchableOpacity>
                      {selectedTripId === item.id && (
                        <View className=" px-3 py-1">
                          <HugeiconsIcon
                            icon={CheckmarkBadge04Icon}
                            color={"#38E07B"}
                          />
                        </View>
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <View className="bg-[#E3F5EA] rounded-full p-3 mr-3">
                      <HugeiconsIcon icon={UserGroup03Icon} />
                    </View>
                    <Text className="text-slate-600 font-medium">
                      {item.friends.length} friend
                      {item.friends.length !== 1 ? "s" : ""}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <View className="bg-[#E3F5EA] rounded-full p-3 mr-3">
                      <HugeiconsIcon icon={Invoice01Icon} />
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

            {/* Delete trip confirmation modal */}
            <Modal
              visible={showDeleteModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowDeleteModal(false)}
            >
              <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                  <Text className="text-4xl text-center mb-4">⚠️</Text>
                  <Text className="text-xl font-bold text-slate-800 text-center mb-2">
                    Delete Trip?
                  </Text>
                  <Text className="text-slate-600 text-center mb-6 leading-5">
                    This will permanently delete &quot;{tripToDelete?.name}&quot; and all its friends and expenses. This action cannot be undone.
                  </Text>

                  <View className="space-y-3 gap-2">
                    <TouchableOpacity
                      onPress={async () => {
                        if (tripToDelete) {
                          await Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success
                          );
                          deleteTrip(tripToDelete.id);
                        }
                        setShowDeleteModal(false);
                        setTripToDelete(null);
                      }}
                      className="bg-red-500 rounded-xl p-4"
                    >
                      <Text className="text-white font-bold text-center text-lg">
                        Yes, Delete Trip
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowDeleteModal(false)}
                      className="bg-gray-200 rounded-xl p-4"
                    >
                      <Text className="text-slate-700 font-semibold text-center text-lg">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Trips;
