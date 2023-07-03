import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild} from '@angular/core';
import {Place} from '../../models/rest/places/places.model';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import {MapService} from '../../services/map/map.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {filter, map, switchMap} from 'rxjs';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @ViewChild('map', {read: ElementRef, static: true})
  private mapEl!: ElementRef;

  private tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  private markersLayer = L.markerClusterGroup({zoomToBoundsOnClick: false, showCoverageOnHover: false});

  private markers: L.Marker[] = [];

  constructor(
    private mapService: MapService,
    private placesService: PlacesService,
    private placeService: PlaceService,
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit() {
    this.mapService
      .initMap(this.mapEl.nativeElement, this.tileLayer)
      .pipe(
        switchMap(() => this.initPlacesWatcher()),
        switchMap(() => this.initSelectedPlaceWatcher()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private initPlacesWatcher() {
    return this.placesService.getPlaces().pipe(
      filter(places => !!places.length),
      map(places => {
        this.initMarkers(places);

        this.markersLayer.on('clusterclick', cluster =>
          this.mapService.flyToBounds(cluster.propagatedFrom.getBounds())
        );

        this.mapService.addMarkers(this.markersLayer);
      })
    );
  }

  private initSelectedPlaceWatcher() {
    return this.placeService.getSelectedPlace().pipe(
      map(place => {
        if (!this.markersLayer) return;

        this.selectMarker(place);

        if (place) {
          this.mapService.flyTo(place.coordinates);
        }
      })
    );
  }

  private refreshMarkers() {
    this.markersLayer.clearLayers();
    this.markersLayer.addLayers(this.markers);
  }

  private initMarkers(places: Place[]) {
    this.markers = places.map(place => {
      return L.marker([place.coordinates.latitude, place.coordinates.longitude], {
        icon: this.createMarkerIcon(place),
        title: place.name,
      }).on('click', () => this.selectPlace(place));
    });
    this.refreshMarkers();
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
    this.refreshMarkers();
  }
}
