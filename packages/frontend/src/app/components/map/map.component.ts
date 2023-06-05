import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Place} from '../../models/rest/places/places.model';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import {MapService} from '../../services/map/map.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {filter} from 'rxjs';
import {PlaceService} from '../../services/place/place.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  @ViewChild('map', {read: ElementRef, static: true})
  private mapEl!: ElementRef;

  private tileLayer!: L.TileLayer;

  private markersLayer!: L.MarkerClusterGroup;

  constructor(private mapService: MapService,
              private placesService: PlacesService,
              private placeService: PlaceService) {
  }

  ngOnInit() {
    this.placesService
      .getPlaces()
      .pipe(filter(places => !!places.length))
      .subscribe(places => {
        this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });

        this.markersLayer = L.markerClusterGroup({zoomToBoundsOnClick: false, showCoverageOnHover: false});
        this.processPlaces(places);

        this.markersLayer.on('clusterclick', cluster =>
          this.mapService.flyToBounds(cluster.propagatedFrom.getBounds()),
        );

        this.mapService.initMap(
          this.mapEl.nativeElement,
          [this.tileLayer, this.markersLayer],
          this.markersLayer.getBounds().getCenter(),
        );
      });
  }

  private processPlaces(places: Place[]) {
    this.markersLayer.clearLayers();

    //"_selected" class for activate select style
    const iconMarker = L.divIcon({
      className: 'icon-marker-map',
      html: "<div class='icon-marker-map__pin'><img class='icon-marker-map__pin-image' src='../../../assets/icons/icon-pilgrimages.svg' alt='icon-shrine'></div>",
      iconSize: [40, 40],
      iconAnchor: [20, 56],
    });

    places.forEach(item => {
      L.marker([item.coordinates.latitude, item.coordinates.longitude], {icon: iconMarker})
        .on('click', () => this.selectPlace(item))
        .addTo(this.markersLayer);
    });
  }

  private selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }
}
