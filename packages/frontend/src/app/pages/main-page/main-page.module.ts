import {NgModule} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {MainPageComponent} from './main-page.component';
import {MainPageRoutingModule} from './main-page-routing.module';
import {HeaderModule} from '../../modules/header/header.module';
import {MapModule} from '../../modules/map/map.module';
import {SearchService} from '../../services/search/search.service';
import {SearchResultsComponent} from '../../components/search-results/search-results.component';
import {PlaceInfoComponent} from '../../components/place-info/place-info.component';
import {CarouselModule} from '../../modules/carousel/carousel.module';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';

@NgModule({
  declarations: [MainPageComponent, SearchResultsComponent, PlaceInfoComponent],
  imports: [NgIf, NgFor, AsyncPipe, MainPageRoutingModule, HeaderModule, MapModule, CarouselModule],
  providers: [CategoriesService, PlacesService, SearchService],
})
export class MainPageModule {}
