import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {Place} from '../../models/rest/places/places.model';
import {PlaceService} from '../../services/place/place.service';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, NgFor],
  standalone: true,
})
export class SearchResultsComponent {
  CMS_URL = environment.CMS_URL;

  selectedPlace$ = this.placeService.getSelectedPlace();
  filteredPlaces$ = this.searchService.getSearchResults();

  constructor(private searchService: SearchService, private placeService: PlaceService) {}

  selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }
}
