import React, { createContext, useContext, useMemo, useState } from "react";
import { uid } from "uid";

export type Friend = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paidByFriendId: string; // who paid
  splitWithFriendIds: string[]; // participants
  createdAt: number;
};

export type Trip = {
  id: string;
  name: string;
  friends: Friend[]; // includes organizer "You" as first friend
  expenses: Expense[];
  createdAt: number;
};

type TripsContextValue = {
  trips: Trip[];
  selectedTripId: string | null;
  selectedTrip: Trip | null;
  addTrip: (trip: Omit<Trip, "id" | "createdAt" | "expenses">) => string;
  selectTrip: (tripId: string | null) => void;
  addExpense: (
    tripId: string,
    expense: Omit<Expense, "id" | "createdAt">
  ) => void;
};

const TripsContext = createContext<TripsContextValue | undefined>(undefined);

export const useTrips = (): TripsContextValue => {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within TripsProvider");
  return ctx;
};

const generateId = () => uid();

export const TripsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const addTrip: TripsContextValue["addTrip"] = (tripInput) => {
    const newTrip: Trip = {
      id: generateId(),
      name: tripInput.name.trim(),
      friends: tripInput.friends.map((f) => ({
        id: f.id || generateId(),
        name: f.name,
      })),
      expenses: [],
      createdAt: Date.now(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripId(newTrip.id);
    return newTrip.id;
  };

  const selectTrip = (tripId: string | null) => setSelectedTripId(tripId);

  const addExpense: TripsContextValue["addExpense"] = (
    tripId,
    expenseInput
  ) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              expenses: [
                {
                  id: generateId(),
                  createdAt: Date.now(),
                  ...expenseInput,
                },
                ...t.expenses,
              ],
            }
          : t
      )
    );
  };

  const value = useMemo<TripsContextValue>(() => {
    const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null;
    return {
      trips,
      selectedTripId,
      selectedTrip,
      addTrip,
      selectTrip,
      addExpense,
    };
  }, [trips, selectedTripId]);

  return (
    <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
  );
};
