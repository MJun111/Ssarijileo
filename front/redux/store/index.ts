import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';

import themeSlice from './themeSlice';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  theme: themeSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['theme'],
  // blacklist -> 그것만 제외
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
