import { configureStore, combineReducers, createSlice } from "@reduxjs/toolkit";

// import { buildGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteUser: (state) => {
      state.currentUser = null;
    },
  },
});

const rootReduces = combineReducers({ user: userSlice.reducer });

const persistConfiq = {
  key: "root",
  version: 1,
  storage,
};
const persistedReducer = persistReducer(persistConfiq, rootReduces);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const { signin, deleteUser } = userSlice.actions;

export const persistor = persistStore(store);
