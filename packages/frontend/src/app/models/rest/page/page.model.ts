import {StrapiBaseEntity} from '../strapi-base.model';

export interface PageModel extends StrapiBaseEntity {
  content: string;
}
