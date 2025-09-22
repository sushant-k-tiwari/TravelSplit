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

const defaultYou = { id: "you", name: "You" };

const NewTrip = () => {
  const router = useRouter();
  const { addTrip } = useTrips();

  const [tripName, setTripName] = useState("");
  const [friendNameDraft, setFriendNameDraft] = useState("");
  const [friends, setFriends] = useState([defaultYou]);

  const canCreate = useMemo(
    () => tripName.trim().length > 0 && friends.length >= 1,
    [tripName, friends]
  );

  const addFriend = () => {
    const name = friendNameDraft.trim();
    if (!name) return;
    // id is assigned in context when saving trip; keep ephemeral temp id locally
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-center text-2xl font-bold mb-4">New Trip</Text>

        <TextInput
          value={tripName}
          onChangeText={setTripName}
          placeholder="Trip Name"
          className="p-6 my-2 bg-[#E3F5EA] font-semibold text-md rounded-xl"
        />

        <Text className="text-xl font-bold mt-4 mb-2">Friends</Text>
        <View className="bg-[#E3F5EA] rounded-xl p-4 mb-3">
          <Text className="font-semibold text-lg">You</Text>
          <Text className="font-semibold text-md text-[#38E07B]">
            Organizer
          </Text>
        </View>

        {friends.slice(1).map((f) => (
          <View key={f.id} className="bg-[#E3F5EA] rounded-xl p-4 mb-3">
            <Text className="font-semibold text-lg">{f.name}</Text>
          </View>
        ))}

        <View className="border-2 border-dashed border-[#82E8AB] rounded-xl p-4 mb-6">
          <View className="flex-row items-center">
            <TextInput
              value={friendNameDraft}
              onChangeText={setFriendNameDraft}
              placeholder="Add Friend"
              className="flex-1 px-2 py-3"
            />
            <TouchableOpacity
              onPress={addFriend}
              className="bg-[#38E07B] px-4 py-2 rounded-md"
            >
              <Text className="text-white font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          disabled={!canCreate}
          onPress={onCreate}
          className="bg-[#38E07B] p-4 rounded-md"
        >
          <Text className="text-center text-white font-semibold">
            Create Trip
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewTrip;
