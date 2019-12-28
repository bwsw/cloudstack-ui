const requestTimeout = +process.env.HTTP_ACCESS_HELPER_TIMEOUT || 60000; // 1 min
const port = +process.env.HTTP_ACCESS_HELPER_PORT || 8989;

module.exports = {
  requestTimeout,
  port,
};
