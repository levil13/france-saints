import {Image} from '../rest/strapi-components.model';

export interface MetaData {
  title?: string;
  keywords?: string;
  description?: string;
  images?: Image[];
  customTags?: Map<string, string>;
}
