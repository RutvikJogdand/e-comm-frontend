export const setProducts = (productsArr) => (dispatch) => {
  dispatch({ type: 'SET_PRODUCTS', payload: productsArr });
};
