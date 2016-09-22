require('style!bootstrap/dist/css/bootstrap.css');
require('bootstrap/dist/fonts/glyphicons-halflings-regular.ttf');
require('bootstrap/fonts/glyphicons-halflings-regular.woff');
require('bootstrap/fonts/glyphicons-halflings-regular.woff2');
import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
