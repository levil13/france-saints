import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {PlacePageComponent} from './place-page.component';

const routes: Route[] = [{path: '', component: PlacePageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacePageRoutingModule {}
