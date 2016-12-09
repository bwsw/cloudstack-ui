import { BaseModel } from './base.model';

export interface ITag {
  key: string;
  value: string;
}

export class TemplateModel extends BaseModel {
  public name: string;
  public displaytext: string;
  public ostypeid: string;
  public ostypename: string;
  public tags: Array<ITag>;
}
