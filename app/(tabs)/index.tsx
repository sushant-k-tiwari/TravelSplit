import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
const index = () => {
  return (
      <View className="flex-1 bg-white justify-center items-center">
        <View className="mb-16">
        <HugeiconsIcon icon={Analytics01Icon} size={80} color="#38E07B"/>
      </View>
      <Text
        className="text-4xl font-bold text-center px-24"
        style={{ textAlignVertical: "center" }}
      >
        Split Travel expenses with Friends
      </Text>
      <Text className="text-xl p-8 text-neutral-500 text-center ">
        Easily track and split expenses on your trips with friends
      </Text>
      <TouchableOpacity className="bg-[#38E07B] p-4 rounded-full ">
        <Text>Create New Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
