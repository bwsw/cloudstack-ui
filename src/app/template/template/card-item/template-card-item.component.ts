import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../../shared/services/auth.service';
import { BaseTemplateModel } from '../../shared';
import { TemplateComponent } from '../template.component';

@Component({
  selector: 'cs-template-card-item',
  templateUrl: 'template-card-item.component.html',
  styleUrls: ['template-card-item.component.scss'],
})
export class TemplateCardItemComponent extends TemplateComponent {
  @Input()
  public item: BaseTemplateModel;
  @Input()
  public isSelected: (item: BaseTemplateModel) => boolean;
  @Input()
  public searchQuery: () => string;
  @Output()
  public deleteTemplate = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger)
  public matMenuTrigger: MatMenuTrigger;

  public query: string;

  constructor(protected authService: AuthService) {
    super(authService);
  }
}
