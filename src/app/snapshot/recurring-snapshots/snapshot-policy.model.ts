import { FieldMapper } from '../../shared/decorators';
import { BaseModel } from '../../shared/models';
import { PolicyType } from './recurring-snapshots.component';


@FieldMapper({
  fordisplay: 'forDisplay',
  intervaltype: 'intervalType',
  maxsnaps: 'maxSnaps',
  timezone: 'timeZone',
  volumeid: 'volumeId'
})
export class SnapshotPolicy extends BaseModel {
  public id: string;
  public forDisplay: boolean;
  public intervalType: PolicyType;
  public maxSnaps: number;
  public schedule: string;
  public timeZone: string;
  public volumeId: string;

  constructor(json) {
    super(json);
  }
}
