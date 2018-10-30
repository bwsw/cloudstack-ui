import { ActivatedRoute } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { AuthService } from '../../shared/services/auth.service';

export abstract class BaseTemplateSidebarComponent {
  public entity: BaseTemplateModel;

  public get notFound(): boolean {
    return !this.entity;
  }

  public get isSelf(): boolean {
    return this.authService.user && this.authService.user.account === this.entity.account;
  }

  constructor(protected route: ActivatedRoute, protected authService: AuthService) {}

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild ? path.firstChild.routeConfig.path : null;
    return tabId === pathLastChild;
  }
}
