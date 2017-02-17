import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { SgTemplateCreationComponent } from '../sg-template-creation/sg-template-creation.component';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: 'sg-template-list.component.html'
})
export class SgTemplateListComponent implements OnInit {
  private securityGroupList: Array<SecurityGroup>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: MdlDialogService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  public ngOnInit(): void {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': 'template',
      'tags[0].value': 'true'
    });

    Observable.forkJoin([securityGroupTemplates, accountSecurityGroups])
      .subscribe(([templates, groups]) => {
        this.securityGroupList = templates.concat(groups);
      });
  }

  public createSecurityGroupTemplate(data): void {
    let translatedString = '';
    this.translate.get('TEMPLATE_CREATED', { name: data.name })
      .switchMap(str => {
        translatedString = str;
        return this.securityGroupService.createTemplate(data);
      })
      .subscribe(template => {
        this.securityGroupList.push(template);
        this.notificationService.message(translatedString);
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    let translatedStrings = [];
    this.translate.get([
      'YES',
      'NO',
      'CONFIRM_DELETE_TEMPLATE',
      'TEMPLATE_DELETED'
    ], {
      name: securityGroup.name
    })
      .switchMap(strs => {
        translatedStrings = strs;
        return this.dialogService.confirm(
          translatedStrings['CONFIRM_DELETE_TEMPLATE'],
          translatedStrings['NO'],
          translatedStrings['YES']
        );
      })
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(res => {
          if (res && res.success === 'true') {
            this.securityGroupList = this.securityGroupList.filter(sg => sg.id !== securityGroup.id);
            this.notificationService.message(translatedStrings['TEMPLATE_DELETED']);
          }
        },
        // handle errors from cancel button
        () => {}
      );
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SgTemplateCreationComponent,
      classes: 'sg-template-creation-dialog'
    })
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.createSecurityGroupTemplate(data);
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      classes: 'sg-rules-dialog',
      providers: [{ provide: 'securityGroup', useValue: group }],
    });
  }
}
