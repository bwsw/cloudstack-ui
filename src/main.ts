import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { CONFIG } from './app/config/config';


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

function onDone(data?: any): void {
  CONFIG.parse(data);
  platformBrowserDynamic().bootstrapModule(AppModule);
}
