// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 15000,
  specs: ['./e2e/**/*.e2e-spec.ts'],
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
    /*'chromeOptions': {
      args: ['--headless', '--disable-gpu', '--window-size=800,600', '--no-sandbox']
    }*/
  },
  params: {
    so: 'Small Instance',
    template: 'CentOS 5.6 (64-bit)',
    zone: 'Sandbox-simulator',
    rule: 'default',
  },
  directConnect: true,
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
  suites: {
    login: './e2e/login.e2e-spec.ts',
    vm_creation: './e2e/vm-creation.e2e-spec.ts',
    disk_creation: './e2e/disk-creation.e2e-spec.ts',
  },
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
