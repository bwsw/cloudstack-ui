import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import { VmSnapshotService } from '../../../shared/services/vm-snapshot.service';
import { VirtualMachine } from '../vm.model';

export interface VmRestoreDialogData {
  vm: VirtualMachine;
}

@Component({
  selector: 'cs-vm-restore-dialog',
  templateUrl: './vm-restore-dialog.component.html',
  styleUrls: ['./vm-restore-dialog.component.scss'],
})
export class VmRestoreDialogComponent implements OnInit, OnDestroy {
  public get ready() {
    return this.snapshotsCount != null;
  }

  public get canReinstall() {
    return this.ready && this.snapshotsCount === 0;
  }

  private readonly vm: VirtualMachine;

  private requestSubscription = Subscription.EMPTY;
  private snapshotsCount: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: VmRestoreDialogData,
    private vmSnapshotService: VmSnapshotService,
  ) {
    this.vm = data.vm;
  }

  ngOnInit() {
    this.requestSubscription = this.vmSnapshotService
      .getList({ virtualmachineid: this.vm.id })
      .subscribe(snapshots => (this.snapshotsCount = snapshots.length));
  }

  ngOnDestroy() {
    this.requestSubscription.unsubscribe();
  }
}
