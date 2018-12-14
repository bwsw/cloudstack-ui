import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { AffinityGroup, AffinityGroupType, emptyAffinityGroup } from '../../../shared/models';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

function isUniqName(affinityGroups: AffinityGroup[]): ValidatorFn {
  return function(control: FormControl) {
    const nameIsTaken =
      affinityGroups && affinityGroups.find(group => group.name === control.value);
    return nameIsTaken ? { nameIsTaken: true } : undefined;
  };
}

@Component({
  selector: 'cs-affinity-group-selector',
  templateUrl: 'affinity-group-selector.component.html',
  styleUrls: ['affinity-group-selector.component.scss'],
})
export class AffinityGroupSelectorComponent implements OnInit, OnChanges {
  @Input()
  public affinityGroups: AffinityGroup[];
  @Input()
  public sortedAffinityGroups: AffinityGroup[];
  @Input()
  public preselectedAffinityGroups: AffinityGroup[];
  @Input()
  public enablePreselected: boolean;
  @Output()
  public createdAffinityGroup = new EventEmitter<AffinityGroup>();
  @Output()
  public submited = new EventEmitter<string[]>();
  @Output()
  public canceled = new EventEmitter();
  public loading: boolean;
  public selectedGroup: AffinityGroup;
  public types = [AffinityGroupType.antiAffinity, AffinityGroupType.affinity];
  public affinityGroupForm: FormGroup;
  public maxEntityNameLength = 63;

  constructor(private formBuilder: FormBuilder) {}

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
      description: this.affinityGroupForm.value.description,
    } as AffinityGroup;
    this.affinityGroupForm.reset();
    this.createdAffinityGroup.emit(newAffinityGroup);
  }

  public changeGroup(group: AffinityGroup): void {
    this.selectedGroup = group;
  }

  public submit(): void {
    const selectedGroupIds = this.getSelectedAffinityGroups();
    this.submited.emit(selectedGroupIds);
  }

  private getSelectedAffinityGroups(): string[] {
    if (this.enablePreselected) {
      return [this.selectedGroup.id];
    }

    if (this.selectedGroup.id === emptyAffinityGroup) {
      return [];
    }
    const selectedGroupIds = this.preselectedAffinityGroups.map(group => group.id);
    selectedGroupIds.push(this.selectedGroup.id);
    return selectedGroupIds;
  }

  private createForm() {
    this.affinityGroupForm = this.formBuilder.group({
      name: this.formBuilder.control('', [
        Validators.required,
        Validators.maxLength(this.maxEntityNameLength),
        // ^[^\\d_*&^%$#@!~-]{1}[^,]*$
        Validators.pattern('^[A-Za-zА-Яа-я]{1}[^,]*$'),
        isUniqName(this.affinityGroups),
      ]),
      type: this.formBuilder.control(AffinityGroupType.antiAffinity, [Validators.required]),
      description: this.formBuilder.control('', [Validators.maxLength(this.maxEntityNameLength)]),
    });
  }
}
