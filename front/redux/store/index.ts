import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import themeSlice from './themeSlice';
import loginSlice from './loginSlice';
import likeSlice from './likeSlice';
import echoSlice from './echoSlice';
import beatSlice from './beatSlice';
import volumeSlice from './volumeSlice';
import storage from 'redux-persist/lib/storage';
import reservSlice from './reservSlice';
import userSlice from './userSlice';
import ssariSlice from './ssariSlice';
import sessionIdSlice from './sessionIdSlice';

const rootReducer = combineReducers({
  theme: themeSlice.reducer,
  login: loginSlice.reducer,
  like: likeSlice.reducer,
  echo: echoSlice.reducer,
  beat: beatSlice.reducer,
  volume: volumeSlice.reducer,
  reserv: reservSlice.reducer,
  user: userSlice.reducer,
  ssari: ssariSlice.reducer,
  sessionId: sessionIdSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'theme',
    'login',
    'like',
    'echo',
    'beat',
    'volume',
    'reserv',
    'user',
    'ssari',
    'sessionId',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
