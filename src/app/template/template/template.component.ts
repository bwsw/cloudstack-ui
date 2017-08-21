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


@Component({
  selector: 'cs-template',
  templateUrl: 'template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent implements OnChanges {
  @HostBinding('class.single-line') @Input() public singleLine = true;
  @Input() public item: BaseTemplateModel;
  @Input() public isSelected: (item: BaseTemplateModel) => boolean;
  @Input() public searchQuery: () => string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public query: string;

  constructor(private authService: AuthService) {}

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

  public get ready(): boolean {
    return this.item.isReady;
  }

  public get isSelf(): boolean {
    return this.authService.username === this.item.account;
  }

  public removeTemplate(): void {
    this.deleteTemplate.next(this.item);
  }
}
