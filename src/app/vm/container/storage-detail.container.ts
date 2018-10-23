import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, onErrorResumeNext, switchMap, take, tap } from 'rxjs/operators';

import { State } from '../../reducers';
import { VirtualMachine } from '../shared/vm.model';
import { Volume } from '../../shared/models/volume.model';
import { IsoAttachmentComponent } from '../../template/iso-attachment/iso-attachment.component';
import { IsoEvent } from '../vm-sidebar/storage-detail/iso/iso.component';
import { MatDialog } from '@angular/material';
import { Iso } from '../../template/shared/iso.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';

import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';

@Component({
  selector: 'cs-storage-details-container',
  template: `
    <cs-volumes
      [volumes]="volumes$ | async"
    ></cs-volumes>
    <cs-volume-attachment-detail
      [volumes]="allVolumes$ | async"
      (attached)="onVolumeAttach($event)"
    ></cs-volume-attachment-detail>
    <cs-iso
      [iso]="iso$ | async"
      (isoAction)="handleIsoAction($event)"
    ></cs-iso>
  `,
})
export class StorageDetailContainerComponent implements OnInit, AfterViewInit {
  readonly vm$ = this.store.pipe(select(fromVMs.getSelectedVM));
  readonly allVolumes$ = this.store.pipe(select(fromVolumes.selectSpareOnlyVolumes));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectVmVolumes));
  readonly iso$ = this.store.pipe(select(fromTemplates.getVMTemplate));

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onVolumeAttach(volume: Volume): void {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      this.store.dispatch(
        new volumeActions.AttachVolumeToVM({
          volumeId: volume.id,
          virtualMachineId: vm.id,
        }),
      );
    });
  }

  public handleIsoAction(event: IsoEvent): void {
    if (event === IsoEvent.isoAttach) {
      return this.attachIsoDialog();
    }
    if (event === IsoEvent.isoDetach) {
      return this.detachIsoDialog();
    }
  }

  private attachIsoDialog(): void {
    this.vm$
      .pipe(
        take(1),
        switchMap((vm: VirtualMachine) => {
          return this.dialog
            .open(IsoAttachmentComponent, {
              width: '650px',
              data: { zoneId: vm.zoneid },
            })
            .afterClosed()
            .pipe(
              filter(iso => !!iso),
              tap((iso: Iso) => {
                this.store.dispatch(
                  new vmActions.AttachIso({
                    id: iso.id,
                    virtualMachineId: vm.id,
                  }),
                );
              }),
            );
        }),
      )
      .subscribe();
  }

  private detachIsoDialog(): void {
    this.dialogService
      .confirm({
        message: 'DIALOG_MESSAGES.ISO.CONFIRM_DETACHMENT',
      })
      .pipe(
        onErrorResumeNext(),
        filter(res => !!res),
        switchMap(() => this.vm$.pipe(take(1))),
      )
      .subscribe(vm => {
        this.store.dispatch(new vmActions.DetachIso({ virtualMachineId: vm.id }));
      });
  }
}
