import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { Observable } from 'rxjs/Observable';
import { InstanceGroup } from '../../../models/instance-group.model';
import { EntityTagService } from './entity-tag-service.interface';


export interface InstanceGroupTagServiceInterface extends EntityTagService {
  getGroup(entity: InstanceGroupEnabled): Observable<InstanceGroup>;
  setGroup(entity: InstanceGroupEnabled, group: InstanceGroup): Observable<InstanceGroupEnabled>;
}
