import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IChatMessage } from '../../interfaces/channeltypes';

export interface MessagesState {
  messages: IChatMessage[];
}

const initialState: MessagesState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<IChatMessage>) => {
      state.messages = [...state.messages, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMessages, addMessage } = messageSlice.actions;

export default messageSlice.reducer;
