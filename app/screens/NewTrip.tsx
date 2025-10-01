import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const NewTrip = () => {
  const router = useRouter();
  const { addTrip, userName } = useTrips();

  const [tripName, setTripName] = useState("");
  const [friendNameDraft, setFriendNameDraft] = useState("");
  const [friends, setFriends] = useState([
    { id: "you", name: userName || "You" },
  ]);

  const canCreate = useMemo(
    () => tripName.trim().length > 0 && friends.length >= 1,
    [tripName, friends]
  );

  const addFriend = () => {
    const name = friendNameDraft.trim();
    if (!name) return;
    setFriends((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, name },
    ]);
    setFriendNameDraft("");
  };

  const onCreate = () => {
    if (!canCreate) return;
    const id = addTrip({ name: tripName, friends });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-[#E3F5EA] rounded-full p-6 mb-4">
            <Text className="text-4xl">✈️</Text>
          </View>
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            Create New Trip
          </Text>
          <Text className="text-slate-600 text-center">
            Plan your next adventure with friends
          </Text>
        </View>

        {/* Trip Name Input */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-3">
            Trip Name
          </Text>
          <View className="bg-white rounded-2xl p-1 shadow-sm border border-[#E3F5EA]">
            <TextInput
              value={tripName}
              onChangeText={setTripName}
              placeholder="e.g., Summer Europe Trip"
              placeholderTextColor="#94A3B8"
              className="p-5 text-lg font-medium text-slate-800"
            />
          </View>
        </View>

        {/* Friends Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-4">
            Trip Members
          </Text>

          {/* Organizer */}
          <View className="bg-[#38E07B] rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row items-center">
              {/* <View className="rounded-full p-3 mr-4">
                <Text className="text-white text-xl font-bold">👑</Text>
              </View> */}
              <View className="flex-1 ">
                <Text className="font-bold text-xl text-white">
                  {userName || "You"}
                </Text>
                <Text className="text-white/90 font-medium">Organizer</Text>
              </View>
            </View>
          </View>

          {/* Other Friends */}
          {friends.slice(1).map((friend, index) => (
            <View
              key={friend.id}
              className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-[#E3F5EA]"
            >
              <View className="flex-row items-center">
                <View className="bg-[#E3F5EA] rounded-full p-3 mr-4 size-14 justify-center items-center">
                  <Text className="text-[#38E07B] text-xl font-bold">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-slate-800">
                    {friend.name}
                  </Text>
                  <Text className="text-slate-600 font-medium">Member</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Add Friend Input */}
          <View className="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-[#38E07B]">
            <View className="flex-row items-center">
              <View className="bg-[#E3F5EA] rounded-full p-3 mr-4">
                <Text className="text-[#38E07B] text-xl font-bold">➕</Text>
              </View>
              <TextInput
                value={friendNameDraft}
                onChangeText={setFriendNameDraft}
                placeholder="Add friend's name"
                placeholderTextColor="#94A3B8"
                className="flex-1 p-3 text-lg font-medium text-slate-800"
                onSubmitEditing={addFriend}
              />
              <TouchableOpacity
                onPress={addFriend}
                disabled={!friendNameDraft.trim()}
                className={`px-6 py-3 rounded-xl ${
                  friendNameDraft.trim() ? "bg-[#38E07B]" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    friendNameDraft.trim() ? "text-white" : "text-gray-500"
                  }`}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          disabled={!canCreate}
          onPress={onCreate}
          className={`p-6 rounded-2xl shadow-lg ${
            canCreate ? "bg-[#38E07B]" : "bg-gray-300"
          }`}
        >
          <Text
            className={`text-center text-xl font-bold ${
              canCreate ? "text-white" : "text-gray-500"
            }`}
          >
            Create Trip
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewTrip;
