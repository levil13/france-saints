import {Category, CategoryResponse} from '../categories/categories.model';
import {City} from '../cities/cities.model';
import {StrapiBaseEntityLocalized} from '../strapi-base.model';
import {Coordinates, Image} from '../strapi-components.model';
import {StrapiResponseMulti, StrapiResponseSingle} from '../strapi-response.model';

export interface Place extends StrapiBaseEntityLocalized {
  name: string;
  coordinates: Coordinates;
  description?: string;
  category: Category;
  city: City;
  images?: Image[];
}

export interface PlaceResponse extends Omit<Place, 'category' | 'city' | 'images'> {
  category: StrapiResponseSingle<CategoryResponse>;
  city: StrapiResponseSingle<City>;
  images?: StrapiResponseMulti<Image>;
}
