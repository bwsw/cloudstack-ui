import { InstanceGroup } from '../models/instance-group.model';
import { Taggable } from './taggable.interface';


export interface InstanceGroupEnabled extends Taggable {
  instanceGroup: InstanceGroup;
  initializeInstanceGroup(): void;
}
