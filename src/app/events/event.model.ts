import { BaseModel } from '../shared/models';
import { FieldMapper } from '../shared/decorators';
import moment = require('moment');

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
  public created: Date;
  public state: string;
  public parentId: string;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
  }
}
