import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PlacesService } from './services/rest/places/places.service';

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
  
  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {
    this.placesService.loadPlaces().subscribe();
  }
}
