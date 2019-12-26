const express = require('express');
const { STATUS_CODES } = require('http');
const { ReachableResponse, UnreachableResponse } = require('./response');
const { METHOD_NOT_ALLOWED } = require('./http-codes');
const { requestWithTimeout } = require('./request');

// If we encounter one of these responses, this means there is
// an http server that handled the request. We treat this as "Reachable"
const expectedErrorStatuses = [METHOD_NOT_ALLOWED];
function isExpectedError(err) {
  if (err == null || err.response == null) {
    return false;
  }

  return expectedErrorStatuses.some(status => err.response.status === status);
}

function createApp(requestTimeout) {
  const app = express();
  app.get('/', (req, res) => {
    const url = decodeURIComponent(req.query['url']);

    console.log(`Checking reachability of: ${url} ...`);
    requestWithTimeout(url, requestTimeout)
      .then(() => {
        console.log(`Reachable\n`);
        res.json(ReachableResponse(url));
      })
      .catch(err => {
        console.log(`Reachability request failed:`);
        if (isExpectedError(err)) {
          let status = err.response.status;
          console.log(
            `Error <${status} ${STATUS_CODES[status]}> is expected. Treating as Reachable`,
          );
          console.log();
          res.json(ReachableResponse(url));
        } else {
          console.log(err);
          console.log();
          res.json(UnreachableResponse(url));
        }
      });
  });
  return app;
}

module.exports = {
  createApp,
};
