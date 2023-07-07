import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {ContactsPageComponent} from './contacts-page.component';

const routes: Route[] = [{path: '', component: ContactsPageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsPageRoutingModule {}
