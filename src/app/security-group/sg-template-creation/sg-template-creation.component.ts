import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SecurityGroupService } from '../services/security-group.service';
import { Rules } from '../sg-creation/sg-creation.component';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';
import { SecurityGroup } from '../sg.model';


@Component({
  selector: 'cs-security-group-template-creation',
  templateUrl: 'sg-template-creation.component.html',
  styleUrls: ['sg-template-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgTemplateCreationComponent {
  public name = '';
  public description = '';
  public securityRules: Rules;

  public creationInProgress = false;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<SgTemplateCreationComponent>,
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
