import {StrapiBaseEntity} from './strapi-base.model';

export interface Image extends StrapiBaseEntity {
  name: string;
  url: string;
  alternativeText: string;
}
