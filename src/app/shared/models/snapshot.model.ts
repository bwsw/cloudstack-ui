import moment = require('moment');

import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';
import { Tag } from './tag.model';

export const DESCRIPTION_TAG = 'DESCRIPTION';

@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel {
  public id: string;
  public created: Date;
  public description: string;
  public physicalSize: number;
  public volumeId: string;
  public name: string;
  public tags: Array<Tag>;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();

    if (!this.tags || !this.tags.length) {
      return;
    }

    const description = this.tags.find(tag => tag.key === DESCRIPTION_TAG);
    if (description) {
      this.description = description.value;
    }
  }
}
