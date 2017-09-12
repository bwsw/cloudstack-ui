import { Snapshot } from '../../../models/snapshot.model';
import { InstanceGroup } from '../../../models/instance-group.model';


export interface IsoCreationData {
  name: string,
  displayText: string,
  osTypeId: string,
  url: string,
  zoneId: string,
  snapshot: Snapshot,
  group: InstanceGroup,
}
