import { createSlice } from "@reduxjs/toolkit";

// src/redux/reducer.js
const initialState = {
  reservedItems: [],
  error: null,
};

const reserveReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESERVE_ITEM_SUCCESS':
      return {
        ...state,
        reservedItems: state.reservedItems.map((item) =>
          item._id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item
        ),
      };
    case 'RESERVE_ITEM_FAILURE':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reserveReducer;
