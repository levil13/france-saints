import {StrapiBaseEntity} from './strapi-base.model';

export interface Coordinates extends StrapiBaseEntity {
  latitude: number;
  longitude: number;
}

export interface Image extends StrapiBaseEntity {
  name: string;
  url: string;
  alternativeText: string;
}
