// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 15000,
  specs: ['./**/*.e2e-spec.ts'],
  /*
  multiCapabilities: [{
    'browserName': 'firefox',
    firefoxOptions: {
      args: ['--headless']
    },
    'moz:firefoxOptions': {
      args: [ '--headless' ]
    }
  }, {
    'browserName': 'chrome'
  }],
  */
  capabilities: {
    browserName: 'chrome',
  },

  suites: {
    login: './e2e/login.e2e-spec.ts',
  },
  directConnect: true,
  baseUrl: 'http://localhost:8081',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json',
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
};
