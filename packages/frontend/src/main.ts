/// <reference types="@angular/localize" />

import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {MediaService} from './app/services/media/media.service';
import {APP_INITIALIZER} from '@angular/core';
import {RoutesService} from './app/services/routes/routes.service';
import {marked} from 'marked';
import {provideRouter, Route} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {environment} from './environments/environment';
import {PATHS} from './constants/constants';
import Token = marked.Token;

const mediaServiceInitializer = () => ({
  provide: APP_INITIALIZER,
  useFactory: (mediaService: MediaService) => () => mediaService.init(),
  deps: [MediaService],
  multi: true,
});

const routesServiceInitializer = () => ({
  provide: APP_INITIALIZER,
  useFactory: (routesService: RoutesService) => () => routesService.init(),
  deps: [RoutesService],
  multi: true,
});

const markdownPipeInitializer = () => ({
  provide: APP_INITIALIZER,
  useFactory: () => () => {
    const walkTokens = (token: Token) => {
      if (token.type === 'image' && environment.type === 'dev') {
        token.href = environment.CMS_URL + token.href;
      }
    };

    const renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };

    marked.use({walkTokens, renderer});
    marked.options({mangle: false, headerIds: false});
  },
  multi: true,
});

const routes: Route[] = [
  {
    path: PATHS[''].url,
    loadComponent: () => import('./app/pages/main-page/main-page.component').then(m => m.MainPageComponent),
  },
  {
    path: 'places/:place',
    loadComponent: () => import('./app/pages/place-page/place-page.component').then(m => m.PlacePageComponent),
  },
  {
    path: PATHS['ABOUT'].url,
    loadComponent: () => import('./app/pages/about-page/about-page.component').then(m => m.AboutPageComponent),
  },
  {
    path: PATHS['CONTACTS'].url,
    loadComponent: () => import('./app/pages/contacts-page/contacts-page.component').then(m => m.ContactsPageComponent),
  },
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    MediaService,
    mediaServiceInitializer(),
    RoutesService,
    routesServiceInitializer(),
    markdownPipeInitializer(),
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
