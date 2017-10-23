import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
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
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public query: string;

  constructor(private authService: AuthService) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const query = changes.searchQuery;
    if (query) {
      this.query = this.searchQuery();
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger || !this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public get isSelf(): boolean {
    return this.authService.user.username === this.item.account;
  }
}
