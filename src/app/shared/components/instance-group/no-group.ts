import { InstanceGroup } from '../../models/instance-group.model';


export type noGroup = '-1';
export const noGroup: noGroup = '-1';
export type InstanceGroupOrNoGroup = InstanceGroup | noGroup;

