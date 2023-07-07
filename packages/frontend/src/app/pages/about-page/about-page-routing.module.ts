import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {AboutPageComponent} from './about-page.component';

const routes: Route[] = [{path: '', component: AboutPageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}
