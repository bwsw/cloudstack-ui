import { Component } from '@angular/core';
import { NetworkRule } from '../../../../security-group/network-rule.model';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from '../../security-group/vm-creation-security-group-mode';


@Component({
  selector: 'cs-vm-creation-security-group',
  templateUrl: 'security-group.component.html',
  styleUrls: ['security-group.component.scss']
})
export class VmCreationSecurityGroupComponent {
  public builderRules: Array<NetworkRule>;
  public selectorSecurityGroup: SecurityGroup;
  private _displayMode = VmCreationSecurityGroupMode.Builder;

  public get displayMode(): VmCreationSecurityGroupMode {
    return this._displayMode;
  }

  public set displayMode(value: VmCreationSecurityGroupMode) {
    const map = {
      0: VmCreationSecurityGroupMode.Builder,
      1: VmCreationSecurityGroupMode.Selector
    };

    this._displayMode = map[value];
  }

  public get isModeBuilder(): boolean {
    return this.displayMode === VmCreationSecurityGroupMode.Builder;
  }

  public get isModeSelector(): boolean {
    return this.displayMode === VmCreationSecurityGroupMode.Selector;
  }

  public get title(): string {
    if (this.isModeBuilder) {
      return 'SECURITY_GROUP_SELECTOR.BUILD_NEW_GROUP';
    }

    if (this.isModeSelector) {
      return 'SECURITY_GROUP_SELECTOR.SELECT_EXISTING_GROUP';
    }
  }

  public onCancel(): void {}

  public onSave(): void {}
}
