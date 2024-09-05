import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "66cc2f274aec4c32e965d452",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
