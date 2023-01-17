import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MessageFlagState {
  type?: string;
  isNew?: boolean;
}
export interface GeneralState {
  tab: string;
  messageFlags: MessageFlagState[];
}

const initialState: GeneralState = {
  tab: 'direct',
  messageFlags: [],
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    toggleTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload;
    },
    setMessageFlag: (state, action: PayloadAction<MessageFlagState>) => {
      const { type } = action.payload;
      const stateIndex = state.messageFlags.findIndex(f => f.type === type);

      if (stateIndex > -1) {
        state.messageFlags[stateIndex] = action.payload;
      } else {
        state.messageFlags = [...state.messageFlags, action.payload];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleTab, setMessageFlag } = generalSlice.actions;

export default generalSlice.reducer;
