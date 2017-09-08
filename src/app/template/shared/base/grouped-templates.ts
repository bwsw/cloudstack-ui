import { BaseTemplateModel } from './base-template.model';
import { TemplateFilters } from './template-filters';


export class GroupedTemplates<T extends BaseTemplateModel> {
  public community: Array<T>;
  public executable: Array<T>;
  public featured: Array<T>;
  public self: Array<T>;
  public selfExecutable: Array<T>;
  public sharedExecutable: Array<T>;

  constructor(templates: {}) {
    this.community = templates[TemplateFilters.community] || [];
    this.executable = templates[TemplateFilters.executable] || [];
    this.featured = templates[TemplateFilters.featured] || [];
    this.self = templates[TemplateFilters.self] || [];
    this.selfExecutable = templates[TemplateFilters.selfExecutable] || [];
    this.sharedExecutable = templates[TemplateFilters.sharedExecutable] || [];
  }

  public toArray(): Array<T> {
    return []
      .concat(this.featured)
      .concat(this.selfExecutable)
      .concat(this.community)
      .concat(this.sharedExecutable)
      .concat(this.executable)
      .concat(this.self);
  }
}

