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
  paidByFriendId: string;
  splitWithFriendIds: string[]; // participants array
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
  userName: string;
  setUserName: (name: string) => void;
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
  const [userName, _setUserName] = useState<string>("You");

  const setUserName = (name: string) => {
    const finalName = name && name.trim().length > 0 ? name.trim() : "You";
    _setUserName(finalName);
    // Also update any existing trip where organizer id is "you"
    setTrips((prev) =>
      prev.map((trip) => ({
        ...trip,
        friends: trip.friends.map((friend) =>
          friend.id === "you" ? { ...friend, name: finalName } : friend
        ),
      }))
    );
  };

  const addTrip: TripsContextValue["addTrip"] = (tripInput) => {
    const newTrip: Trip = {
      id: generateId(),
      name: tripInput.name.trim(),
      friends: tripInput.friends.map((friend) => ({
        id: friend.id || generateId(),
        name: friend.name,
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
      prev.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              expenses: [
                {
                  id: generateId(),
                  createdAt: Date.now(),
                  ...expenseInput,
                },
                ...trip.expenses,
              ],
            }
          : trip
      )
    );
  };

  const value = useMemo<TripsContextValue>(() => {
    const selectedTrip =
      trips.find((trip) => trip.id === selectedTripId) ?? null;
    return {
      trips,
      selectedTripId,
      selectedTrip,
      userName,
      setUserName,
      addTrip,
      selectTrip,
      addExpense,
    };
  }, [trips, selectedTripId, userName]);

  return (
    <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
  );
};
