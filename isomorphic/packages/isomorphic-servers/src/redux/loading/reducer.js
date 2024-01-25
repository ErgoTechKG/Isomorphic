import actions from './actions';

const initState = { loading: false };

export default function loadingReducer(state = initState, action) {
  switch (action.type) {
    
    case actions.SET_LOADING:
      console.log('actions', actions)
      return {
        loading: action.payload,
      };
    default:
      return state;
  }
}
