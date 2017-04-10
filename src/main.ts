import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

const areIntlLocalesSupported = require('intl-locales-supported');


if (!global.Intl) {
  global.Intl = require('intl');
} else if (!areIntlLocalesSupported(['ru', 'en'])) {
  require('intl/locale-data/jsonp/en.js');
  require('intl/locale-data/jsonp/ru.js');
  const IntlPolyfill = require('intl');
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
}


// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}

// tslint:disable-next-line
export function main() {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
