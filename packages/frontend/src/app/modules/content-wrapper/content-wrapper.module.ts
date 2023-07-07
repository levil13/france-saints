import {NgModule} from '@angular/core';
import {ContentWrapperComponent} from '../../components/content-wrapper/content-wrapper.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [ContentWrapperComponent],
  exports: [ContentWrapperComponent],
  imports: [RouterModule],
})
export class ContentWrapperModule {}
