import { Snapshot } from '../../../../shared/models';
import { Action } from '../../../../shared/models/action.model';

const CreateTemplateFromSnapshotAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_TEMPLATE',
  command: 'createTemplate',
  icon: 'add',
  canActivate: (snapshot: Snapshot) => true
};

const CreateVolumeFromSnapshotAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_VOLUME',
  command: 'createVolume',
  icon: 'add',
  canActivate: (snapshot: Snapshot) => true
};

const SnapshotDeleteAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.DELETE_SNAPSHOT',
  command: 'delete',
  icon: 'delete',
  canActivate: (snapshot: Snapshot) => true
};

const SnapshotRevertAction: Action<Snapshot> = {
  name: 'SNAPSHOT_PAGE.ACTIONS.REVERT_TO_SNAPSHOT',
  command: 'revert',
  icon: 'settings_backup_restore',
  canActivate: (snapshot: Snapshot) => snapshot.revertable
};

export class SnapshotActionService {
  public actions: Array<Action<Snapshot>> = [
    CreateTemplateFromSnapshotAction,
    CreateVolumeFromSnapshotAction,
    SnapshotRevertAction,
    SnapshotDeleteAction
  ];
}
