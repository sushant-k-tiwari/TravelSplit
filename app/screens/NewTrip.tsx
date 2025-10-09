import { AddCircleHalfDotIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
    Keyboard.dismiss();
  };

  const onCreate = () => {
    if (!canCreate) return;
    addTrip({ name: tripName, friends });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={80}
          keyboardOpeningTime={0}
          contentContainerStyle={{ padding: 24, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View className="p-4">
              <LottieView
                source={require("../../assets/animations/travel.json")}
                autoPlay
                loop
                style={{ height: 150, width: 150 }}
              />
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
                returnKeyType="done"
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
                <View className="flex-1">
                  <Text className="font-bold text-xl text-white">
                    {userName || "You"}
                  </Text>
                  <Text className="text-white/90 font-medium">Organizer</Text>
                </View>
              </View>
            </View>

            {/* Other Friends */}
            {friends.slice(1).map((friend) => (
              <View
                key={friend.id}
                className="bg-white rounded-2xl p-5 mb-3 shadow-sm border border-[#E3F5EA]"
              >
                <View className="flex-row items-center">
                  <View className="bg-[#E3F5EA] rounded-full p-3 mr-4 size-14 justify-center items-center">
                    <HugeiconsIcon icon={UserIcon} size={32} />
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
                <View className="bg-[#E3F5EA] rounded-full mr-4">
                  <HugeiconsIcon icon={AddCircleHalfDotIcon} size={32} />
                </View>

                <TextInput
                  value={friendNameDraft}
                  onChangeText={setFriendNameDraft}
                  placeholder="Add friend's name"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 p-3 text-lg font-medium text-slate-800"
                  onSubmitEditing={addFriend}
                  returnKeyType="done"
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
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default NewTrip;
