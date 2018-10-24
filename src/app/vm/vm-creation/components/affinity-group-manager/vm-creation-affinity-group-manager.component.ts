import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AffinityGroup } from '../../../../shared/models';
import { AffinityGroupSelectorContainerComponent } from '../../../vm-sidebar/affinity-group-selector/affinity-group-selector-container.component';

@Component({
  selector: 'cs-vm-creation-affinity-group-manager',
  templateUrl: 'vm-creation-affinity-group-manager.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationAffinityGroupManagerComponent),
      multi: true,
    },
  ],
  styleUrls: ['vm-creation-affinity-group-manager.component.scss'],
})
export class VmCreationAffinityGroupManagerComponent implements ControlValueAccessor {
  @Output()
  public affinityGroupChanged = new EventEmitter<string>();

  // tslint:disable-next-line:variable-name
  private _affinityGroup: AffinityGroup;

  constructor(private dialog: MatDialog) {}

  public propagateChange: any = () => {};

  @Input()
  public get affinityGroup(): AffinityGroup {
    return this._affinityGroup;
  }

  public set affinityGroup(value: AffinityGroup) {
    this._affinityGroup = value;
    this.propagateChange(value);
  }

  public writeValue(value: AffinityGroup): void {
    this._affinityGroup = value;
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public showDialog(): void {
    const preselectedAffinityGroups = this.affinityGroup ? [this.affinityGroup] : [];
    this.dialog
      .open(AffinityGroupSelectorContainerComponent, {
        width: '650px',
        data: {
          preselectedAffinityGroups,
          enablePreselected: true,
        },
        disableClose: true,
      } as MatDialogConfig)
      .afterClosed()
      .subscribe((res?: string) => {
        if (res) {
          this.affinityGroupChanged.emit(res[0]);
        }
      });
  }
}
