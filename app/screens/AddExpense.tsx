import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTrips } from "../context/TripsContext";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { UserIcon } from "@hugeicons/core-free-icons";

// const currencies = ["INR"]; // simple list will add other currencies later

const AddExpense = () => {
  const router = useRouter();
  const { editExpenseId } = useLocalSearchParams();
  const { selectedTrip, addExpense, editExpense } = useTrips();

  const [paidById, setPaidById] = useState<string | null>(
    selectedTrip?.friends[0]?.id ?? null
  );
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedTrip ? selectedTrip.friends.map((f) => f.id) : []
  );

  const isEditMode = Boolean(editExpenseId);
  const expenseToEdit = selectedTrip?.expenses.find(
    (expense) => expense.id === editExpenseId
  );

  // Initialize form with expense data if in edit mode
  useEffect(() => {
    if (isEditMode && expenseToEdit) {
      setPaidById(expenseToEdit.paidByFriendId);
      setAmount(expenseToEdit.amount.toString());
      setCurrency(expenseToEdit.currency);
      setDescription(expenseToEdit.description);
      setSelectedIds(expenseToEdit.splitWithFriendIds);
    }
  }, [isEditMode, expenseToEdit]);

  const canSave = useMemo(() => {
    const a = parseFloat(amount);
    return (
      !!selectedTrip && paidById && !isNaN(a) && a > 0 && selectedIds.length > 0
    );
  }, [amount, selectedTrip, paidById, selectedIds]);

  if (!selectedTrip) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-center text-slate-600">
          Please select a trip from the Trips tab first.
        </Text>
      </SafeAreaView>
    );
  }

  const toggleParticipant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onAdd = () => {
    if (!canSave || !paidById || !selectedTrip) return;

    const expenseData = {
      amount: parseFloat(amount),
      currency,
      description: description.trim(),
      paidByFriendId: paidById,
      splitWithFriendIds: selectedIds,
    };

    if (isEditMode && editExpenseId) {
      editExpense(selectedTrip.id, editExpenseId as string, expenseData);
    } else {
      addExpense(selectedTrip.id, expenseData);
    }

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
          <View className="p-4">
            <LottieView
              source={require("../../assets/animations/expense.json")}
              autoPlay
              loop
              style={{ height: 150, width: 150 }}
            />
          </View>
          <Text className="text-3xl font-bold text-slate-800 mb-2">
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </Text>
          <Text className="text-slate-600 text-center">
            {isEditMode
              ? "Update your expense details"
              : "Track and split your trip expenses"}
          </Text>
        </View>

        {/* Paid By Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-4">
            Who Paid?
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-[#E3F5EA]">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedTrip.friends.map((friend) => (
                <TouchableOpacity
                  key={friend.id}
                  onPress={() => setPaidById(friend.id)}
                  className={`mx-2 px-6 py-4 rounded-2xl border-2 ${
                    paidById === friend.id
                      ? "bg-[#38E07B] border-[#38E07B]"
                      : "bg-white border-[#E3F5EA]"
                  }`}
                >
                  <Text
                    className={`text-lg font-semibold ${
                      paidById === friend.id ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {friend.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Amount and Currency */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-4">
            Amount
          </Text>
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 bg-white rounded-2xl p-1 shadow-sm border border-[#E3F5EA]">
              <TextInput
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
                value={amount}
                onChangeText={setAmount}
                className="p-5 text-2xl font-bold text-slate-800"
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-3">
            Description
          </Text>
          <View className="bg-white rounded-2xl p-1 shadow-sm border border-[#E3F5EA]">
            <TextInput
              placeholder="e.g., Dinner, Taxi, Hotel..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              className="p-5 text-lg font-medium text-slate-800"
            />
          </View>
        </View>

        {/* Split With Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-slate-700 mb-4">
            Split With
          </Text>
          {selectedTrip.friends.map((friend) => {
            const selected = selectedIds.includes(friend.id);
            return (
              <TouchableOpacity
                key={friend.id}
                onPress={() => toggleParticipant(friend.id)}
                className={`flex-row items-center justify-between p-5 rounded-2xl mb-3 border-2 ${
                  selected
                    ? "bg-[#CFF7DD] border-[#38E07B]"
                    : "bg-white border-[#E3F5EA]"
                }`}
              >
                <View className="flex-row items-center">
                  <View className="bg-[#E3F5EA] rounded-full p-3 mr-4">
                    <HugeiconsIcon icon={UserIcon} size={32} />
                  </View>
                  <Text className="font-bold text-lg text-slate-800">
                    {friend.name}
                  </Text>
                </View>
                <View
                  className={`w-7 h-7 rounded-xl border-2 items-center justify-center ${
                    selected
                      ? "bg-[#38E07B] border-[#38E07B]"
                      : "border-[#94A3B8]"
                  }`}
                >
                  {selected && (
                    <Text className="text-white font-bold text-lg">✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          disabled={!canSave}
          onPress={onAdd}
          className={`p-6 rounded-2xl shadow-lg ${
            canSave ? "bg-[#38E07B]" : "bg-gray-300"
          }`}
        >
          <Text
            className={`text-center text-xl font-bold ${
              canSave ? "text-white" : "text-gray-500"
            }`}
          >
            {isEditMode ? "Update Expense" : "Add Expense"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpense;
