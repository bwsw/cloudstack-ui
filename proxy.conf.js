const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "https://cs1.netpoint-dc.com",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
