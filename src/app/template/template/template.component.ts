import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { BaseTemplateModel } from '../shared';

export class TemplateComponent implements OnChanges {
  public singleLine = true;
  public item: BaseTemplateModel;
  public isSelected: (item: BaseTemplateModel) => boolean;
  public searchQuery: () => string;
  public deleteTemplate = new EventEmitter();
  public onClick = new EventEmitter();

  public query: string;

  constructor(protected authService: AuthService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public handleClick(): void {
    this.onClick.emit(this.item);
  }

  public get isSelf(): boolean {
    return this.authService.user.account === this.item.account;
  }
}
