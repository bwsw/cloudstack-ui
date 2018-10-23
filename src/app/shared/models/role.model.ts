import { BaseModel } from './base.model';

export interface Role extends BaseModel {
  description: string;
  id: string;
  name: string;
  type: string;
}
