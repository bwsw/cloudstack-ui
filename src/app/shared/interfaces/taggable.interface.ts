import { Tag } from '../models';


export interface Taggable {
  id: string;
  tags: Array<Tag>;
  [key: string]: any;
}
