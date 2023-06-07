import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {HeaderComponent} from './components/header/header.component';
import {MapComponent} from './components/map/map.component';
import {PlaceInfoComponent} from './components/place-info/place-info.component';
import {SearchResultsComponent} from './components/search-results/search-results.component';
import {SearchComponent} from './components/search/search.component';
import {FormsModule} from '@angular/forms';
import {CarouselComponent} from './components/carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchResultsComponent,
    PlaceInfoComponent,
    MapComponent,
    SearchComponent,
    CarouselComponent,
  ],
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
