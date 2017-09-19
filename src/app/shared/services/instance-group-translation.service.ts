import { Injectable } from '@angular/core';
import { InstanceGroup } from '../models/instance-group.model';
import { Language } from './language.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class InstanceGroupTranslationService {
  constructor(private translateService: TranslateService) {}

  public getGroupName(instanceGroup: InstanceGroup): string {
    if (!instanceGroup) {
      return undefined;
    }

    if (this.useEnglishTranslation(instanceGroup)) {
      return instanceGroup.translations.en;
    }

    if (this.useRussianTranslation(instanceGroup)) {
      return instanceGroup.translations.ru;
    }

    if (this.useChineseTranslation(instanceGroup)) {
      return instanceGroup.translations.cn;
    }

    if (this.useDefaultName(instanceGroup)) {
      return instanceGroup && instanceGroup.name;
    }
  }

  private useEnglishTranslation(instanceGroup: InstanceGroup): boolean {
    return (
      this.translateService.currentLang === Language.en &&
      instanceGroup.translations &&
      !!instanceGroup.translations.en
    );
  }

  private useRussianTranslation(instanceGroup: InstanceGroup): boolean {
    return (
      this.translateService.currentLang === Language.ru &&
      instanceGroup.translations &&
      !!instanceGroup.translations.ru
    );
  }

  private useChineseTranslation(instanceGroup: InstanceGroup): boolean {
    return (
      this.translateService.currentLang === Language.cn &&
      instanceGroup.translations &&
      !!instanceGroup.translations.cn
    );
  }

  private useDefaultName(instanceGroup: InstanceGroup): boolean {
    return (
      !this.useEnglishTranslation(instanceGroup) &&
      !this.useRussianTranslation(instanceGroup) &&
      !this.useChineseTranslation(instanceGroup)
    );
  }
}
