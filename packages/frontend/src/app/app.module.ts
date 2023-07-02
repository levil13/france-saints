import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {HeaderComponent} from './components/header/header.component';
import {MapComponent} from './components/map/map.component';
import {SearchComponent} from './components/search/search.component';
import {FormsModule} from '@angular/forms';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {PlacePageComponent} from './pages/place-page/place-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {MarkdownPipe} from './pipes/markdown/markdown.pipe';
import {marked} from 'marked';
import Token = marked.Token;

const setupMarkdownParser = () => {
  const walkTokens = (token: Token) => {
    if (token.type === 'image') {
      token.href = 'http://localhost:1337' + token.href;
    }
  };

  marked.use({walkTokens});
  marked.options({mangle: false, headerIds: false});
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    SearchComponent,
    LanguageSelectorComponent,
    PlacePageComponent,
    MainPageComponent,
    MarkdownPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
    FormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => setupMarkdownParser,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
