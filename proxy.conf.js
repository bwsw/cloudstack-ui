const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "http://192.168.1.218:8080/",
    secure: false
  },
  {
    context: ["/cs-extensions/pulse/**"],
    target: "http://192.168.1.218:8082/",
    secure: false,
    pathRewrite: {'^/cs-extensions/pulse' : ''}
  }
];

module.exports = PROXY_CONFIG;
