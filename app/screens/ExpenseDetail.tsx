import { Edit02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

const ExpenseDetail = () => {
  const router = useRouter();
  const { expenseId } = useLocalSearchParams();
  const { selectedTrip } = useTrips();

  const expense = selectedTrip?.expenses.find((exp) => exp.id === expenseId);

  if (!expense) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-center text-slate-600">Expense not found</Text>
          <TouchableOpacity
            className="bg-[#38E07B] px-6 py-3 rounded-xl mt-4"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nameOf = (id: string) =>
    selectedTrip?.friends.find((f) => f.id === id)?.name ?? "";

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <View className="flex-1 p-6">
        {/* Header */}
        <View className="flex-row items-center justify-end mb-6">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/AddExpense",
                params: { editExpenseId: expense.id },
              })
            }
            className="bg-[#38E07B] rounded-full p-3 shadow-sm"
          >
            <HugeiconsIcon icon={Edit02Icon} color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Expense Animation */}
        <View className="items-center mb-8">
          <View className="p-4">
            <LottieView
              source={require("../../assets/animations/expense.json")}
              autoPlay
              loop
              style={{ height: 180, width: 180 }}
            />
          </View>
        </View>

        {/* Expense Details Card */}
        <View className="bg-white rounded-3xl p-6  flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* Expense Name */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
                {expense.description}
              </Text>
              <Text className="text-5xl font-bold text-[#38E07B]">
                ₹{expense.amount.toFixed(2)}
              </Text>
              <Text className="text-slate-600 mt-2">
                Split between {expense.splitWithFriendIds.length}{" "}
                {expense.splitWithFriendIds.length === 1 ? "person" : "people"}
              </Text>
            </View>

            {/* Paid By Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-slate-700 mb-4">
                Paid By
              </Text>
              <View className="bg-[#CFF7DD] rounded-2xl p-5 border border-[#38E07B]">
                <View className="flex-row items-center">
                  <View className="bg-[#38E07B] rounded-full p-3 mr-4">
                    {/* <Text className="text-white text-xl font-bold">👤</Text> */}
                    <HugeiconsIcon icon={UserIcon} size={32}/>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-xl text-slate-800">
                      {nameOf(expense.paidByFriendId)}
                    </Text>
                    <Text className="text-slate-600 font-medium">Payer</Text>
                  </View>
                </View>
                {/* Other members chips */}
                {expense.splitWithFriendIds.filter(
                  (id) => id !== expense.paidByFriendId
                ).length > 0 && (
                  <View className="mt-4 flex flex-row items-center gap-4">
                    <Text className="text-slate-700 font-semibold mb-2">
                      With
                    </Text>
                    <View className="flex-row flex-wrap">
                      {expense.splitWithFriendIds
                        .filter((id) => id !== expense.paidByFriendId)
                        .map((id) => (
                          <View
                            key={id}
                            className="bg-white border border-[#E3F5EA] rounded-lg px-3 py-1 mr-2 mb-2"
                          >
                            <Text className="text-slate-700 font-medium">
                              {nameOf(id)}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Summary */}
            <View className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <Text className="text-lg font-semibold text-slate-700 mb-3 text-center">
                Summary
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-600 font-medium">
                  Total Amount:
                </Text>
                <Text className="text-xl font-bold text-slate-800">
                  ₹{expense.amount.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-slate-600 font-medium">
                  Amount per person:
                </Text>
                <Text className="text-xl font-bold text-slate-800">
                  ₹
                  {(expense.amount / expense.splitWithFriendIds.length).toFixed(
                    2
                  )}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExpenseDetail;
