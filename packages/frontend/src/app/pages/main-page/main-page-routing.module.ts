import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPageComponent} from './main-page.component';

const routes: Route[] = [{path: '', component: MainPageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
