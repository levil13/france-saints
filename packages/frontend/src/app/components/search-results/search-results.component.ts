import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {Place} from '../../models/rest/places/places.model';
import {PlaceService} from '../../services/place/place.service';
import {MapService} from '../../services/map/map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent implements OnInit {
  places: Place[] = [];

  private _filteredPlaces: Place[] = [];

  get filteredPlaces(): Place[] {
    return this._filteredPlaces;
  }

  set filteredPlaces(value: Place[]) {
    this._filteredPlaces = value;
    this.cdr.markForCheck();
  }

  @Output()
  closeClick = new EventEmitter<void>();

  constructor(
    private searchService: SearchService,
    private categoriesService: CategoriesService,
    private placesService: PlacesService,
    private placeService: PlaceService,
    private mapService: MapService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.placesService.getPlaces().subscribe(places => (this.places = places));

    this.searchService.getSearchEntity().subscribe(searchEntity => {
      if (!searchEntity) {
        return;
      }

      switch (searchEntity.type) {
        case 'city': {
          this.filteredPlaces = this.places.filter(place => place.city.name === searchEntity.typeTerm);
          const filteredPlacesCoords: [number, number][] = this.filteredPlaces.map(place => [
            place.coordinates.latitude,
            place.coordinates.longitude,
          ]);
          this.mapService.flyToBounds(new L.LatLngBounds(filteredPlacesCoords));
          break;
        }
        case 'category': {
          this.filteredPlaces = this.places.filter(place => {
            const typeFilter = place.category.name === searchEntity.typeTerm;
            const nameFilter = place.name.toLowerCase().includes(searchEntity.term.toLowerCase());

            return typeFilter && nameFilter;
          });
          break;
        }
        case 'global': {
          this.filteredPlaces = this.places.filter(place =>
            place.name.toLowerCase().includes(searchEntity.term.toLowerCase())
          );
          break;
        }
        default:
          break;
      }
    });
  }

  selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }
}
