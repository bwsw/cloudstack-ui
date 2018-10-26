import { BaseModel } from './base.model';

export interface Configuration extends BaseModel {
  category: string;
  description: string;
  name: string;
  scope: string;
  value: boolean;
}
