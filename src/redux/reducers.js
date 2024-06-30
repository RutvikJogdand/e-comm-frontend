import { combineReducers } from "@reduxjs/toolkit";

const initialState = {
    productsArr: [],
    loading: false,
    error: null,
};
  
const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, productsArr: action.payload, loading: false };
    default:
      return state;
  }
};
  
export default combineReducers({
  productsState: productsReducer,
});
  