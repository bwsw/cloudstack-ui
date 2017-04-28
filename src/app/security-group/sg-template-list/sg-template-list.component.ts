import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroup } from '../sg.model';
import {
  SgTemplateCreationComponent,
  SgTemplateFormData
} from '../sg-template-creation/sg-template-creation.component';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { NotificationService } from '../../shared/services/notification.service';
import { ListService } from '../../shared/components/list/list.service';
import { DialogService } from '../../shared/services/dialog.service';


@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: 'sg-template-list.component.html',
  styleUrls: ['sg-template-list.component.scss'],
  providers: [ListService]
})
export class SgTemplateListComponent implements OnInit {
  public predefinedSecurityGroupList: Array<SecurityGroup>;
  public customSecurityGroupList: Array<SecurityGroup>;
  public sgCreationFormData: SgTemplateFormData;

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

  public createSecurityGroupTemplate(data): Observable<void> {
    let translatedString = '';
    return this.translate.get('TEMPLATE_CREATED', { name: data.name })
      .switchMap(str => {
        translatedString = str;
        return this.securityGroupService.createTemplate(data);
      })
      .map(template => {
        this.customSecurityGroupList.push(template);
        this.notificationService.message(translatedString);
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm('CONFIRM_DELETE_TEMPLATE', 'NO', 'YES')
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => sg.id !== securityGroup.id);
            this.translate.get('TEMPLATE_DELETED', { name: securityGroup.name })
              .subscribe(str => this.notificationService.message(str['TEMPLATE_DELETED']));
          }
        },
        // handle errors from cancel button
        () => {}
      );
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SgTemplateCreationComponent,
      classes: 'sg-template-creation-dialog',
      providers: [{ provide: 'formData', useValue: this.sgCreationFormData }]
    })
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        this.sgCreationFormData = undefined;
        if (!data) { return; }
        this.createSecurityGroupTemplate(data)
          .subscribe(
            () => {},
            error => {
              this.sgCreationFormData = data;
              this.handleSgCreationError(error);
            }
          );
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      classes: 'sg-rules-dialog',
      providers: [{ provide: 'securityGroup', useValue: group }],
    });
  }

  private handleSgCreationError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    })
      .subscribe(() => this.showCreationDialog());
  }
}
