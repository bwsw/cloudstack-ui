import { Snapshot } from '../../../../shared/models';
import { Action } from '../../../../shared/models/action.model';

const CreateTemplateFromSnapshotAction = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_TEMPLATE',
  command: 'createTemplate',
  icon: 'library_add',
  canActivate: (snapshot: Snapshot) => true
};

const CreateVolumeFromSnapshotAction = {
  name: 'SNAPSHOT_PAGE.ACTIONS.CREATE_VOLUME',
  command: 'createVolume',
  icon: 'library_add',
  canActivate: (snapshot: Snapshot) => true
};

const SnapshotDeleteAction = {
  name: 'SNAPSHOT_PAGE.ACTIONS.DELETE_SNAPSHOT',
  command: 'delete',
  icon: 'delete',
  canActivate: (snapshot: Snapshot) => true
};

const SnapshotRevertAction = {
  name: 'SNAPSHOT_PAGE.ACTIONS.REVERT_TO_SNAPSHOT',
  command: 'revert',
  icon: 'settings_backup_restore',
  canActivate: (snapshot: Snapshot) => snapshot && !!snapshot.volumeid
};

export class SnapshotActionService {
  public actions: Array<Action<Snapshot>> = [
    CreateTemplateFromSnapshotAction,
    CreateVolumeFromSnapshotAction,
    SnapshotRevertAction,
    SnapshotDeleteAction
  ];
}
