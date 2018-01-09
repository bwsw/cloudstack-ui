import { Volume } from '../../models';
import { VolumeState, VolumeType } from '../../models/volume.model';


export const VolumeAttachAction = {
  name: 'VOLUME_ACTIONS.ATTACH',
  command: 'attach',
  icon: 'attach_file',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => !!volume.virtualMachineId
};
export const VolumeRemoveAction = {
  name: 'COMMON.DELETE',
  command: 'delete',
  icon: 'delete',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => volume.type === VolumeType.ROOT
};
export const VolumeResizeAction = {
  name: 'VOLUME_ACTIONS.RESIZE',
  command: 'resize',
  icon: 'photo_size_select_small',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => false
};
export const VolumeDetachAction = {
  name: 'VOLUME_ACTIONS.DETACH',
  command: 'detach',
  icon: 'remove',
  canActivate: (volume: Volume) => true,
  hidden: (volume: Volume) => !volume.virtualMachineId || volume.type === VolumeType.ROOT
};
export const VolumeSnapshotAction = {
  name: 'VOLUME_ACTIONS.TAKE_SNAPSHOT',
  command: 'snapshot',
  icon: 'camera_alt',
  canActivate: (volume: Volume) => volume.state === VolumeState.Ready,
  hidden: (volume: Volume) => false
};
export const VolumeRecurringSnapshotsAction = {
  name: 'VOLUME_ACTIONS.SNAPSHOT_SCHEDULE',
  command: 'schedule',
  icon: 'schedule',
  canActivate: (volume: Volume) => volume.state === VolumeState.Ready,
  hidden: (volume: Volume) => false
};

export class VolumeActionsService {
  public actions = [
    VolumeSnapshotAction,
    VolumeRecurringSnapshotsAction,
    VolumeAttachAction,
    VolumeDetachAction,
    VolumeResizeAction,
    VolumeRemoveAction
  ];
}
