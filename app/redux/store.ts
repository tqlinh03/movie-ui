import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlide";

import movieSlide from "./slice/movieSlide";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    movie: movieSlide,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
