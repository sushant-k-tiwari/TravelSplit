import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const Profile = () => {
  const router = useRouter();
  const { userName, setUserName, trips, clearAllData } = useTrips();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(userName);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const handleUpdateName = () => {
    if (newName.trim().length > 0) {
      setUserName(newName.trim());
      setIsEditingName(false);
    } else {
      Alert.alert("Invalid Name", "Please enter a valid name.");
    }
  };

  const handleCancelEdit = () => {
    setNewName(userName);
    setIsEditingName(false);
  };

  const handleClearAllData = async () => {
    try {
      // Use the context method to clear all data
      await clearAllData();

      // Close the modal
      setShowClearDataModal(false);

      // Redirect to welcome screen
      router.replace("/screens/Welcome");
    } catch (error) {
      console.error("Error clearing data:", error);
      Alert.alert("Error", "Failed to clear data. Please try again.");
    }
  };

  const totalTrips = trips.length;
  const totalExpenses = trips.reduce(
    (acc, trip) => acc + trip.expenses.length,
    0
  );
  const totalAmount = trips.reduce(
    (acc, trip) =>
      acc +
      trip.expenses.reduce((expAcc, expense) => expAcc + expense.amount, 0),
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <ScrollView className="flex-1 px-6">
        {/* Header section */}
        <View className="items-center mb-8 mt-4">
          <Image
            source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
            className="size-32 mb-4 border-green-200 border-2 rounded-full"
          />
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            {userName}
          </Text>
        </View>

        {/* User Information Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#E3F5EA]">
          <Text className="text-xl font-semibold text-slate-800 mb-4">
            User Information
          </Text>
          <View className="mb-4 bg-green-50 border border-green-200 rounded-xl p-5">
            {isEditingName ? (
              <View className="flex-row items-center space-x-2 gap-2">
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter your name"
                  className="flex-1 h-12 px-4 rounded-xl text-slate-800 font-medium"
                  autoFocus
                />
                <TouchableOpacity
                  onPress={handleUpdateName}
                  className="bg-[#38E07B] px-4 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  className="bg-gray-300 px-4 py-3 rounded-xl"
                >
                  <Text className="text-slate-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row items-center justify-between">
                <Text className="text-lg text-slate-800 font-medium">
                  {userName}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  className="bg-[#E3F5EA] px-4 py-2 rounded-lg"
                >
                  <Text className="text-[#38E07B] font-semibold">Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* clear all data card */}
          <TouchableOpacity
            onPress={() => setShowClearDataModal(true)}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🗑️</Text>
              <View>
                <Text className="text-red-700 font-semibold text-lg">
                  Clear All Data
                </Text>
                <Text className="text-red-500 text-sm">
                  Remove all trips and expenses
                </Text>
              </View>
            </View>
            <Text className="text-red-500 text-xl">›</Text>
          </TouchableOpacity>
        </View>
       
      </ScrollView>

      {/* Clear all data confirmation modal*/}
      <Modal
        visible={showClearDataModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearDataModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-4xl text-center mb-4">⚠️</Text>
            <Text className="text-xl font-bold text-slate-800 text-center mb-2">
              Clear All Data?
            </Text>
            <Text className="text-slate-600 text-center mb-6 leading-5">
              This will permanently delete all your trips, expenses, and
              settings. This action cannot be undone.
            </Text>

            <View className="space-y-3 gap-2">
              <TouchableOpacity
                onPress={handleClearAllData}
                className="bg-red-500 rounded-xl p-4"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Yes, Clear All Data
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowClearDataModal(false)}
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
    </SafeAreaView>
  );
};

export default Profile;
