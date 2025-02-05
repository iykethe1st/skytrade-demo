import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  userReducer,
  // UserReducer: persistReducer(persistConfig, userReducer),
  // Add other reducers here...
});

export default rootReducer;
