import fetch from 'cross-fetch'

const SEARCH = 'SEARCH';
const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
const SEARCH_FAIL = 'SEARCH_FAIL';

const initialState = {
  searchResult: null,
  searchError: null,
  searching: false,
  searched: false,
  searchString: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        searching: true,
      }

    case SEARCH_SUCCESS:
      return {
        ...state,
        searching: false,
        searchResult: action.result,
      }

    case SEARCH_FAIL:
      return {
        ...state,
        searching: false,
        searchError: action.result,
      }

    default:
      return state
  }
}

export const search = (searchString) => {
  console.log(searchString);
  return dispatch => {
    dispatch({
      type: SEARCH
    })
    return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchString}&key=AIzaSyBcwA1k_IoLM2y1WCpQAQR4H9msJk6fKXY`)
    .then(response => response.json())
    .then(searchJson => {
      let results = searchJson.items.map(item => item.id);
      let videos = results.filter(res => res.kind === "youtube#video");
      let videoIDs = videos.map(video => video.videoId);
      return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIDs.join()}&key=AIzaSyBcwA1k_IoLM2y1WCpQAQR4H9msJk6fKXY&part=snippet,contentDetails,statistics`)
    })
    .then(response => response.json())
    .then(videosJson => {
        console.log(videosJson);
        dispatch({
          type: SEARCH_SUCCESS,
          result: videosJson,
        });
      });
  }
}
