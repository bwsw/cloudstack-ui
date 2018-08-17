import { BaseModelInterface } from '../../shared/models';
import { PolicyType } from './snapshot-policy-type';


export interface SnapshotPolicy extends BaseModelInterface {
  id: string;
  fordisplay: boolean;
  intervaltype: PolicyType;
  maxsnaps: number;
  schedule: string;
  timezone: string;
  volumeid: string;
}
