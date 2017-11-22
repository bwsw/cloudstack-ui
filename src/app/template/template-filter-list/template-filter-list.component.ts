import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TranslateService } from '@ngx-translate/core';
import { TemplateGroup } from '../../shared/models/template-group.model';
import { Language } from '../../shared/services/language.service';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';

export const getGroupName = (template: BaseTemplateModel) => {
  return template.domain !== 'ROOT'
    ? `${template.domain}/${template.account}`
    : template.account;
};

export const getTemplateGroupId = (item: BaseTemplateModel) => {
  const tag = item.tags.find(
    _ => _.key === TemplateTagKeys.group);
  return tag && tag.value;
};

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent {
  @Input() public groups: TemplateGroup[] = [];
  public groupings = [
    {
      key: 'zones',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'TEMPLATE_PAGE.FILTERS.NO_ZONE'
    },
    {
      key: 'accounts',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: BaseTemplateModel) => item.account,
      name: (item: BaseTemplateModel) => getGroupName(item),
    },
    {
      key: 'groups',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_GROUPS',
      selector: getTemplateGroupId,
      name: (item: BaseTemplateModel) => this.groups[getTemplateGroupId(item)]
        && this.groups[getTemplateGroupId(item)].translations
        && this.groups[getTemplateGroupId(item)].translations[this.locale]
        || getTemplateGroupId(item) || 'TEMPLATE_PAGE.FILTERS.GENERAL'
    }
  ];

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  constructor(private translate: TranslateService) {
  }
}
