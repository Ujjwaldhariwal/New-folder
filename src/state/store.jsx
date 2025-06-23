import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authSlice';

const encryptionKey = import.meta.env.VITE_Redux_ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error('Encryption key not found. Make sure to set REACT_APP_ENCRYPTION_KEY in your .env.local file.');
}

const encryptor = encryptTransform({
  secretKey: encryptionKey,
  onError: (error) => {
    console.error(error);
  },
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [encryptor]
};

const reducer = combineReducers({
  auth: authReducer,
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
