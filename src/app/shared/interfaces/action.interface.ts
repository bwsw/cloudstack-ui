import { BaseModel } from '../models/base.model';


export interface Action<T extends BaseModel> {
  name: string;
  icon: string;
  hidden?(model: T): boolean;
  canActivate?(model: T): boolean;
  activate(model: T, ...rest: Array<any>): void;
}
