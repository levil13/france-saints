import {StrapiBaseEntityLocalized} from '../strapi-base.model';

export interface City extends StrapiBaseEntityLocalized {
  name: string;
  postalCodes: string[];
}

export interface CityResponse extends Omit<City, 'postalCodes'> {
  postalCodes: string;
}
