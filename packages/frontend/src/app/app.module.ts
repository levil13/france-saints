import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RoutesService} from './services/routes/routes.service';
import {marked} from 'marked';
import Token = marked.Token;
import {MediaService} from './services/media/media.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, HttpClientModule, AppRoutingModule],
  bootstrap: [AppComponent],
  providers: [
    MediaService,
    {
      provide: APP_INITIALIZER,
      useFactory: (windowService: MediaService) => () => windowService.init(),
      deps: [MediaService],
      multi: true,
    },
    RoutesService,
    {
      provide: APP_INITIALIZER,
      useFactory: (routesService: RoutesService) => () => routesService.init(),
      deps: [RoutesService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        const walkTokens = (token: Token) => {
          if (token.type === 'image') {
            token.href = 'http://localhost:1337' + token.href;
          }
        };

        marked.use({walkTokens});
        marked.options({mangle: false, headerIds: false});
      },
      multi: true,
    },
  ],
})
export class AppModule {}
