import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Place } from '../../models/rest/places/places.model';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MapService } from '../../services/map/map.service';
import { PlacesService } from '../../services/rest/places/places.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @Output()
  markerClick = new EventEmitter<Place>();

  @ViewChild('map', { read: ElementRef, static: true })
  private mapEl!: ElementRef;

  private tileLayer!: L.TileLayer;

  private markersLayer!: L.MarkerClusterGroup;

  constructor(private mapService: MapService, private placesService: PlacesService) {}

  ngOnInit() {
    this.placesService
      .getPlaces()
      .pipe(filter(places => !!places.length))
      .subscribe(places => {
        this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });
        
        this.markersLayer = L.markerClusterGroup({ zoomToBoundsOnClick: false, showCoverageOnHover: false });
        this.processPlaces(places);

        this.markersLayer.on('clusterclick', cluster =>
          this.mapService.flyToBounds(cluster.propagatedFrom.getBounds())
        );

        this.mapService.initMap(
          this.mapEl.nativeElement,
          [this.tileLayer, this.markersLayer],
          this.markersLayer.getBounds().getCenter()
        );
      });
  }

  private processPlaces(places: Place[]) {
    this.markersLayer.clearLayers();

    places.forEach(item => {
      L.marker([item.coordinates.latitude, item.coordinates.longitude], { title: item.name })
        .on('click', () => this.markerClick.emit(item))
        .addTo(this.markersLayer);
    });
  }
}
