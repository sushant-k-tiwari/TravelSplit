import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const Expenses = () => {
  const router = useRouter();
  const { selectedTrip } = useTrips();

  if (!selectedTrip) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
        <View className="flex-1 items-center justify-center p-6">
          <View className="items-center">
            <View className="p-4 mb-6">
              <LottieView
                source={require("../../assets/animations/expense.json")}
                autoPlay
                loop
                style={{ height: 300, width: 300 }}
              />
            </View>
            <Text className="text-2xl font-bold text-slate-800 mb-3">
              No trip selected
            </Text>
            <Text className="text-slate-600 text-center mb-8 max-w-xs">
              Select a trip from the Trips tab to start adding expenses
            </Text>
            <TouchableOpacity
              className="bg-[#38E07B] px-8 py-4 rounded-2xl shadow-lg"
              onPress={() => router.push("/screens/NewTrip")}
            >
              <Text className="text-white font-bold text-lg">
                Create New Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const nameOf = (id: string) =>
    selectedTrip.friends.find((f) => f.id === id)?.name ?? "";

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            {selectedTrip.name}
          </Text>
          <Text className="text-slate-600">
            {selectedTrip.friends.length} friend
            {selectedTrip.friends.length !== 1 ? "s" : ""} •{" "}
            {selectedTrip.expenses.length} expense
            {selectedTrip.expenses.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Expenses List */}
        {selectedTrip.expenses.length === 0 ? (
          <View className="items-center justify-center py-12">
            <View className="p-4 mb-6">
              <LottieView
                source={require("../../assets/animations/expense.json")}
                autoPlay
                loop
                style={{ height: 300, width: 300 }}
              />
            </View>
            <Text className="text-xl font-bold text-slate-800 mb-3">
              No expenses yet
            </Text>
            <Text className="text-slate-600 text-center mb-8 max-w-xs">
              Start tracking your trip expenses by adding the first one
            </Text>
          </View>
        ) : (
          <FlatList
            data={selectedTrip.expenses}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screens/ExpenseDetail",
                    params: { expenseId: item.id },
                  })
                }
                className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-[#E3F5EA]"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="font-bold text-lg text-slate-800 flex-1">
                    {item.description}
                  </Text>
                  <View className="flex-row items-center gap-4">
                    <Text className="font-bold text-xl text-slate-800">
                      ₹{item.amount.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push({
                          pathname: "/screens/AddExpense",
                          params: { editExpenseId: item.id },
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
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-600">
                    Paid by{" "}
                    <Text className="font-semibold text-slate-700">
                      {nameOf(item.paidByFriendId)}
                    </Text>
                  </Text>
                  <Text className="text-slate-600">
                    Split with {item.splitWithFriendIds.length} friends
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Add Expense Button */}
        <TouchableOpacity
          className="bg-[#38E07B] p-6 rounded-2xl shadow-lg"
          onPress={() => router.push("/screens/AddExpense")}
        >
          <Text className="text-center text-white font-bold text-xl">
            + Add Expense
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Expenses;
