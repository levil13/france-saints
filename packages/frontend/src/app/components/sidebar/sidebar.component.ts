import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {Place} from '../../models/rest/places/places.model';
import {PlaceService} from '../../services/place/place.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.placesService.getPlaces().subscribe(places => (this.places = places));

    this.searchService.getSearchEntity().subscribe(searchEntity => {
      if (!searchEntity) {
        return;
      }

      if (searchEntity.type) {
        this.filteredPlaces = this.places.filter(place => {
          const typeFilter = place[searchEntity.type].name === searchEntity.typeTerm;
          const nameFilter = place.name.toLowerCase().includes(searchEntity.term.toLowerCase());

          return typeFilter && nameFilter;
        });
      }
    });
  }

  selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }
}
