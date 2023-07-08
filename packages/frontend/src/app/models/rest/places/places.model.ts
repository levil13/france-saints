import {Category, CategoryResponse} from '../categories/categories.model';
import {City, CityResponse} from '../cities/cities.model';
import {StrapiBaseEntityLocalized} from '../strapi-base.model';
import {Image} from '../strapi-components.model';
import {StrapiResponseMulti, StrapiResponseSingle} from '../strapi-response.model';

export interface Place extends StrapiBaseEntityLocalized {
  name: string;
  coordinates: Coordinates;
  shortDescription: string;
  longDescription: string;
  category: Category;
  city: City;
  images?: Image[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceResponse extends Omit<Place, 'category' | 'city' | 'images' | 'coordinates'> {
  category: StrapiResponseSingle<CategoryResponse>;
  city: StrapiResponseSingle<CityResponse>;
  images?: StrapiResponseMulti<Image>;
  coordinates: string;
}
