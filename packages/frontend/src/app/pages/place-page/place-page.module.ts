import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlacePageRoutingModule} from './place-page-routing.module';
import {PlacePageComponent} from './place-page.component';
import {MarkdownModule} from '../../pipes/markdown/markdown.module';
import {PlacesService} from '../../services/rest/places/places.service';

@NgModule({
  declarations: [PlacePageComponent],
  imports: [CommonModule, PlacePageRoutingModule, MarkdownModule],
  providers: [PlacesService],
})
export class PlacePageModule {}
