import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";

type BalanceMap = Record<string, number>;

const Summary = () => {
  const router = useRouter();
  const { selectedTrip } = useTrips();

  const { netByFriend } = useMemo(() => {
    const net: BalanceMap = {};
    if (!selectedTrip) return { netByFriend: net };

    selectedTrip.friends.forEach((f) => {
      net[f.id] = 0;
    });

    // Only process unsettled expenses
    const unsettledExpenses = selectedTrip.expenses.filter((e) => !e.settled);

    for (const e of unsettledExpenses) {
      const participants = e.splitWithFriendIds.length;
      if (participants === 0) continue;
      const share = e.amount / participants;

      // payer pays amount; participants owe share
      net[e.paidByFriendId] += e.amount;
      for (const p of e.splitWithFriendIds) {
        net[p] -= share;
      }
    }

    return { netByFriend: net };
  }, [selectedTrip]);

  if (!selectedTrip) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
        <View className="flex-1 items-center justify-center p-6">
          <View className="items-center">
            <View className="bg-[#E3F5EA] rounded-full p-8 mb-6">
              <Text className="text-6xl">📊</Text>
            </View>
            <Text className="text-2xl font-bold text-slate-800 mb-3">
              No trip selected
            </Text>
            <Text className="text-slate-600 text-center max-w-xs">
              Select a trip from the Trips tab to view expense summary
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const unsettledExpenses = selectedTrip.expenses.filter((e) => !e.settled);
  const totalUnsettled = unsettledExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-[#E3F5EA] rounded-full p-6 mb-4">
            <Text className="text-4xl">📊</Text>
          </View>
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            Expense Summary
          </Text>
          <Text className="text-slate-600 text-center text-2xl mt-4 font-semibold">
            {selectedTrip.name}
          </Text>
        </View>

        {/* Trip Stats */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#E3F5EA]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-slate-700">
              Trip Overview
            </Text>
            {/* <View className="bg-[#38E07B] rounded-full px-4 py-2">
              <Text className="text-white font-bold">
                {unsettledExpenses.length} unsettled
              </Text>
            </View> */}
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-800">
                {selectedTrip.friends.length}
              </Text>
              <Text className="text-slate-600">Members</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-slate-800">
                ₹{totalUnsettled.toFixed(2)}
              </Text>
              <Text className="text-slate-600">Unsettled</Text>
            </View>
          </View>
        </View>

        {/* Participant Cards */}
        <Text className="text-xl font-bold text-slate-800 mb-4">
          Participants
        </Text>
        {selectedTrip.friends.map((friend) => {
          const net = netByFriend[friend.id] ?? 0;
          const netLabel = net === 0 ? "Settled" : net > 0 ? "Owed" : "You owe";
          const netValue = Math.abs(net).toFixed(2);
          const isSettled = net === 0;
          const isOwed = net > 0;

          return (
            <TouchableOpacity
              key={friend.id}
              onPress={() =>
                router.push(
                  `/screens/ParticipantSummary?participantId=${friend.id}`
                )
              }
              className={`rounded-2xl mb-4 p-6 border-1 ${
                isSettled
                  ? "bg-white border-[#38E07B]"
                  : isOwed
                    ? "bg-white border-[#28A745]"
                    : "bg-white border-[#DC3545]"
              }`}
              // style={{
              //   shadowColor: "#000",
              //   shadowOffset: { width: 0, height: 2 },
              //   shadowOpacity: 0.1,
              //   shadowRadius: 8,
              //   elevation: 3,
              // }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className={`rounded-full p-3 mr-4 ${
                      isSettled
                        ? "bg-[#38E07B]"
                        : isOwed
                          ? "bg-[#28A745]"
                          : "bg-[#DC3545]"
                    }`}
                  >
                    <Text className="text-white text-xl font-bold">👤</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-xl text-slate-800">
                      {friend.name}
                    </Text>
                    <Text
                      className={`font-semibold ${
                        isSettled
                          ? "text-[#38E07B]"
                          : isOwed
                            ? "text-[#28A745]"
                            : "text-[#DC3545]"
                      }`}
                    >
                      {netLabel} ₹{netValue}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  {isSettled && (
                    <View className="bg-[#38E07B] rounded-full px-3 py-1 mr-3">
                      <Text className="text-white text-sm font-semibold">
                        ✓ Settled
                      </Text>
                    </View>
                  )}
                  <Text className="text-slate-500 text-2xl">›</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;
