import { InstanceGroup } from '../../models/instance-group.model';


export type NoGroup = '-1';
export const noGroup: NoGroup = '-1';
export type InstanceGroupOrNoGroup = InstanceGroup | NoGroup;

