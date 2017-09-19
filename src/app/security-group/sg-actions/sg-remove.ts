import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { SecurityGroupAction } from './sg-action';


@Injectable()
export class SecurityGroupRemoveAction extends SecurityGroupAction {
  public name = 'COMMON.DELETE';
  public icon = 'delete';

  public activate(securityGroup: SecurityGroup): Observable<any> {
    return this.dialogService.confirm({message: 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.onConfirm(securityGroup);
        } else {
          return Observable.of(null);
        }
      });
  }

  public onConfirm(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupService.deleteGroup(securityGroup)
      .map(() => {
        this.notificationService.message({
          translationToken: this.getSuccessTranslationToken(securityGroup),
          interpolateParams: {name: securityGroup.name}
        });
      });
  }

  private getSuccessTranslationToken(securityGroup: SecurityGroup): string {
    if (securityGroup.type === SecurityGroupType.CustomTemplate) {
      return 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED';
    }

    if (securityGroup.type === SecurityGroupType.Shared) {
      return 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_DELETED';
    }
  }
}
