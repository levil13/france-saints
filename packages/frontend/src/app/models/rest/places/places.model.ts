import { Category } from '../categories/categories.model';
import { City } from '../cities/cities.model';
import { StrapiBaseEntityLocalized } from '../strapi-base.model';
import { Coordinates } from '../strapi-components.model';
import { StrapiResponseSingle } from '../strapi-response.model';

export interface Place extends StrapiBaseEntityLocalized {
  name: string;
  coordinates: Coordinates;
  description?: string;
  category: Category;
  city: City;
}

export interface PlaceResponse extends Omit<Place, 'category' | 'city'> {
  category: StrapiResponseSingle<Category>;
  city: StrapiResponseSingle<City>;
}
