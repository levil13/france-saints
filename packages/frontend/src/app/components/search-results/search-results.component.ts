import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {Place} from '../../models/rest/places/places.model';
import {PlaceService} from '../../services/place/place.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent {
  constructor(private searchService: SearchService, private placeService: PlaceService) {}

  filteredPlaces$ = this.searchService.getSearchResults();

  selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }
}
