import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import themeSlice from './themeSlice';
import loginSlice from './loginSlice';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  theme: themeSlice.reducer,
  login: loginSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme', 'login'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
