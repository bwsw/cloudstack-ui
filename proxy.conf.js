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
    context: ["/pulse/**"],
    target: "http://192.168.1.218:8082/",
    secure: false,
    pathRewrite: {'^/pulse' : ''}
  }
];

module.exports = PROXY_CONFIG;
