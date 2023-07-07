import {NgModule} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';

import {ContactsPageRoutingModule} from './contacts-page-routing.module';
import {ContactsPageComponent} from './contacts-page.component';
import {ContentWrapperModule} from '../../modules/content-wrapper/content-wrapper.module';
import {MarkdownModule} from '../../pipes/markdown/markdown.module';

@NgModule({
  declarations: [ContactsPageComponent],
  imports: [NgIf, AsyncPipe, ContactsPageRoutingModule, ContentWrapperModule, MarkdownModule],
})
export class ContactsPageModule {}
