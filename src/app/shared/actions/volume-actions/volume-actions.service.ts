import { Volume } from '../../models';
import { VolumeState, VolumeType } from '../../models/volume.model';

export const volumeAttachAction = {
  name: 'VOLUME_ACTIONS.ATTACH',
  command: 'attach',
  icon: 'mdi-paperclip',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => !!volume.virtualmachineid,
};
export const volumeRemoveAction = {
  name: 'COMMON.DELETE',
  command: 'delete',
  icon: 'mdi-delete',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => volume.type === VolumeType.ROOT,
};
export const volumeResizeAction = {
  name: 'VOLUME_ACTIONS.RESIZE',
  command: 'resize',
  icon: 'mdi-tab-unselected',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => false,
};
export const volumeDetachAction = {
  name: 'VOLUME_ACTIONS.DETACH',
  command: 'detach',
  icon: 'mdi-minus',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => !volume.virtualmachineid || volume.type === VolumeType.ROOT,
};
export const volumeSnapshotAction = {
  name: 'VOLUME_ACTIONS.TAKE_SNAPSHOT',
  command: 'snapshot',
  icon: 'mdi-camera',
  canActivate: (volume: Volume) => volume.state === VolumeState.Ready,
  hidden: (volume: Volume) => false,
};
export const volumeRecurringSnapshotsAction = {
  name: 'VOLUME_ACTIONS.SNAPSHOT_SCHEDULE',
  command: 'schedule',
  icon: 'mdi-clock-outline',
  canActivate: (volume: Volume) => volume.state === VolumeState.Ready,
  hidden: (volume: Volume) => false,
};

export class VolumeActionsService {
  public actions = [
    volumeSnapshotAction,
    volumeRecurringSnapshotsAction,
    volumeAttachAction,
    volumeDetachAction,
    volumeResizeAction,
    volumeRemoveAction,
  ];
}
