export interface InstanceGroupTranslations {
  en?: string,
  ru?: string,
  cn?: string
}

export class InstanceGroup {
  public name: string;
  public translations: InstanceGroupTranslations;

  constructor(
    name: string,
    translations?: InstanceGroupTranslations
  ) {
    this.name = name;
    this.translations = {
      en: translations && translations.en || '',
      ru: translations && translations.ru || '',
      cn: translations && translations.cn || ''
    };
  }
}
