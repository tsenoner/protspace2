// src/redux/store.ts
import { Action } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settings";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { ThunkDispatch, thunk } from "redux-thunk";

const rootReducer = combineReducers({ settings: settingsReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ThunkDispatch<RootState, unknown, PayloadAction>;

interface PayloadAction<T = any> extends Action {
  payload: T;
}
