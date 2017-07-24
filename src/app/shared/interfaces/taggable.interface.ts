import { Tag } from '../models';


export interface Taggable {
  id: string;
  resourceType: string;
  tags: Array<Tag>;
  [key: string]: any;
}
