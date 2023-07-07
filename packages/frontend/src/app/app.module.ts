import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RoutesService} from './services/routes/routes.service';
import {marked} from 'marked';
import Token = marked.Token;

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, HttpClientModule, AppRoutingModule],
  bootstrap: [AppComponent],
  providers: [
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
      },
      multi: true,
    },
  ],
})
export class AppModule {}
