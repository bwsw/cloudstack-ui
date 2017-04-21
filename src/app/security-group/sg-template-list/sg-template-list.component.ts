import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from '@ngx-translate/core';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { SgTemplateCreationComponent } from '../sg-template-creation/sg-template-creation.component';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { NotificationService } from '../../shared/services/notification.service';
import { ListService } from '../../shared/components/list/list.service';


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
    private dialogService: MdlDialogService,
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

  public createSecurityGroupTemplate(data): void {
    let translatedString = '';
    this.translate.get('TEMPLATE_CREATED', { name: data.name })
      .switchMap(str => {
        translatedString = str;
        return this.securityGroupService.createTemplate(data);
      })
      .subscribe(template => {
        this.customSecurityGroupList.push(template);
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
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => sg.id !== securityGroup.id);
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
