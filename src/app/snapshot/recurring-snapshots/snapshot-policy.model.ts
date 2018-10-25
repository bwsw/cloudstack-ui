import { BaseModel } from '../../shared/models';
import { PolicyType } from './snapshot-policy-type';

export interface SnapshotPolicy extends BaseModel {
  id: string;
  fordisplay: boolean;
  intervaltype: PolicyType;
  maxsnaps: number;
  schedule: string;
  timezone: string;
  volumeid: string;
}
