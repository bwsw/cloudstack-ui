import { Tag } from '../models';


export interface Taggable {
  tags: Array<Tag>;
  [key: string]: any;
}
