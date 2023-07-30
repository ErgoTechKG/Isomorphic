const actions = {
  SET_LOADING: 'SET_LOADING',
};


export const setLoading = (loading) => ({
  type: 'SET_LOADING',
  payload: loading,
});

export default actions;
