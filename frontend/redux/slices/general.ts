import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface GeneralState {
  tab: string;
}

const initialState: GeneralState = {
  tab: 'direct',
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    toggleTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleTab } = generalSlice.actions;

export default generalSlice.reducer;
