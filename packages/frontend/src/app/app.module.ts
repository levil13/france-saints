import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
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

@NgModule({
  declarations: [AppComponent, HeaderComponent, MapComponent, SearchComponent, LanguageSelectorComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
