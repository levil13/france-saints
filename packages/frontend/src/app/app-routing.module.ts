import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Route[] = [
  {path: '', loadChildren: () => import('./pages/main-page/main-page.module').then(m => m.MainPageModule)},
  {path: 'places/:place', loadChildren: () => import('./pages/place-page/place-page.module').then(m => m.PlacePageModule)},
  {path: 'about', loadChildren: () => import('./pages/about-page/about-page.module').then(m => m.AboutPageModule)},
  {path: 'contacts', loadChildren: () => import('./pages/contacts-page/contacts-page.module').then(m => m.ContactsPageModule)},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
