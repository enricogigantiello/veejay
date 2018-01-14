import {getSuggestions} from './suggestions';
const SET_LEFT = 'SET_LEFT';
const SET_RIGHT = 'SET_RIGHT';
const initialState = {
  leftId: null,
  rightId: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LEFT:
      return {
        ...state,
        leftId: action.videoId,
      }
    case SET_RIGHT:
      return {
        ...state,
        rightId: action.videoId,
      }

    default:
      return state
  }
}

export const setLeft = (videoId) => {
  return dispatch => {
    dispatch({type: SET_LEFT, videoId});
    dispatch(getSuggestions(videoId));
  }
}

export const setRight = (videoId) => {
  return dispatch => {
    dispatch({type: SET_RIGHT, videoId})
    dispatch(getSuggestions(videoId));
  }
}
