import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { Rules } from '../sg-creation/sg-creation.component';

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
    public dialogRef: MdDialogRef<SgTemplateCreationComponent>,
    public dialogsService: DialogsService,
    private sgService: SecurityGroupService
  ) { }

  public onSubmit(e: Event): void {
    e.preventDefault();
    this.createSecurityGroupTemplate({
      data: {
        name: this.name,
        description: this.description
      },
      rules: this.securityRules
    });
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

  private handleError(error): void {
    this.dialogsService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
