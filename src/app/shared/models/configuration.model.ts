import { BaseModel } from './base.model';

export class Configuration extends BaseModel {
  public category: string;
  public description: string;
  public name: string;
  public scope: string;
  public value: boolean;

}
