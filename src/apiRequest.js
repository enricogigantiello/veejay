import fetch from 'cross-fetch'

/**
 * Wrapper for private API requests that provider additional error hangling.
 */
const apiRequest = (_url, args) => {
  return fetch(_url, args)
    .then(res => {
      if (!res.ok) {
        return res.json().then(parsedError => {
          throw Error(parsedError); // defaulting to the generic 'status text' if no additional description is found
        });
      }
      return res.json();
    })
    // .catch(error => {
    //   if (error.errorCode && error.errorCode === TOKEN_EXPIRED_ERROR_CODE) {
    //     log.error(error.err);
    //     error.message = error.err;
    //     dispatch(loginActions.tokenExpired(error));
    //     dispatch(push('/welcome'));
    //   } else if (error.error && error.summary) {
    //     throw Error(
    //       error.summary.message || error.summary
    //     );
    //   } else if (error.error && !error.summary) {
    //     throw Error(
    //       error.error.message || error.error
    //     );
    //   } else {
    //     throw error; // don't forget to rethrow if it's any custom error
    //   }
    // });
};
export default apiRequest;
