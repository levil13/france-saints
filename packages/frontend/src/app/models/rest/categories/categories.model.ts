import {StrapiBaseEntityLocalized} from '../strapi-base.model';
import {Icon} from '../strapi-components.model';
import {StrapiResponseSingle} from '../strapi-response.model';

export interface Category extends StrapiBaseEntityLocalized {
  name: string;
  icon?: Icon;
}

export interface CategoryResponse extends Omit<Category, 'icon'> {
  icon: StrapiResponseSingle<Icon>;
}
