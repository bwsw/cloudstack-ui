function Response(url, reachable) {
  return {
    url,
    reachable,
  };
}

function ReachableResponse(url) {
  return Response(url, true);
}

function UnreachableResponse(url) {
  return Response(url, false);
}

module.exports = {
  ReachableResponse,
  UnreachableResponse,
};
