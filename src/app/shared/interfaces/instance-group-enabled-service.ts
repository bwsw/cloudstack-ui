import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { InstanceGroup } from '../models/instance-group.model';
import { InstanceGroupEnabled } from './instance-group-enabled';


export interface InstanceGroupEnabledService<M extends InstanceGroupEnabled = any> {
  instanceGroupUpdateObservable: Subject<InstanceGroupEnabled>;
  addInstanceGroup(entity: M, group: InstanceGroup): Observable<M>;
  getInstanceGroupList(): Observable<Array<InstanceGroup>>;
}
