import {
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { SecurityGroup } from '../sg.model';
import { MatMenuTrigger } from '@angular/material';

export class SecurityGroupListItemComponent implements OnChanges {
  public item: SecurityGroup;
  public searchQuery: () => string;
  public onClick = new EventEmitter();
  public matMenuTrigger: MatMenuTrigger;
  public isSelected: (securityGroup) => boolean;

  public query: string;

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
