import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
import { VmCreationSecurityGroupData } from '../../security-group/vm-creation-security-group-data';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';

@Component({
  selector: 'cs-vm-creation-security-group',
  templateUrl: 'vm-creation-security-group.component.html',
  styleUrls: ['vm-creation-security-group.component.scss'],
})
export class VmCreationSecurityGroupComponent {
  @Input()
  public sharedGroups: SecurityGroup[];
  @Input()
  public savedData: VmCreationSecurityGroupData;
  @Output()
  public saved = new EventEmitter<VmCreationSecurityGroupData>();
  @Output()
  public canceled = new EventEmitter();

  public title = {
    [VmCreationSecurityGroupMode.Builder]: 'SECURITY_GROUP_SELECTOR.BUILD_NEW_GROUP',
    [VmCreationSecurityGroupMode.Selector]: 'SECURITY_GROUP_SELECTOR.SELECT_EXISTING_GROUP',
  };

  public get VmCreationSecurityGroupMode() {
    return VmCreationSecurityGroupMode;
  }

  public get isModeBuilder(): boolean {
    return this.savedData.mode === VmCreationSecurityGroupMode.Builder;
  }

  public get isModeSelector(): boolean {
    return this.savedData.mode === VmCreationSecurityGroupMode.Selector;
  }

  public onBuilderGroupChange(rules: Rules): void {
    this.savedData.rules = rules;
  }
}
