import {StrapiBaseEntityLocalized} from '../strapi-base.model';
import {Image} from '../strapi-components.model';
import {StrapiResponseSingle} from '../strapi-response.model';

export interface Category extends StrapiBaseEntityLocalized {
  name: string;
  icon?: Image;
}

export interface CategoryResponse extends Omit<Category, 'icon'> {
  icon: StrapiResponseSingle<Image>;
}
