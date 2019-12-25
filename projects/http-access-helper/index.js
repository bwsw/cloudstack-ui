const express = require('express');
const { STATUS_CODES } = require('http');

const { ReachableResponse, UnreachableResponse } = require('./src/response');
const { METHOD_NOT_ALLOWED } = require('./src/http-codes');
const { requestWithTimeout } = require('./src/request');

const expectedErrorStatuses = [METHOD_NOT_ALLOWED];
function isExpectedError(err) {
  if (err == null || err.response == null) {
    return false;
  }

  return expectedErrorStatuses.some(status => err.response.status === status);
}

const requestTimeout = 6000; // 1 min
const port = 8989;

const app = express();
app.get('/', (req, res) => {
  const url = req.query['url'];

  console.log(`Checking reachability of: ${url} ...`);
  requestWithTimeout(url, requestTimeout)
    .then(() => {
      console.log(`Reachable\n`);
      res.json(ReachableResponse(url));
    })
    .catch(err => {
      console.log(`Reachability request failed`);
      if (isExpectedError(err)) {
        let status = err.response.status;
        console.log(`Error <${status} ${STATUS_CODES[status]}> is expected. Treating as Reachable`);
        console.log();
        res.json(ReachableResponse(url));
      } else {
        res.json(UnreachableResponse(url));
      }
    });
});

app.listen(port, () => console.log(`Http Access Helper app listening on port ${port}!\n`));
