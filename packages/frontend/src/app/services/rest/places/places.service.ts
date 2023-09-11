import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {stringify} from 'qs';
import {map, Observable, shareReplay, switchMap, tap, zip} from 'rxjs';
import {
  Place,
  PlaceInfo,
  PlaceInfoResponse,
  PlacePageInfo,
  PlacePageInfoResponse,
  PlaceResponse,
  PlaceWithoutPopulation,
} from '../../../models/rest/places/places.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';
import {CategoriesService} from '../categories/categories.service';
import {CitiesService} from '../cities/cities.service';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class PlacesService {
  private apiUrl = environment.API_URL;

  private placesApiUrlPrefix = `${this.apiUrl}places`;

  private places$: Observable<Place[]> | undefined;

  private populateQuery = {populate: {category: {fields: ['id']}, city: {fields: ['id']}}};

  private fieldsQuery = {fields: ['coordinates', 'name']};

  constructor(
    private http: HttpClient,
    private categoriesService: CategoriesService,
    private citiesService: CitiesService,
    private languagesService: LanguagesService
  ) {}

  getPlaces() {
    const query = stringify({...this.fieldsQuery, ...this.populateQuery}, {encodeValuesOnly: true});

    if (!this.places$) {
      this.places$ = this.http
        .get<StrapiResponseMulti<PlaceResponse>>(
          `${this.placesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`
        )
        .pipe(this.populateFields.bind(this), shareReplay(1));
    }

    return this.places$;
  }

  getPlace(coordinates: string): Observable<Place | null> {
    const query = stringify(
      {...this.fieldsQuery, ...this.populateQuery, filters: {coordinates: {$eq: coordinates}}},
      {encodeValuesOnly: true}
    );

    return this.http
      .get<StrapiResponseMulti<PlaceResponse>>(
        `${this.placesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`
      )
      .pipe(
        this.populateFields.bind(this),
        map(places => places[0])
      );
  }

  private populateFields(source$: Observable<StrapiResponseMulti<PlaceResponse>>): Observable<Place[]> {
    return source$.pipe(
      map(responses => responses.data.map(response => this.processPlace(response))),
      switchMap(places =>
        zip([this.populateCategories(places), this.populateCities(places)]).pipe(map(() => places as Place[]))
      )
    );
  }

  private processPlace(placeResponse: {attributes: PlaceResponse; id: number}): PlaceWithoutPopulation {
    const placeAttrs = placeResponse.attributes;
    const placeId = placeResponse.id;
    const placeCategoryId = placeAttrs.category?.data?.id;
    const placeCityId = placeAttrs.city?.data?.id;

    const [latitude, longitude] = placeResponse.attributes.coordinates.split(', ').map(coordinate => +coordinate);

    return {
      ...placeAttrs,
      id: placeId,
      category: placeCategoryId ? {id: placeCategoryId} : undefined,
      city: placeCityId ? {id: placeCityId} : undefined,
      coordinates: {latitude, longitude},
    };
  }

  private populateCategories(places: PlaceWithoutPopulation[]) {
    return this.categoriesService.getCategories().pipe(
      tap(categories => {
        (<Place[]>places).forEach(place => {
          place.category = categories.find(category => category.id === place.category?.id);
          return place;
        });
      })
    );
  }

  private populateCities(places: PlaceWithoutPopulation[]) {
    return this.citiesService.getCities().pipe(
      tap(cities => {
        (<Place[]>places).map(place => {
          place.city = cities.find(city => city.id === place.city?.id);
          return place;
        });
      })
    );
  }

  getPlaceInfo(placeId: number): Observable<PlaceInfo> {
    const query = stringify(
      {
        fields: ['shortDescription'],
        populate: {images: {fields: ['name', 'url', 'alternativeText']}},
        filters: {id: {$eq: placeId}},
      },
      {encodeValuesOnly: true}
    );

    return this.http
      .get<StrapiResponseMulti<PlaceInfoResponse>>(
        `${this.placesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`
      )
      .pipe(
        map(responses => responses.data.map(response => this.processPlaceInfo(response.attributes))),
        map(placesInfos => placesInfos[0])
      );
  }

  private processPlaceInfo(attributes: PlacePageInfoResponse | PlaceInfoResponse) {
    return {
      ...attributes,
      images: attributes.images?.data?.map(image => ({...image.attributes, id: image.id})),
    };
  }

  getPlacePageInfo(placeId: number): Observable<PlacePageInfo> {
    const query = stringify(
      {
        fields: ['shortDescription', 'longDescription', 'keywords'],
        populate: {images: {fields: ['url', 'alternativeText']}},
        filters: {id: {$eq: placeId}},
      },
      {encodeValuesOnly: true}
    );

    return this.http
      .get<StrapiResponseMulti<PlacePageInfoResponse>>(
        `${this.placesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`
      )
      .pipe(map(responses => this.processPlaceInfo(responses.data[0].attributes) as PlacePageInfo));
  }
}
