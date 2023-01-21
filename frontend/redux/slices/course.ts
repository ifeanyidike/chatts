import { ICurrentCourse } from './../../interfaces/channeltypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MessagesState {
  selectedCourse?: ICurrentCourse;
}

const initialState: MessagesState = {
  selectedCourse: undefined,
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setSelectedCourse: (state, action: PayloadAction<ICurrentCourse>) => {
      state.selectedCourse = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedCourse } = courseSlice.actions;

export default courseSlice.reducer;
