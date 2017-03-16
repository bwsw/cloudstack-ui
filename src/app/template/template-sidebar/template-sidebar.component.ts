import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../shared';
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-template-sidebar',
  templateUrl: 'template-sidebar.component.html'
})
export class TemplateSidebarComponent {
  @Input() public template: BaseTemplateModel;
  @Output() public deleteTemplate = new EventEmitter();

  constructor(
    private authService: AuthService
  ) {}

  public get isSelf(): boolean {
    return this.authService.username === this.template.account;
  }

  public remove(): void {
    this.deleteTemplate.next(this.template);
  }
}
