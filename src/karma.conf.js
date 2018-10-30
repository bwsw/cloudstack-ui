// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-mocha-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../reports/coverage'),
      'report-config': {
        cobertura: {
          file: 'cobertura/cobertura.xml',
        },
      },
      reports: ['html', 'lcovonly', 'cobertura'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['mocha', 'junit', 'kjhtml', 'coverage-istanbul'],
    port: 9876,
    junitReporter: {
      outputDir: require('path').join(__dirname, '../reports'),
      outputFile: 'junit.xml',
      suite: '',
      useBrowserName: false,
    },
    mochaReporter: {
      ignoreSkipped: true,
    },
    colors: true,
    browserNoActivityTimeout: 100000, // default 10,000ms
    browserDisconnectTolerance: 5, // default 0
    retryLimit: 5, // default 2
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--remote-debugging-port=9876'],
      },
    },
    singleRun: false,
  });
};
