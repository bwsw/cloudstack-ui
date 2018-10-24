import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { Template } from '../shared/template.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss'],
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent {
  @Input()
  public entity: Template;

  constructor(route: ActivatedRoute, authService: AuthService) {
    super(route, authService);
  }
}
