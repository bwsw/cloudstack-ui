const CLOUDSTACK_ENDPOINT = 'http://127.0.0.1:4220/';

const PROXY_CONFIG = [
  {
    context: ['/client/api', '/client/console'],
    target: CLOUDSTACK_ENDPOINT,
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
