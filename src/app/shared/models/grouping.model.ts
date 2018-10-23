import { BaseModel } from './base.model';

export interface Grouping {
  key: string;
  label: string;
  selector: (item: BaseModel) => any;
  name: (item: BaseModel) => string;
}
