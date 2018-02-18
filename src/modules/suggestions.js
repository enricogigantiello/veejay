import fetch from 'cross-fetch'

const SUGGESTIONS = 'SUGGESTIONS';
const SUGGESTIONS_SUCCESS = 'SUGGESTIONS_SUCCESS';
const SUGGESTIONS_FAIL = 'SUGGESTIONS_FAIL';

const initialState = {
  suggestionsResult: null,
  suggestionsError: null,
  suggestionsLoading: false,
  suggestionsLoaded: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SUGGESTIONS:
      return {
        ...state,
        suggestionsLoading: true,
      }

    case SUGGESTIONS_SUCCESS:
      var newSugRes = { ...state.suggestionsResult };
      newSugRes[action.videoId] = action.result
      return {
        ...state,
        suggestionsLoading: false,
        suggestionsResult: newSugRes,
      }

    case SUGGESTIONS_FAIL:
      return {
        ...state,
        suggestionsLoading: false,
        suggestionsError: action.result,
      }

    default:
      return state
  }
}

export const getSuggestions = (videoId) => {
  return dispatch => {
    dispatch({
      type: SUGGESTIONS
    })
    return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&maxResults=50&type=video&key=AIzaSyBcwA1k_IoLM2y1WCpQAQR4H9msJk6fKXY`)
      .then(response => response.json())
      .then(searchJson => {
        let results = searchJson.items.map(item => item.id);
        let videos = results.filter(res => res.kind === "youtube#video");
        let videoIDs = videos.map(video => video.videoId);
        return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIDs.join()}&key=AIzaSyBcwA1k_IoLM2y1WCpQAQR4H9msJk6fKXY&part=snippet,contentDetails,statistics`)
      })
      .then(response => response.json())
      .then(videosJson => {
        dispatch({
          type: SUGGESTIONS_SUCCESS,
          result: videosJson,
          videoId
        });
      });
  }
}
