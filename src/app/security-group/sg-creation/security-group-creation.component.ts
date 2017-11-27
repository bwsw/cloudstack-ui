import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Rules } from '../../shared/components/security-group-builder/rules';
import { SecurityGroupViewMode } from '../sg-filter/containers/sg-filter.container';

export interface SecurityGroupCreationParams {
  mode: SecurityGroupViewMode;
  data: {
    name: string,
    description: string
  };
  rules?: Rules
}

@Component({
  selector: 'cs-security-group-creation',
  templateUrl: 'security-group-creation.component.html',
  styleUrls: ['security-group-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityGroupCreationComponent {
  @Input() public creationInProgress = false;
  @Input() public mode: SecurityGroupViewMode;
  @Output() public cancel = new EventEmitter();
  @Output() public createSecurityGroup = new EventEmitter<SecurityGroupCreationParams>();

  public name = '';
  public description = '';
  public securityRules: Rules;

  constructor(public dialogService: DialogService) {
  }

  public get isModeTemplates(): boolean {
    return this.mode === SecurityGroupViewMode.Templates;
  }

  public get isModeShared(): boolean {
    return this.mode === SecurityGroupViewMode.Shared;
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    this.createSecurityGroup.emit(this.securityGroupCreationParams);
  }

  private get securityGroupCreationParams(): SecurityGroupCreationParams {
    return {
      mode: this.mode,
      data: {
        name: this.name,
        description: this.description
      },
      rules: this.securityRules
    };
  }
}
