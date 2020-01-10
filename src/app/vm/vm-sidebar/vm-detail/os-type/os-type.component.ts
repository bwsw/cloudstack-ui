import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { State } from '../../../../reducers';
import { ChangeOsType } from '../../../../reducers/vm/redux/vm.actions';
import { OsType } from '../../../../shared/models';
import { OsTypeService } from '../../../../shared/services/os-type.service';
import { VirtualMachine, VmState } from '../../../shared/vm.model';
import {
  OsTypeDialogComponent,
  OsTypeSelectorDialogData,
} from './os-type-selector/os-type-dialog.component';

@Component({
  selector: 'cs-os-type',
  templateUrl: './os-type.component.html',
  styleUrls: ['./os-type.component.scss'],
})
export class OsTypeComponent {
  @Input()
  set vm(value: VirtualMachine) {
    this.vm$.next(value);
  }

  public get canEdit() {
    return this.vm$.value.state !== VmState.InProgress;
  }

  public readonly osType$: Observable<OsType>;

  private vm$ = new BehaviorSubject<VirtualMachine>(null);

  constructor(
    private dialog: MatDialog,
    private osTypeService: OsTypeService,
    private store: Store<State>,
  ) {
    this.osType$ = this.vm$.pipe(
      filter(Boolean),
      switchMap((vm: VirtualMachine) => this.osTypeService.get(vm.guestosid)),
    );
  }

  public changeOsType(): void {
    const vm = this.vm$.value;
    this.dialog
      .open(OsTypeDialogComponent, {
        width: '400px',
        data: { vm } as OsTypeSelectorDialogData,
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(osTypeId => this.store.dispatch(new ChangeOsType({ osTypeId, vm })));
  }
}
