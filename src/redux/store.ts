import { Action } from '@reduxjs/toolkit';
import settingsReducer from '../redux/reducers/settings';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { ThunkDispatch, thunk } from 'redux-thunk';

const rootReducer = combineReducers({ settings: settingsReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, PayloadAction>;

interface PayloadAction<T = any> extends Action {
  payload: T;
}
