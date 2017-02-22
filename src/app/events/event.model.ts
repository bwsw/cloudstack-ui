import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';

@FieldMapper({
  domainid: 'domainId',
  parentid: 'parentId'
})
export class Event extends BaseModel {
  public id: string;
  public type: string;
  public level: string;
  public description: string;
  public account: string;
  public domainId: string;
  public domain: string;
  public created: string;
  public state: string;
  public parentId: string;
}
