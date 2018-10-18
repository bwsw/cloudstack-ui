import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../shared/base-template.model';
import { ImageGroup } from '../../shared/models';
import { templateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { AuthService } from '../../shared/services/auth.service';
import { Language } from '../../shared/types';

export const getGroupName = (template: BaseTemplateModel) => {
  return template.domain !== 'ROOT' ? `${template.domain}/${template.account}` : template.account;
};

export const getImageGroupId = (item: BaseTemplateModel) => {
  const tag = item.tags.find(_ => _.key === templateTagKeys.group);
  return tag && tag.value;
};

export type noGroup = '-1';
export const noGroup: noGroup = '-1';

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss'],
})
export class TemplateFilterListComponent {
  @Input()
  public groups: ImageGroup[] = [];
  public groupings = [
    {
      key: 'zones',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneid || '',
      name: (item: BaseTemplateModel) => item.zonename || 'TEMPLATE_PAGE.FILTERS.NO_ZONE',
    },
    {
      key: 'accounts',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: BaseTemplateModel) => item.account,
      name: getGroupName,
    },
    {
      key: 'groups',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_GROUPS',
      selector: (item: BaseTemplateModel) => this.getGroup(item) || noGroup,
      name: (item: BaseTemplateModel) => this.getGroup(item) || 'TEMPLATE_PAGE.FILTERS.GENERAL',
    },
  ];

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  constructor(private translate: TranslateService, private authService: AuthService) {
    if (!this.isAdmin) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    }
  }

  private getGroup(item: BaseTemplateModel): string {
    const imageGroupId = getImageGroupId(item);
    const imageGroup = this.groups.find(group => group.id === imageGroupId);
    return imageGroup && imageGroup.translations && imageGroup.translations[this.locale];
  }
}
