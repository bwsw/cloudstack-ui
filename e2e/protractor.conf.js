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
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=800,600', '--no-sandbox'],
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
  suites: {
    sg_creation: 'sg-creation.e2e-spec.ts',
    login: 'login.e2e-spec.ts',
    vm_creation: 'vm-creation.e2e-spec.ts',
    disk_creation: 'disk-creation.e2e-spec.ts',
    disk_details: 'disk-details.e2e-spec.ts',
    vm_sidebar: 'vm-sidebar.e2e-spec.ts',
    CI: [
      'login.e2e-spec.ts',
      'sg-creation.e2e-spec.ts',
      'disk-creation.e2e-spec.ts',
      'vm-creation.e2e-spec.ts',
      'disk-details.e2e-spec.ts',
    ],
  },
  params: {
    so: 'Instance',
    template: 'CentOS 5.6 (64-bit)',
    zone: 'Sandbox-simulator',
    rule: 'default',
  },
  //  * other config options *
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
