import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { InstanceGroupEnabledService } from '../../../interfaces/instance-group-enabled-service';
import {
  InstanceGroupSelectorComponent,
  InstanceGroupSelectorData
} from '../instance-group-selector/instance-group-selector.component';
import { Language } from '../../../services/language.service';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss']
})
export class InstanceGroupComponent {
  @Input() public entity: InstanceGroupEnabled;
  @Input() public entityService: InstanceGroupEnabledService;

  constructor(
    private dialog: MdDialog,
    private translateService: TranslateService
  ) {}

  public get groupName(): string {
    if (this.useEnglishTranslation) {
      return this.entity.instanceGroup.translations.en;
    }

    if (this.useRussianTranslation) {
      return this.entity.instanceGroup.translations.ru;
    }

    if (this.useChineseTranslation) {
      return this.entity.instanceGroup.translations.cn;
    }

    if (this.useDefaultName) {
      return this.entity.instanceGroup && this.entity.instanceGroup.name;
    }
  }

  public changeGroup(): void {
    this.dialog.open(InstanceGroupSelectorComponent, {
      width: '350px',
      data: this.instanceGroupSelectorParams
    });
  }

  private get instanceGroupSelectorParams(): InstanceGroupSelectorData {
    return {
      entity: this.entity,
      entityService: this.entityService
    };
  }

  private get useEnglishTranslation(): boolean {
    return (
      this.translateService.currentLang === Language.en &&
      this.entity.instanceGroup &&
      this.entity.instanceGroup.translations &&
      !!this.entity.instanceGroup.translations.en
    );
  }

  private get useRussianTranslation(): boolean {
    return (
      this.translateService.currentLang === Language.ru &&
      this.entity.instanceGroup &&
      this.entity.instanceGroup.translations &&
      !!this.entity.instanceGroup.translations.ru
    );
  }

  private get useChineseTranslation(): boolean {
    return (
      this.translateService.currentLang === Language.cn &&
      this.entity.instanceGroup &&
      this.entity.instanceGroup.translations &&
      !!this.entity.instanceGroup.translations.cn
    );
  }

  private get useDefaultName(): boolean {
    return (
      !this.useEnglishTranslation &&
      !this.useRussianTranslation &&
      !this.useChineseTranslation
    );
  }
}
