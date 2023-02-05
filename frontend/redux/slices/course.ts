import {
  IChatMessage,
  ICourseMessage,
  ICurrentCourse,
} from './../../interfaces/channeltypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface RemoveMessage {
  courseId: string;
  messageId: string;
}
export interface MessagesState {
  selectedCourse?: ICurrentCourse;
  courses: ICurrentCourse[];
}

const initialState: MessagesState = {
  selectedCourse: undefined,
  courses: [],
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<ICurrentCourse[]>) => {
      state.courses = action.payload;
    },
    addCourseMessage: (state, action: PayloadAction<ICourseMessage>) => {
      const courseIndex = state.courses?.findIndex(
        (c: ICurrentCourse) => c.id === action.payload.id
      );

      if (courseIndex > -1) {
        const course = state.courses[courseIndex];
        const messages = course?.messages || [];
        state.courses[courseIndex] = {
          ...course,
          messages: [...messages, action.payload.message],
        };
      }
    },

    removeCourseMessage: (state, action: PayloadAction<RemoveMessage>) => {
      const courseIndex = state.courses?.findIndex(
        (c: ICurrentCourse) => c.id === action.payload.courseId
      );

      if (courseIndex > -1) {
        state.courses[courseIndex].messages?.filter(
          (m: IChatMessage) => m.id !== action.payload.messageId
        );
      }
    },
    setSelectedCourse: (state, action: PayloadAction<ICurrentCourse>) => {
      state.selectedCourse = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedCourse,
  setCourses,
  addCourseMessage,
  removeCourseMessage,
} = courseSlice.actions;

export default courseSlice.reducer;
