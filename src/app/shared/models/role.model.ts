import { BaseModelInterface } from './base.model';


export interface Role extends BaseModelInterface {
  description: string;
  id: string;
  name: string;
  type: string;
}
