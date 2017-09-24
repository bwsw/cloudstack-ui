import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CONFIG } from './app/config/config';
import { hmrBootstrap } from './hmr';

if (environment.production) {
  enableProdMode();
}

const xhr = new XMLHttpRequest();
xhr.open('GET', 'config/config.json', true);
xhr.onload = function (e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      onDone(xhr.responseText);
    } else {
      onDone();
    }
  }
};

xhr.onerror = () => onDone();
xhr.send();

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

function onDone(data?: any): void {
  CONFIG.parse(data);
  if (environment.hmr) {
    if (module['hot']) {
      hmrBootstrap(module, bootstrap);
    } else {
      console.error('HMR is not enabled for webpack-dev-server!');
      console.log('Are you using the --hmr flag for ng serve?');
    }
  } else {
    bootstrap();
  }
}
