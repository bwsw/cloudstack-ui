import {
  ChangeDetectionStrategy, Component, EventEmitter, Inject,
  Input, Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Rules } from '../../shared/components/security-group-builder/rules';
import { SecurityGroupService } from '../services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { SecurityGroupViewMode } from '../sg-filter/containers/sg-filter.container';


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
  @Output() public createSecurityGroup = new EventEmitter<any>();

  public name = '';
  public description = '';
  public securityRules: Rules;

  constructor(

    public dialogService: DialogService,
    private sgService: SecurityGroupService,
  ) {
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

  private get securityGroupCreationParams(): any {
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
