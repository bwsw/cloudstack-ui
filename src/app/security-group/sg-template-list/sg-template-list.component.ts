import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { SgTemplateCreationComponent } from '../sg-template-creation/sg-template-creation.component';
import { SecurityGroup } from '../sg.model';


@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: 'sg-template-list.component.html',
  styleUrls: ['sg-template-list.component.scss'],
  providers: [ListService]
})
export class SgTemplateListComponent implements OnInit {
  public predefinedSecurityGroupList: Array<SecurityGroup>;
  public customSecurityGroupList: Array<SecurityGroup>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private listService: ListService
  ) { }

  public ngOnInit(): void {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': 'template',
      'tags[0].value': 'true'
    });

    this.listService.onAction.subscribe(() => this.showCreationDialog());

    Observable.forkJoin([securityGroupTemplates, accountSecurityGroups])
      .subscribe(([templates, groups]) => {
        this.predefinedSecurityGroupList = templates;
        this.customSecurityGroupList = groups;
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm('CONFIRM_DELETE_TEMPLATE', 'NO', 'YES')
      .onErrorResumeNext()
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => sg.id !== securityGroup.id);
            this.translate.get('TEMPLATE_DELETED', { name: securityGroup.name })
              .subscribe(str => this.notificationService.message(str));
          }
        }
      );
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SgTemplateCreationComponent,
      clickOutsideToClose: false,
      classes: 'sg-template-creation-dialog'
    })
      .switchMap(res => res.onHide())
      .subscribe((template: SecurityGroup) => {
        if (!template) {
          return;
        }
        this.customSecurityGroupList.push(template);
        this.translate.get('TEMPLATE_CREATED', { name: template.name })
          .subscribe(str => this.notificationService.message(str));
        this.showRulesDialog(template);
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
