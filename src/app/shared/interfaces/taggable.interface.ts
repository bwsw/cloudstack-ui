import { Tag } from '../models';

export interface Taggable {
  id: string;
  tags: Tag[];
  [key: string]: any;
}
