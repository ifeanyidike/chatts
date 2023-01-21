import { configureStore } from '@reduxjs/toolkit';
import generalSlice from './slices/general';
import messageSlice from './slices/message';
import courseSlice from './slices/course';
import userSlice from './slices/user';

export const store = configureStore({
  reducer: {
    general: generalSlice,
    message: messageSlice,
    course: courseSlice,
    user: userSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
