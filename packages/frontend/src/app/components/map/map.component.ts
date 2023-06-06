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

  private markers: L.Marker[] = [];

  constructor(
    private mapService: MapService,
    private placesService: PlacesService,
    private placeService: PlaceService
  ) {}

  ngOnInit() {
    this.placesService
      .getPlaces()
      .pipe(filter(places => !!places.length))
      .subscribe(places => {
        this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        });

        this.markersLayer = L.markerClusterGroup({zoomToBoundsOnClick: false, showCoverageOnHover: false});
        this.markers = this.createMarkers(places);
        this.refreshMarkers();

        this.markersLayer.on('clusterclick', cluster =>
          this.mapService.flyToBounds(cluster.propagatedFrom.getBounds())
        );

        this.mapService.initMap(
          this.mapEl.nativeElement,
          [this.tileLayer, this.markersLayer],
          this.markersLayer.getBounds().getCenter()
        );
      });

    this.placeService.getSelectedPlace().subscribe(place => {
      if (!this.markersLayer) return;

      this.selectMarker(place);
      this.refreshMarkers();
    });
  }

  private refreshMarkers() {
    this.markersLayer.clearLayers();
    this.markersLayer.addLayers(this.markers);
  }

  private createMarkers(places: Place[]) {
    return places.map(place => {
      return L.marker([place.coordinates.latitude, place.coordinates.longitude], {
        icon: this.createMarkerIcon(place),
        title: place.name,
      }).on('click', () => this.selectPlace(place));
    });
  }

  private createMarkerIcon(place: Place) {
    //TODO move to env
    const srcUrl = `http://localhost:1337${place.category.icon?.url}`;
    return L.divIcon({
      className: 'icon-marker-map',
      html:
        '<div class="icon-marker-map__pin">' +
        `   <img class="icon-marker-map__pin-image" src=${srcUrl} alt=${place.category.icon?.alternativeText}>` +
        '</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 56],
    });
  }

  private selectPlace(place: Place) {
    this.placeService.setSelectedPlace(place);
  }

  private selectMarker(place: Place | null) {
    this.markers.forEach(marker => {
      const markerIcon = marker.options.icon;
      if (!markerIcon) return;

      if (marker.options.title === place?.name) {
        if (!markerIcon.options.className?.includes('_selected')) {
          markerIcon.options.className = markerIcon.options.className?.concat(' _selected');
        }
      } else {
        if (markerIcon.options.className?.includes('_selected')) {
          markerIcon.options.className = markerIcon.options.className?.replace(' _selected', '');
        }
      }
    });
  }
}
