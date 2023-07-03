import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Route[] = [
  {path: '', loadChildren: () => import('./pages/main-page/main-page.module').then(m => m.MainPageModule)},
  {path: 'places/:place', loadChildren: () => import('./pages/place-page/place-page.module').then(m => m.PlacePageModule)},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
