import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTrips } from "../context/TripsContext";

type BalanceMap = Record<string, number>; // friendId -> net amount (positive = others owe them)

const Summary = () => {
  const { selectedTrip } = useTrips();

  const { netByFriend, pairwise } = useMemo(() => {
    const net: BalanceMap = {};
    const pair: Record<string, Record<string, number>> = {};
    if (!selectedTrip) return { netByFriend: net, pairwise: pair };

    selectedTrip.friends.forEach((f) => {
      net[f.id] = 0;
      pair[f.id] = {};
    });

    for (const e of selectedTrip.expenses) {
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

    return { netByFriend: net, pairwise: pair };
  }, [selectedTrip]);

  if (!selectedTrip) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-slate-600">Select a trip to view summary.</Text>
      </View>
    );
  }

  const nameOf = (id: string) =>
    selectedTrip.friends.find((f) => f.id === id)?.name ?? "";

  const entries = selectedTrip.friends.map((f) => {
    const lines: { text: string; amount: number }[] = [];
    const owes = pairwise[f.id] || {};
    // who they owe
    for (const to of Object.keys(owes)) {
      const amt = owes[to];
      if (amt > 0) lines.push({ text: `You owe ${nameOf(to)}`, amount: -amt });
    }
    // who owes them
    for (const from of Object.keys(pairwise)) {
      const amt = pairwise[from]?.[f.id] ?? 0;
      if (amt > 0)
        lines.push({ text: `${nameOf(from)} owes you`, amount: amt });
    }
    return { friend: f, lines };
  });

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20 }}
    >
      <Text className="text-2xl font-bold mb-4">Split Details</Text>
      {entries.map(({ friend, lines }) => {
        const net = netByFriend[friend.id] ?? 0;
        const netLabel = net === 0 ? "Settled" : net > 0 ? "Owed" : "You owe";
        const netValue = Math.abs(net).toFixed(2);
        return (
          <View
            key={friend.id}
            className="bg-white rounded-2xl mb-4 p-4 shadow-sm"
            style={{ shadowOpacity: 0.08, shadowRadius: 8 }}
          >
            <Text className="text-xl font-bold mb-1">{friend.name}</Text>
            <Text
              className={`mb-2 ${net >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              Net balance: {netLabel} ₹{netValue}
            </Text>
            {lines.length === 0 ? (
              <Text className="text-slate-500">No balances</Text>
            ) : (
              lines.map((l, idx) => (
                <View key={idx} className="flex-row justify-between mb-1">
                  <Text
                    className={`${l.amount >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {l.text}
                  </Text>
                  <Text
                    className={`${l.amount >= 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    ₹{Math.abs(l.amount).toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Summary;
