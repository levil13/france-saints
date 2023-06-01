import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { CategoriesService } from '../../services/rest/categories/categories.service';
import { PlacesService } from '../../services/rest/places/places.service';
import { Place } from '../../models/rest/places/places.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {

  places: Place[] = [];

  filteredPlaces: Place[] = [];

  constructor(private searchService: SearchService,
              private categoriesService: CategoriesService,
              private placesService: PlacesService) {}

  ngOnInit(): void {
    this.placesService.getPlaces().subscribe(places => this.places = places);

    this.searchService.getSearchEntity()
      .subscribe(searchEntity => {
        if (!searchEntity) return;

        if (searchEntity.type) {
          this.filteredPlaces = this.places.filter(place => {
            const typeFilter = place[searchEntity.type].name === searchEntity.typeTerm;

            return typeFilter && place.name.toLowerCase().includes(searchEntity.term.toLowerCase());
          });
        }
      });
  }

}
