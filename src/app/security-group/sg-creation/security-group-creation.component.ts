import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Rules } from '../../shared/components/security-group-builder/rules';
import { SecurityGroupService } from '../services/security-group.service';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';
import { SecurityGroup } from '../sg.model';


@Component({
  selector: 'cs-security-group-creation',
  templateUrl: 'security-group-creation.component.html',
  styleUrls: ['security-group-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityGroupCreationComponent {
  public name = '';
  public description = '';
  public securityRules: Rules;

  public creationInProgress = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SecurityGroupCreationComponent>,
    public dialogService: DialogService,
    private sgService: SecurityGroupService,
  ) { }

  public get isModeTemplates(): boolean {
    return this.mode === SecurityGroupViewMode.Templates;
  }

  public get isModeShared(): boolean {
    return this.mode === SecurityGroupViewMode.Shared;
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    this.createSecurityGroup(this.securityGroupCreationParams);
  }

  public createSecurityGroup({ data, rules }): void {
    this.creationInProgress = true;
    this.getSecurityGroupCreationRequest(data, rules)
      .switchMap(template => rules ? this.sgService.get(template.id) : Observable.of(template))
      .finally(() => this.creationInProgress = false)
      .subscribe(
        template => this.dialogRef.close(template),
        error => this.handleError(error)
      );
  }

  private get mode(): SecurityGroupViewMode {
    return this.data.mode;
  }

  private get securityGroupCreationParams(): any {
    return {
      data: {
        name: this.name,
        description: this.description
      },
      rules: this.securityRules
    };
  }

  private getSecurityGroupCreationRequest(data: any, rules: Rules): Observable<SecurityGroup> {
    if (this.mode === SecurityGroupViewMode.Templates) {
      return this.sgService.createTemplate(data, rules);
    } else {
      return this.sgService.createShared(data, rules);
    }
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
