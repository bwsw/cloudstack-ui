const PROXY_CONFIG = [
  {
    context: [
      "/client/api",
      "/client/console"
    ],
    target: "https://cs2-1.netpoint-dc.com/",
    secure: false
  },
  {
    context: ["/csextensions/pulse/**"],
    target: "http://192.168.1.218:8082/",
    secure: false,
    pathRewrite: {'^/csextensions/pulse': ''}
  },
  {
    context: ["/csextensions/webshell/**"],
    target: "http://192.168.1.218:8018/",
    secure: false,
    pathRewrite: {'^/csextensions/webshell': ''}
  }
];

module.exports = PROXY_CONFIG;
