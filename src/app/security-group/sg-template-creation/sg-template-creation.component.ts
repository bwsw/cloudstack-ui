import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SecurityGroupService } from '../../shared/services/security-group/security-group.service';
import { Rules } from '../sg-creation/sg-creation.component';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';

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

  public onSubmit(e: Event): void {
    e.preventDefault();

    if (this.data.viewMode === SecurityGroupViewMode.Templates) {
      this.createSecurityGroupTemplate(this.securityGroupCreationParams);
    }

    if (this.data.viewMode === SecurityGroupViewMode.Shared) {
    }
  }

  public createSecurityGroupTemplate({ data, rules }): void {
    this.creationInProgress = true;
    this.sgService.createTemplate(data, rules)
      .switchMap(template => rules ? this.sgService.get(template.id) : Observable.of(template))
      .finally(() => this.creationInProgress = false)
      .subscribe(
        template => this.dialogRef.close(template),
        error => this.handleError(error)
      );
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

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
