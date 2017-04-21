import moment = require('moment');

import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';

@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel {
  public id: string;
  public created: Date;
  public physicalSize: number;
  public volumeId: string;
  public name: string;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
  }
}
