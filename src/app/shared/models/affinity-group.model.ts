import { BaseModel } from './';

export class AffinityGroup extends BaseModel {
  public id: number;
  public name: string;
  public description: string;
  public type: string;
}
