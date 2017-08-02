const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "http://192.168.2.22:8888/",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
