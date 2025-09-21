import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Trips = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      {/* Modal */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-neutral-100 rounded-2xl p-6 w-[90%]">
            <Text className="text-2xl font-bold text-center">New Trip</Text>
            <TextInput
              placeholder="Trip Name"
              className="p-6 my-2 bg-[#E3F5EA] font-semibold text-md rounded-md"
            />
            <View>
              <Text className="text-xl font-bold mt-4">Friends</Text>
              <View className="p-6 my-2 bg-[#E3F5EA] rounded-md">
                <Text className="font-semibold text-lg">You</Text>
                <Text className="font-semibold text-md text-[#82E8AB]">
                  Organizer
                </Text>
              </View>
            </View>
            <TouchableOpacity className="border-dashed border-2 border-[#82E8AB] rounded-md p-6 flex-row justify-center items-center">
              <Text className="text-center font-semibold text-[#82E8AB] text-lg">
                Add Friends
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-[#38E07B] p-4 rounded-full mt-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-white font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Screen Content */}
      <TouchableOpacity
        className="bg-[#38E07B] p-4 rounded-full"
        onPress={() => setModalVisible(true)}
      >
        <Text className="font-bold text-xl text-white px-2">
          Create New Trip
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Trips;
