// karma.conf.js
const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      clearContext: false // mantiene el reporter HTML de Jasmine
    },
    coverageReporter: {
      // <-- aquí le decimos que ponga todo en ./coverage
      dir: path.join(__dirname, 'coverage'),
      // sin subcarpetas extra (todas las salidas en coverage/)
      subdir: '.',
      reporters: [
        // genera coverage/html/index.html
        { type: 'html', subdir: 'html' },
        // imprime un resumen en consola
        { type: 'text-summary' },
        // y escribe coverage/lcov.info
        { type: 'lcovonly', file: 'lcov.info' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    singleRun: true,   // para CI
    restartOnFileChange: false
  });
};
