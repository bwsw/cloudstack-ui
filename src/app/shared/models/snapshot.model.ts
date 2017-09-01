import * as moment from 'moment';
import { FieldMapper } from '../decorators';
import { Taggable } from '../interfaces/taggable.interface';
import { BaseModel } from './base.model';
import { Tag } from './tag.model';
import { SnapshotTagKeys } from '../services/tags/snapshot-tag-keys';


@FieldMapper({
  physicalsize: 'physicalSize',
  volumeid: 'volumeId'
})
export class Snapshot extends BaseModel implements Taggable {
  public resourceType = 'Snapshot';

  public id: string;
  public created: Date;
  public physicalSize: number;
  public volumeId: string;
  public name: string;
  public tags: Array<Tag>;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
  }

  public get description(): string {
    if (!this.tags) {
      return '';
    }

    const description = this.tags.find(tag => tag.key === SnapshotTagKeys.description);
    if (description) {
      return description.value;
    } else {
      return '';
    }
  }
}
