const initialState = {
  favorites: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'DELETE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((favorite) => favorite.id !== action.payload),
      };
    case 'CLEAR_FAVORITES':
      return { ...state, favorites: [] };
    default:
      return state;
  }
};

export default rootReducer;
