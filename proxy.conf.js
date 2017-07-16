const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "http://localhost:9991",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
