const axios = require('axios');
const { delay } = require('./util');

function requestWithTimeout(url, timeout) {
  const cancelToken = axios.CancelToken.source();

  return Promise.race([
    delay(timeout).then(() => {
      cancelToken.cancel('Request timeout');
      return Promise.reject(new Error('Request Timeout'));
    }),
    axios.head(url, { cancelToken: cancelToken.token }),
  ]);
}

module.exports = {
  requestWithTimeout,
};
