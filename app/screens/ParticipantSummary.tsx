import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick04Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomToast from "../components/CustomToast";
import { useTrips } from "../context/TripsContext";
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";

type BalanceMap = Record<string, number>;

const ParticipantSummary = () => {
  const router = useRouter();
  const { participantId } = useLocalSearchParams<{ participantId: string }>();
  const { selectedTrip, toggleExpenseSettled } = useTrips();

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Settlement state - track which debts are settled/received
  const [settledDebts, setSettledDebts] = useState<Set<string>>(new Set());
  const [receivedDebts, setReceivedDebts] = useState<Set<string>>(new Set());

  // Persistence keys
  const storageKey = (suffix: string) =>
    `travelsplit_participant_settlement_${selectedTrip?.id || "no_trip"}_$${
      participantId || "no_participant"
    }_${suffix}`;

  // Load persisted local toggle state on mount/when trip or participant changes
  useEffect(() => {
    const load = async () => {
      try {
        const [settledStr, receivedStr] = await Promise.all([
          AsyncStorage.getItem(storageKey("settled")),
          AsyncStorage.getItem(storageKey("received")),
        ]);
        if (settledStr) setSettledDebts(new Set(JSON.parse(settledStr)));
        else setSettledDebts(new Set());
        if (receivedStr) setReceivedDebts(new Set(JSON.parse(receivedStr)));
        else setReceivedDebts(new Set());
      } catch (e) {
        // ignore read errors; keep defaults
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip?.id, participantId]);

  const persistState = async (
    nextSettled: Set<string>,
    nextReceived: Set<string>
  ) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          storageKey("settled"),
          JSON.stringify(Array.from(nextSettled))
        ),
        AsyncStorage.setItem(
          storageKey("received"),
          JSON.stringify(Array.from(nextReceived))
        ),
      ]);
    } catch (e) {
      // ignore write errors silently
    }
  };

  const { participant, netBalance, owesTo, owedBy, unsettledExpenses } =
    useMemo(() => {
      if (!selectedTrip || !participantId) {
        return {
          participant: null,
          netBalance: 0,
          owesTo: [],
          owedBy: [],
          unsettledExpenses: [],
        };
      }

      const participant = selectedTrip.friends.find(
        (f) => f.id === participantId
      );
      if (!participant) {
        return {
          participant: null,
          netBalance: 0,
          owesTo: [],
          owedBy: [],
          unsettledExpenses: [],
        };
      }

      const net: BalanceMap = {};
      const pair: Record<string, Record<string, number>> = {};

      selectedTrip.friends.forEach((f) => {
        net[f.id] = 0;
        pair[f.id] = {};
      });

      // Only process unsettled expenses
      const unsettledExpensesList = selectedTrip.expenses.filter(
        (e) => !e.settled
      );

      for (const e of unsettledExpensesList) {
        const participants = e.splitWithFriendIds.length;
        if (participants === 0) continue;
        const share = e.amount / participants;

        // payer pays amount; participants owe share
        net[e.paidByFriendId] += e.amount;
        for (const p of e.splitWithFriendIds) {
          net[p] -= share;
          if (p !== e.paidByFriendId) {
            // p owes payer share
            const prev = pair[p][e.paidByFriendId] ?? 0;
            pair[p][e.paidByFriendId] = prev + share;
          }
        }
      }

      // reduce pairwise by offsetting mutual debts
      for (const a of Object.keys(pair)) {
        for (const b of Object.keys(pair[a])) {
          const ab = pair[a][b] ?? 0;
          const ba = pair[b]?.[a] ?? 0;
          const delta = ab - ba;
          if (delta >= 0) {
            pair[a][b] = delta;
            if (pair[b]) pair[b][a] = 0;
          } else {
            pair[b][a] = -delta;
            pair[a][b] = 0;
          }
        }
      }

      const nameOf = (id: string) =>
        selectedTrip.friends.find((f) => f.id === id)?.name ?? "";

      const owesTo: { name: string; amount: number; friendId: string }[] = [];
      const owedBy: { name: string; amount: number; friendId: string }[] = [];

      // who they owe
      const owes = pair[participantId] || {};
      for (const to of Object.keys(owes)) {
        const amt = owes[to];
        if (amt > 0) {
          owesTo.push({
            name: nameOf(to),
            amount: amt,
            friendId: to,
          });
        }
      }

      // who owes them
      for (const from of Object.keys(pair)) {
        const amt = pair[from]?.[participantId] ?? 0;
        if (amt > 0) {
          owedBy.push({
            name: nameOf(from),
            amount: amt,
            friendId: from,
          });
        }
      }

      return {
        participant,
        netBalance: net[participantId] ?? 0,
        owesTo,
        owedBy,
        unsettledExpenses: unsettledExpensesList,
      };
    }, [selectedTrip, participantId]);

  if (!selectedTrip || !participant) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-[#F8FFFE] to-white">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-slate-600">Participant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const netLabel =
    netBalance === 0 ? "Settled" : netBalance > 0 ? "Owed" : "You owe";
  const netValue = Math.abs(netBalance).toFixed(2);
  const isSettled = netBalance === 0;
  const isOwed = netBalance > 0;

  // Settlement handlers
  const handleDebtCardTap = (
    debt: { name: string; amount: number; friendId: string },
    type: "owes" | "owed"
  ) => {
    const debtKey = `${debt.friendId}-${debt.amount}`;

    if (type === "owes") {
      // User owes money - toggle settled status
      if (settledDebts.has(debtKey)) {
        // Already settled, undo it
        setSettledDebts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(debtKey);
          // persist with current receivedDebts
          persistState(newSet, receivedDebts);
          return newSet;
        });
        setToast({
          visible: true,
          message: `Reversed settlement of ₹${debt.amount.toFixed(2)} with ${debt.name}`,
          type: "info",
        });
      } else {
        // Not settled, mark as settled
        setSettledDebts((prev) => {
          const newSet = new Set([...prev, debtKey]);
          persistState(newSet, receivedDebts);
          return newSet;
        });
        setToast({
          visible: true,
          message: `Settled ₹${debt.amount.toFixed(2)} with ${debt.name}`,
          type: "success",
        });
      }
    } else {
      // User is owed money - toggle received status
      if (receivedDebts.has(debtKey)) {
        // Already received, undo it
        setReceivedDebts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(debtKey);
          // persist with current settledDebts
          persistState(settledDebts, newSet);
          return newSet;
        });
        setToast({
          visible: true,
          message: `Reversed receipt of ₹${debt.amount.toFixed(2)} from ${debt.name}`,
          type: "info",
        });
      } else {
        // Not received, mark as received
        setReceivedDebts((prev) => {
          const newSet = new Set([...prev, debtKey]);
          persistState(settledDebts, newSet);
          return newSet;
        });
        setToast({
          visible: true,
          message: `Received ₹${debt.amount.toFixed(2)} from ${debt.name}`,
          type: "success",
        });
      }
    }
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

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
            <HugeiconsIcon icon={UserIcon} size={80} />
          </View>
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            {participant.name}
          </Text>
          <Text className="text-slate-600 text-center">
            {selectedTrip.name}
          </Text>
        </View>

        {/* Balance Overview */}
        <View
          className={`rounded-2xl mb-6 p-6  ${
            isSettled
              ? "bg-white"
              : isOwed
                ? "bg-white border-[#28A745]"
                : "bg-white border-[#DC3545]"
          }`}
        >
          <View className="flex-row items-center justify-between mb-4">
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
                <HugeiconsIcon icon={UserIcon} size={32} />
              </View>
              <View>
                <Text className="font-bold text-xl text-slate-800">
                  {participant.name}
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
                  Net: {netLabel} ₹{netValue}
                </Text>
              </View>
            </View>
            {isSettled && (
              <View className="bg-[#38E07B] rounded-full px-3 py-1">
                <Text className="text-white text-sm font-semibold">
                  ✓ Settled
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Owes To Section */}
        {owesTo.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-slate-800 mb-4">
              {participant.name} owes to:
            </Text>
            {owesTo.map((debt, index) => {
              const debtKey = `${debt.friendId}-${debt.amount}`;
              const isSettled = settledDebts.has(debtKey);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDebtCardTap(debt, "owes")}
                  className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${
                    isSettled
                      ? "border-green-300 bg-green-50"
                      : "border-[#E3F5EA]"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`rounded-full p-2 size-12 mr-3 flex justify-center items-center ${
                          isSettled ? "bg-green-500" : "bg-[#DC3545]"
                        }`}
                      >
                        <Text className="text-white text-lg font-bold text-center">
                          {isSettled ? (
                            <HugeiconsIcon icon={Tick04Icon} color={"white"} />
                          ) : (
                            <HugeiconsIcon icon={ArrowLeft01Icon} />
                          )}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-lg text-slate-800">
                          {debt.name}
                        </Text>
                        {isSettled && (
                          <View className="bg-green-500 rounded-full px-3 py-1 mt-1 self-start">
                            <Text className="text-white text-xs font-semibold">
                              Settled
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text
                      className={`font-bold text-lg ${
                        isSettled ? "text-green-600" : "text-[#DC3545]"
                      }`}
                    >
                      ₹{debt.amount.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Owed By Section */}
        {owedBy.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-slate-800 mb-4">
              Owes to {participant.name}:
            </Text>
            {owedBy.map((debt, index) => {
              const debtKey = `${debt.friendId}-${debt.amount}`;
              const isReceived = receivedDebts.has(debtKey);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDebtCardTap(debt, "owed")}
                  className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${
                    isReceived
                      ? "border-green-300 bg-green-50"
                      : "border-[#E3F5EA]"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`rounded-full p-2 size-12 mr-3 flex items-center justify-center ${
                          isReceived ? "bg-green-500" : "bg-[#28A745]"
                        }`}
                      >
                        <Text className="text-white text-lg font-bold text-center">
                          {isReceived ? (
                            <HugeiconsIcon icon={Tick04Icon} color={"white"} />
                          ) : (
                            <HugeiconsIcon icon={ArrowRight01Icon} />
                          )}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-lg text-slate-800">
                          {debt.name}
                        </Text>
                        {isReceived && (
                          <View className="bg-green-500 rounded-full px-3 py-1 mt-1 self-start">
                            <Text className="text-white text-xs font-semibold">
                              Received
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text
                      className={`font-bold text-lg ${
                        isReceived ? "text-green-600" : "text-[#28A745]"
                      }`}
                    >
                      ₹{debt.amount.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* No Balances */}
        {owesTo.length === 0 && owedBy.length === 0 && (
          <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[#E3F5EA]">
            <Text className="text-slate-500 text-center text-lg">
              {isSettled ? "All settled up!" : "No outstanding balances"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Custom Toast */}
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

export default ParticipantSummary;
