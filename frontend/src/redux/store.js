import { configureStore, combineReducers  } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js'
import themeReducer from './theme/themeSlice.js'
import cartReducer from './IT22607232/cartSlice.js'
import wishlistReducer from './IT22607232/wishList.js'
import ratingReducer from './IT22607232/ratingSlice.js'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
   user: userReducer,
   theme: themeReducer,
   cart: cartReducer,
   wishlist: wishlistReducer,
   rating: ratingReducer,
})

const persistConfig = {
   key: 'root',
   storage,
   version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
   })
})

export const persistor = persistStore(store)