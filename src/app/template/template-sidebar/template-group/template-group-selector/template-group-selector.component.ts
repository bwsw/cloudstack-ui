import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../../../shared/base-template.model';
import { Mode } from '../../../../shared/components/create-update-delete-dialog/create-update-delete-dialog.component';
import { ImageGroup } from '../../../../shared/models';
import { getImageGroupId } from '../../../template-filter-list/template-filter-list.component';
import { Language } from '../../../../shared/types';

@Component({
  selector: 'cs-template-group-selector',
  templateUrl: 'template-group-selector.component.html',
  styleUrls: ['template-group-selector.component.scss'],
})
export class TemplateGroupSelectorComponent implements OnInit {
  @Input()
  public template: BaseTemplateModel;
  @Input()
  public groups: ImageGroup[];
  public groupNames: string[] = [];
  public loading: boolean;
  public modes = Mode;

  @Output()
  public groupChange = new EventEmitter();
  @Output()
  public groupReset = new EventEmitter();
  @Output()
  public cancel = new EventEmitter();

  constructor(private translate: TranslateService) {}

  public ngOnInit() {
    this.loadGroups();
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get groupName(): string {
    const imageGroupId = getImageGroupId(this.template);
    const imageGroup = this.groups.find(group => group.id === imageGroupId);
    return (
      imageGroup &&
      ((imageGroup.translations && imageGroup.translations[this.locale]) || imageGroup.id)
    );
  }

  public changeGroup(translation) {
    this.loading = true;
    const templateGroup = Object.values(this.groups).find(
      group =>
        (group.translations && group.translations[this.locale] === translation) ||
        group.id === translation,
    );
    this.groupChange.emit({ templateGroup, template: this.template });
  }

  public resetGroup(): void {
    this.groupReset.emit(this.template);
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private loadGroups(): void {
    Object.values(this.groups).forEach(group => {
      this.groupNames.push(group.translations ? group.translations[this.locale] : group.id);
    });
  }
}
