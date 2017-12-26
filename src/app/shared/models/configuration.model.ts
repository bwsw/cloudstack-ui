import { BaseModelInterface } from './base.model';

export interface Configuration extends BaseModelInterface {
  category: string;
  description: string;
  name: string;
  scope: string;
  value: boolean;
}
