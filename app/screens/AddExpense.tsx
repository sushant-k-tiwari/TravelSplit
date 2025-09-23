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

const currencies = ["INR"]; // simple list

const AddExpense = () => {
  const router = useRouter();
  const { selectedTrip, addExpense } = useTrips();

  const [paidById, setPaidById] = useState<string | null>(
    selectedTrip?.friends[0]?.id ?? null
  );
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedTrip ? selectedTrip.friends.map((f) => f.id) : []
  );

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
    if (!canSave || !paidById) return;
    addExpense(selectedTrip.id, {
      amount: parseFloat(amount),
      currency,
      description: description.trim(),
      paidByFriendId: paidById,
      splitWithFriendIds: selectedIds,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-center text-2xl font-bold mb-4">Add Expense</Text>

        <Text className="font-semibold mb-1">Paid By</Text>
        <View className="bg-[#E3F5EA] rounded-md px-3 py-4 mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedTrip.friends.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setPaidById(f.id)}
                className={`px-4 py-2 mr-2 rounded-md ${
                  paidById === f.id ? "bg-[#38E07B]" : "bg-[#CFF7DD]"
                }`}
              >
                <Text
                  className={paidById === f.id ? "text-white" : "text-black"}
                >
                  {f.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row gap-3">
          <TextInput
            keyboardType="decimal-pad"
            placeholder="₹ 0.00"
            value={amount}
            onChangeText={setAmount}
            className="flex-1 p-4 bg-[#E3F5EA] rounded-md mb-3"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
          >
            <View className="flex-row items-center">
              {currencies.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCurrency(c)}
                  className={`px-4 py-3 mr-2 rounded-md ${
                    currency === c ? "bg-[#38E07B]" : "bg-[#CFF7DD]"
                  }`}
                >
                  <Text
                    className={currency === c ? "text-white" : "text-black"}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <TextInput
          placeholder="e.g. Dinner, Taxi, etc."
          value={description}
          onChangeText={setDescription}
          className="p-4 bg-[#E3F5EA] rounded-md mb-4"
        />

        <Text className="text-xl font-bold mb-2">Split With</Text>
        {selectedTrip.friends.map((f) => {
          const selected = selectedIds.includes(f.id);
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => toggleParticipant(f.id)}
              className={`flex-row justify-between items-center p-4 rounded-md mb-4 ${
                selected ? "bg-[#CFF7DD]" : "bg-[#E3F5EA]"
              }`}
            >
              <Text className="font-semibold text-lg">{f.name}</Text>
              <View
                className={`w-6 h-6 rounded-md border-2 ${
                  selected
                    ? "bg-[#38E07B] border-[#38E07B]"
                    : "border-[#82E8AB]"
                }`}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          disabled={!canSave}
          onPress={onAdd}
          className="bg-[#38E07B] p-4 rounded-md mt-4"
        >
          <Text className="text-center text-white font-semibold">
            Add Expense
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpense;
