import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CategoriesService } from './services/rest/categories/categories.service';
import { PlacesService } from './services/rest/places/places.service';
import { SearchService } from './services/search/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ marginLeft: '-350px' }), animate('500ms ease-in-out', style({ marginLeft: '0' }))]),
      transition(':leave', [animate('500ms ease-in-out', style({ marginLeft: '-350px' }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  sidebarVisible = false;

  constructor(
    private placesService: PlacesService,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    forkJoin([this.placesService.loadPlaces(), this.categoriesService.loadCategories()]).subscribe();

    this.searchService.getSearchEntity().subscribe(searchEntity => this.sidebarVisible = !!searchEntity);
  }
}
