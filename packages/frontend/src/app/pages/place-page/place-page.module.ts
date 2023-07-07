import {NgModule} from '@angular/core';

import {PlacePageRoutingModule} from './place-page-routing.module';
import {PlacePageComponent} from './place-page.component';
import {MarkdownModule} from '../../pipes/markdown/markdown.module';
import {PlacesService} from '../../services/rest/places/places.service';
import {ContentWrapperModule} from '../../modules/content-wrapper/content-wrapper.module';
import {NgIf} from '@angular/common';

@NgModule({
  declarations: [PlacePageComponent],
  imports: [NgIf, PlacePageRoutingModule, MarkdownModule, ContentWrapperModule],
  providers: [PlacesService],
})
export class PlacePageModule {}
