import {Category, CategoryResponse} from '../categories/categories.model';
import {City, CityResponse} from '../cities/cities.model';
import {StrapiBaseEntityLocalized} from '../strapi-base.model';
import {Image} from '../strapi-components.model';
import {StrapiResponseMulti, StrapiResponseSingle} from '../strapi-response.model';

export interface Place extends StrapiBaseEntityLocalized {
  name: string;
  coordinates: Coordinates;
  city?: City;
  category?: Category;
}

export interface PlaceWithoutPopulation extends Omit<Place, 'category' | 'city'> {
  category: {id: number};
  city: {id: number};
}

export interface PlaceInfo {
  images?: Image[];
  shortDescription?: string;
}

export interface PlaceDescription {
  longDescription: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceResponse extends Omit<Place, 'category' | 'city' | 'images' | 'coordinates'> {
  category: StrapiResponseSingle<CategoryResponse>;
  city: StrapiResponseSingle<Omit<CityResponse, 'postalCodes'>>;
  coordinates: string;
}

export interface PlaceInfoResponse extends Omit<PlaceInfo, 'images'> {
  images?: StrapiResponseMulti<Image>;
}
