import { ActivatedRoute } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';

export abstract class BaseTemplateSidebarComponent {
  public entity: BaseTemplateModel;

  constructor(protected route: ActivatedRoute) {
  }

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild ? path.firstChild.routeConfig.path : null;
    return (tabId === pathLastChild);
  }
}
