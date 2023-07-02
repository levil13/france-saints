import {Route} from '@angular/router';
import {PlacePageComponent} from './pages/place-page/place-page.component';
import {MainPageComponent} from './pages/main-page/main-page.component';

export const appRoutes: Route[] = [
  {path: '', component: MainPageComponent},
  {path: 'places/:place', component: PlacePageComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'},
];
