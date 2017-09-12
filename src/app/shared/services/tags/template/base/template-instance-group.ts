import { InstanceGroup } from '../../../../models/instance-group.model';


export interface LocalizedInstanceGroupTranslations {
  en?: string,
  ru?: string,
  cn?: string
}

export class LocalizedInstanceGroup extends InstanceGroup {
  public name: string;
  public translations: LocalizedInstanceGroupTranslations;

  constructor(
    name: string,
    translations?: LocalizedInstanceGroupTranslations
  ) {
    super(name);

    this.translations = {
      en: translations && translations.en || '',
      ru: translations && translations.ru || '',
      cn: translations && translations.cn || ''
    };
  }
}
