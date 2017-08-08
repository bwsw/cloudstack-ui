import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';
import { Tag } from './tag.model';
import { Taggable } from '../interfaces/taggable.interface';
import { SnapshotTagKeys } from '../services/tags/snapshot-tag.service';
import moment = require('moment');


@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel implements Taggable {
  public resourceType = 'Snapshot';

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
    this.initializeDescription();
  }

  private initializeDescription(): void {
    if (!this.tags) {
      return;
    }

    const description = this.tags.find(tag => tag.key === SnapshotTagKeys.description);
    if (description) {
      this.description = description.value;
    }
  }
}
