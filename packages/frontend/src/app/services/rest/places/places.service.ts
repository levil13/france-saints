import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {stringify} from 'qs';
import {map, Observable, shareReplay} from 'rxjs';
import {Coordinates, Place, PlaceResponse} from '../../../models/rest/places/places.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';
import {CityResponse} from '../../../models/rest/cities/cities.model';
import {Image} from '../../../models/rest/strapi-components.model';

@Injectable()
export class PlacesService {
  private apiUrl = 'http://localhost:1337/api';

  private places$: Observable<Place[]> | undefined;

  private populateQuery = {populate: ['images', 'category', 'category.icon', 'city']};

  private placesApiUrlPrefix = `${this.apiUrl}/places`;

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getPlaces() {
    const query = stringify(this.populateQuery, {encodeValuesOnly: true});

    if (!this.places$) {
      this.places$ = this.http.get<StrapiResponseMulti<PlaceResponse>>(this.buildPlacesApiUrl(query)).pipe(
        map(response => response.data.map(placeResponse => this.processPlace(placeResponse))),
        shareReplay(1)
      );
    }

    return this.places$;
  }

  findPlace(coordinates: string): Observable<Place | null> {
    const query = stringify(
      {...this.populateQuery, filters: {coordinates: {$eq: coordinates}}},
      {encodeValuesOnly: true}
    );

    return this.http.get<StrapiResponseMulti<PlaceResponse>>(this.buildPlacesApiUrl(query)).pipe(
      map(response => {
        if (!response.data.length) {
          return null;
        }
        return this.processPlace(response.data[0]);
      })
    );
  }

  private buildPlacesApiUrl(query: string) {
    return `${this.placesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`;
  }

  private processPlace(placeResponse: {attributes: PlaceResponse; id: number}): Place {
    const placeId = placeResponse.id;
    const placeAttrs = placeResponse.attributes;
    const placeCategory = placeAttrs.category.data.attributes;
    const placeCategoryIcon = placeAttrs.category.data.attributes.icon.data?.attributes;
    const placeCity = this.processCity(placeAttrs.city.data.attributes);
    const placeImages = placeAttrs.images && this.processImages(placeAttrs.images);
    const placeCoordinates = this.processPlaceCoordinates(placeResponse.attributes.coordinates);

    return {
      ...placeAttrs,
      id: placeId,
      category: {...placeCategory, icon: placeCategoryIcon},
      city: placeCity,
      images: placeImages,
      coordinates: placeCoordinates,
    };
  }

  private processPlaceCoordinates(coordinates: string): Coordinates {
    const coordinatesSplit = coordinates.split(', ');
    return {latitude: +coordinatesSplit[0], longitude: +coordinatesSplit[1]};
  }

  private processCity(cityResponse: CityResponse) {
    return {...cityResponse, postalCodes: cityResponse.postalCodes.split(', ')};
  }

  private processImages(imagesResponse: StrapiResponseMulti<Image>) {
    return imagesResponse.data.map(image => ({...image.attributes, id: image.id}));
  }
}
