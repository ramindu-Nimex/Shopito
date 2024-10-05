// src/redux/actions.js
export const reserveItem = (itemId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(`/api/reserve-item/${itemId}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error reserving the item');
      }

      dispatch({
        type: 'RESERVE_ITEM_SUCCESS',
        payload: { id: itemId, status: data.status },
      });
    } catch (error) {
      dispatch({
        type: 'RESERVE_ITEM_FAILURE',
        payload: error.message,
      });
    }
  };
};
