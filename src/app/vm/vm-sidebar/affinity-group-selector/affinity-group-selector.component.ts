import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers';

function isUniqName(affinityGroups: AffinityGroup[]): ValidatorFn {
  return function (control: FormControl) {
    const nameIsTaken = affinityGroups.find(group => group.name === control.value);
    return nameIsTaken ? { nameIsTaken: true } : undefined;
  };
}

@Component({
  selector: 'cs-affinity-group-selector',
  templateUrl: 'affinity-group-selector.component.html',
  styleUrls: ['affinity-group-selector.component.scss']
})
export class AffinityGroupSelectorComponent implements OnInit, OnChanges {
  @Input() public affinityGroups: Array<AffinityGroup>;
  @Input() public preselectedAffinityGroups: AffinityGroup[];
  @Input() public isVmCreation: boolean;
  @Output() public onCreateAffinityGroup = new EventEmitter<AffinityGroup>();
  @Output() public onSubmit = new EventEmitter<string[]>();
  @Output() public onCancel = new EventEmitter();
  public loading: boolean;
  public selectedGroup: AffinityGroup;
  public types = [AffinityGroupType.antiAffinity, AffinityGroupType.affinity];
  public affinityGroupForm: FormGroup;
  public maxEntityNameLength = 63;

  constructor(
    private store: Store<State>,
    private affinityGroupService: AffinityGroupService,
    private dialogRef: MatDialogRef<AffinityGroupSelectorComponent>,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    const affinityGroup = changes.affinityGroups.currentValue;
    if (affinityGroup) {
      this.affinityGroups = affinityGroup;
      this.createForm();
    }
  }

  public ngOnInit(): void {
    this.createForm();
  }

  public createGroup(): void {
    const newAffinityGroup = {
      name: this.affinityGroupForm.value.name,
      type: this.affinityGroupForm.value.type,
      description: this.affinityGroupForm.value.description
    } as AffinityGroup;
    this.affinityGroupForm.reset();
    this.onCreateAffinityGroup.emit(newAffinityGroup);
  }

  public changeGroup(group: AffinityGroup): void {
    this.selectedGroup = group;
  }

  public submit(): void {
    let selectedGroupIds;
    if (this.isVmCreation) {
      selectedGroupIds = [this.selectedGroup.id]
    } else  {
      selectedGroupIds = this.preselectedAffinityGroups.map(group => group.id);
      selectedGroupIds.push(this.selectedGroup.id);
    }
    this.onSubmit.emit(selectedGroupIds);
  }

  private createForm() {
    this.affinityGroupForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(this.maxEntityNameLength),
        isUniqName(this.affinityGroups)
      ]),
      type: this.formBuilder.control(AffinityGroupType.antiAffinity, [Validators.required]),
      description: this.formBuilder.control('', [Validators.maxLength(this.maxEntityNameLength)])
    });
  }
}
