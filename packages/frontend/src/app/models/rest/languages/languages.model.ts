import {StrapiBaseEntity} from '../strapi-base.model';

export interface Language extends StrapiBaseEntity {
  code: string;
  isDefault: boolean;
  name: string;
}
