import {StrapiBaseMetaDataEntity} from '../strapi-base.model';

export interface PageModel extends StrapiBaseMetaDataEntity {
  content: string;
}
