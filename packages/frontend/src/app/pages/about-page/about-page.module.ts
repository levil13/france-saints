import {NgModule} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';

import {AboutPageRoutingModule} from './about-page-routing.module';
import {AboutPageComponent} from './about-page.component';
import {ContentWrapperModule} from '../../modules/content-wrapper/content-wrapper.module';
import {MarkdownModule} from '../../pipes/markdown/markdown.module';

@NgModule({
  declarations: [AboutPageComponent],
  imports: [NgIf, AsyncPipe, AboutPageRoutingModule, ContentWrapperModule, MarkdownModule],
})
export class AboutPageModule {}
