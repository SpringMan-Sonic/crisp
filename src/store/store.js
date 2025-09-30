import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import interviewReducer from './interviewSlice'
import { configureStore } from "@reduxjs/toolkit";


const persistConfig = {
  key:'crispAI',
  storage,
  version:1
}


const  persistedReducer = persistReducer(persistConfig,interviewReducer);

const store = configureStore({
  reducer:{
    interview:persistedReducer
  },
  middleware:(getDefaultMiddleware)=>{
   return getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  }

})


export default store;

export const persistor = persistStore(store);