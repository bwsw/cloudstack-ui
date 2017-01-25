import {
  Component,
  Input,
} from '@angular/core';

import { MdlDialogService } from 'angular2-mdl';
import { VirtualMachine } from '../vm.model';
import { SnapshotCreationComponent } from '../../snapshot/snapshot-creation.component';


@Component({
  selector: 'cs-storage-detail',
  templateUrl: 'storage-detail.component.html',
  styleUrls: ['storage-detail.component.scss']
})
export class StorageDetailComponent {
  @Input() public vm: VirtualMachine;
  private expandStorage: boolean;

  constructor(
    private dialogService: MdlDialogService
  ) {
    this.expandStorage = false;
  }

  public toggleStorage() {
    this.expandStorage = !this.expandStorage;
  }

  public takeSnapshot(volumeId: string): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      providers: [{ provide: 'volumeId', useValue: volumeId }],
      isModal: true,
      styles: { 'width': '400px' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
