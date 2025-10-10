import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { uid } from "uid";
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  settled: boolean;
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
  editTrip: (
    tripId: string,
    trip: Omit<Trip, "id" | "createdAt" | "expenses">
  ) => void;
  deleteTrip: (tripId: string) => void;
  selectTrip: (tripId: string | null) => void;
  addExpense: (
    tripId: string,
    expense: Omit<Expense, "id" | "createdAt" | "settled">
  ) => void;
  editExpense: (
    tripId: string,
    expenseId: string,
    expense: Omit<Expense, "id" | "createdAt" | "settled">
  ) => void;
  toggleExpenseSettled: (tripId: string, expenseId: string) => void;
  loadData: () => Promise<void>;
  clearAllData: () => Promise<void>;
};

const TripsContext = createContext<TripsContextValue | undefined>(undefined);

export const useTrips = (): TripsContextValue => {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within TripsProvider");
  return ctx;
};

const generateId = () => uid();

const STORAGE_KEYS = {
  TRIPS: "travelsplit_trips",
  USER_NAME: "travelsplit_user_name",
  SELECTED_TRIP: "travelsplit_selected_trip",
};

export const TripsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [userName, _setUserName] = useState<string>("You");

  const loadData = useCallback(async () => {
    try {
      const [tripsData, userNameData, selectedTripData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRIPS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.SELECTED_TRIP),
      ]);

      if (tripsData) {
        setTrips(JSON.parse(tripsData));
      }
      if (userNameData) {
        _setUserName(userNameData);
      }
      if (selectedTripData) {
        setSelectedTripId(selectedTripData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveTrips = useCallback(async (newTrips: Trip[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(newTrips));
    } catch (error) {
      console.error("Error saving trips:", error);
    }
  }, []);

  const saveUserName = useCallback(async (name: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    } catch (error) {
      console.error("Error saving user name:", error);
    }
  }, []);

  const saveSelectedTrip = useCallback(async (tripId: string | null) => {
    try {
      if (tripId) {
        await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_TRIP, tripId);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_TRIP);
      }
    } catch (error) {
      console.error("Error saving selected trip:", error);
    }
  }, []);

  const setUserName = useCallback(
    (name: string) => {
      const finalName = name && name.trim().length > 0 ? name.trim() : "You";
      _setUserName(finalName);
      saveUserName(finalName);
      // Also update any existing trip where organizer id is "you"
      setTrips((prev) => {
        const updatedTrips = prev.map((trip) => ({
          ...trip,
          friends: trip.friends.map((friend) =>
            friend.id === "you" ? { ...friend, name: finalName } : friend
          ),
        }));
        saveTrips(updatedTrips);
        return updatedTrips;
      });
    },
    [saveUserName, setTrips, _setUserName, saveTrips]
  );

  const addTrip: TripsContextValue["addTrip"] = useCallback(
    (tripInput) => {
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
      setTrips((prev) => {
        const updatedTrips = [newTrip, ...prev];
        saveTrips(updatedTrips);
        return updatedTrips;
      });
      setSelectedTripId(newTrip.id);
      saveSelectedTrip(newTrip.id);
      return newTrip.id;
    },
    [setTrips, saveTrips, setSelectedTripId, saveSelectedTrip]
  );

  const editTrip: TripsContextValue["editTrip"] = useCallback(
    (tripId, tripInput) => {
      setTrips((prev) => {
        const updatedTrips = prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                name: tripInput.name.trim(),
                friends: tripInput.friends.map((friend) => ({
                  id: friend.id || generateId(),
                  name: friend.name,
                })),
              }
            : trip
        );
        saveTrips(updatedTrips);
        return updatedTrips;
      });
    },
    [setTrips, saveTrips]
  );

  const selectTrip = useCallback((tripId: string | null) => {
    setSelectedTripId(tripId);
    saveSelectedTrip(tripId);
  }, [setSelectedTripId, saveSelectedTrip]);

  const addExpense: TripsContextValue["addExpense"] = useCallback(
    (
      tripId,
      expenseInput
    ) => {
      setTrips((prev) => {
        const updatedTrips = prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                expenses: [
                  {
                    id: generateId(),
                    createdAt: Date.now(),
                    settled: false,
                    ...expenseInput,
                  },
                  ...trip.expenses,
                ],
              }
            : trip
        );
        saveTrips(updatedTrips);
        return updatedTrips;
      });
    },
    [setTrips, saveTrips]
  );

  const editExpense: TripsContextValue["editExpense"] = useCallback(
    (
      tripId,
      expenseId,
      expenseInput
    ) => {
      setTrips((prev) => {
        const updatedTrips = prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                expenses: trip.expenses.map((expense) =>
                  expense.id === expenseId
                    ? {
                        ...expense,
                        ...expenseInput,
                      }
                    : expense
                ),
              }
            : trip
        );
        saveTrips(updatedTrips);
        return updatedTrips;
      });
    },
    [setTrips, saveTrips]
  );

  const deleteTrip: TripsContextValue["deleteTrip"] = useCallback(
    (tripId) => {
      setTrips((prev) => {
        const updatedTrips = prev.filter((trip) => trip.id !== tripId);
        saveTrips(updatedTrips);
        return updatedTrips;
      });
      if (selectedTripId === tripId) {
        setSelectedTripId(null);
        saveSelectedTrip(null);
      }
    },
    [selectedTripId, setTrips, saveTrips, setSelectedTripId, saveSelectedTrip]
  );

  const toggleExpenseSettled: TripsContextValue["toggleExpenseSettled"] = useCallback(
    (
      tripId,
      expenseId
    ) => {
      setTrips((prev) => {
        const updatedTrips = prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                expenses: trip.expenses.map((expense) =>
                  expense.id === expenseId
                    ? { ...expense, settled: !expense.settled }
                    : expense
                ),
              }
            : trip
        );
        saveTrips(updatedTrips);
        return updatedTrips;
      });
    },
    [setTrips, saveTrips]
  );

  const clearAllData: TripsContextValue["clearAllData"] = useCallback(async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRIPS,
        STORAGE_KEYS.USER_NAME,
        STORAGE_KEYS.SELECTED_TRIP,
      ]);

      // Reset all state
      setTrips([]);
      setSelectedTripId(null);
      _setUserName("You");
    } catch (error) {
      console.error("Error clearing all data:", error);
      throw error;
    }
  }, []);

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
      editTrip,
      deleteTrip,
      selectTrip,
      addExpense,
      editExpense,
      toggleExpenseSettled,
      loadData,
      clearAllData,
    };
  }, [
    trips,
    selectedTripId,
    userName,
    setUserName,
    addTrip,
    editTrip,
    deleteTrip,
    selectTrip,
    addExpense,
    editExpense,
    toggleExpenseSettled,
    loadData,
    clearAllData,
  ]);

  return (
    <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
  );
};

export default TripsProvider;
