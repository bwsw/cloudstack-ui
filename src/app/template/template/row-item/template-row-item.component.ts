import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../../shared/services/auth.service';
import { BaseTemplateModel } from '../../shared';
import { TemplateComponent } from '../template.component';

@Component({
  selector: 'cs-template-row-item',
  templateUrl: 'template-row-item.component.html',
  styleUrls: ['template-row-item.component.scss'],
})
export class TemplateRowItemComponent extends TemplateComponent {
  @HostBinding('class.single-line')
  @Input()
  public singleLine = true;
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
