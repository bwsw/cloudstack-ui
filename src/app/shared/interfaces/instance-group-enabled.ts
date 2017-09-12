import { InstanceGroup } from '../models/instance-group.model';
import { Taggable } from './taggable.interface';
import { LocalizedInstanceGroup } from '../services/tags/template/base/template-instance-group';


export interface InstanceGroupEnabled extends Taggable {
  instanceGroup: InstanceGroup & LocalizedInstanceGroup;
}
