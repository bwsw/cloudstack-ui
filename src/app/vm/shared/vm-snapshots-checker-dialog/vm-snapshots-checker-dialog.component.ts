import { Component, Inject, OnDestroy, OnInit, Type } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { VmSnapshotService } from '../../../shared/services/vm-snapshot.service';
import { VirtualMachine } from '../vm.model';

export interface VmSnapshotsCheckerDialogData {
  vm: VirtualMachine;
  component: Type<any>;
  noticeMessageId: string;
}

@Component({
  selector: 'cs-vm-snapshots-checker-dialog',
  templateUrl: './vm-snapshots-checker-dialog.component.html',
  styleUrls: ['./vm-snapshots-checker-dialog.component.scss'],
})
export class VmSnapshotsCheckerDialogComponent implements OnInit, OnDestroy {
  public get ready() {
    return this.snapshotsCount != null;
  }

  public get canActivateAction() {
    return this.ready && this.snapshotsCount === 0;
  }

  public get componentType() {
    return this.data.component;
  }

  public get messageId() {
    return this.data.noticeMessageId;
  }

  private get vm() {
    return this.data.vm;
  }

  private requestSubscription = Subscription.EMPTY;
  private snapshotsCount: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: VmSnapshotsCheckerDialogData,
    private vmSnapshotService: VmSnapshotService,
  ) {}

  ngOnInit() {
    this.requestSubscription = this.vmSnapshotService
      .getList({ virtualmachineid: this.vm.id })
      .subscribe(snapshots => (this.snapshotsCount = snapshots.length));
  }

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
  }
}
