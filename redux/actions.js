export const setFavorites = (favorites) => ({
  type: 'SET_FAVORITES',
  payload: favorites,
});

export const deleteFavorite = (movieId) => ({
  type: 'DELETE_FAVORITE',
  payload: movieId,
});

export const clearFavorites = () => ({
  type: 'CLEAR_FAVORITES',
});
