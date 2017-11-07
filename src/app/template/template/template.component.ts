import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { BaseTemplateModel } from '../shared';
import { OsType } from '../../shared/models/os-type.model';


@Component({
  selector: 'cs-template',
  templateUrl: 'template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent implements OnChanges {
  @HostBinding('class.single-line') @Input() public singleLine = true;
  @Input() public item: BaseTemplateModel;
  @Input() public isSelected: (item: BaseTemplateModel) => boolean;
  @Input() public osTypes: Array<OsType>;
  @Input() public searchQuery: () => string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger) public mdMenuTrigger: MatMenuTrigger;
  // public singleLine = true;
  // public item: BaseTemplateModel;
  // public isSelected: (item: BaseTemplateModel) => boolean;
  // public searchQuery: () => string;
  // public deleteTemplate = new EventEmitter();
  // public onClick = new EventEmitter();
  // public matMenuTrigger: MatMenuTrigger;

  public query: string;

  constructor(protected authService: AuthService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger || !this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public get isSelf(): boolean {
    return this.authService.user.username === this.item.account;
  }
}
