const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "http://localhost:9991/",
    secure: false
  },
  {
    context: ["/cs-extensions/pulse/**"],
    target: "http://192.168.1.218:8082/",
    secure: false,
    pathRewrite: {'^/cs-extensions/pulse': ''}
  },
  {
    context: ["/cs-extensions/webshell/**"],
    target: "http://192.168.1.218:8018/",
    secure: false,
    pathRewrite: {'^/cs-extensions/webshell': ''}
  }
];

module.exports = PROXY_CONFIG;
