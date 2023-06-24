import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchResultsComponent} from '../../components/search-results/search-results.component';

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [CommonModule],
})
export class SearchResultsModule {
  static getComponent() {
    return SearchResultsComponent;
  }
}
