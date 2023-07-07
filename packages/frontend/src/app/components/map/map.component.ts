import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild} from '@angular/core';
import {Place} from '../../models/rest/places/places.model';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import {MapService} from '../../services/map/map.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {combineLatest, filter, switchMap, tap} from 'rxjs';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RoutesService} from '../../services/routes/routes.service';

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

  private disableZoomAnim = false;

  constructor(
    private mapService: MapService,
    private placesService: PlacesService,
    private placeService: PlaceService,
    private destroyRef: DestroyRef,
    private routesService: RoutesService
  ) {
    this.disableZoomAnim = this.fromOtherPage();
  }

  ngAfterViewInit() {
    this.mapService
      .initMap(this.mapEl.nativeElement, this.tileLayer)
      .pipe(
        switchMap(() => combineLatest([this.initPlacesWatcher(), this.placeService.getSelectedPlace()])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([places, place]) => {
        if (places.length) {
          this.selectMarker(place);

          if (place) {
            this.mapService.flyTo(place.coordinates, this.disableZoomAnim);
          }

          if (this.disableZoomAnim) {
            this.disableZoomAnim = false;
          }
        }
      });
  }

  private initPlacesWatcher() {
    return this.placesService.getPlaces().pipe(
      filter(places => !!places.length),
      tap(places => {
        this.initMarkers(places);
        this.mapService.addMarkers(this.markersLayer);
      })
    );
  }

  private fromOtherPage() {
    const routes = this.routesService.routes$.value;
    if (!routes) return false;
    return routes.prevRoute !== '/' && routes.curRoute === '/';
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
