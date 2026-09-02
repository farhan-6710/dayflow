import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import remindersReducer from "./slices/remindersSlice";
import { rootSaga } from "./sagas";

// Persist configuration
const persistConfig = {
  key: "reminder-storage",
  storage: AsyncStorage,
  whitelist: ["reminders", "globalPaused", "lastAnimatedReminderId"],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, remindersReducer);

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    reminders: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(sagaMiddleware),
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
