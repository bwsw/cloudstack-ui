import { MdlPopoverComponent } from '@angular-mdl/popover';
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

import { AuthService } from '../../shared';
import { BaseTemplateModel } from '../shared';


@Component({
  selector: 'cs-template',
  templateUrl: 'template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent implements OnChanges {
  @HostBinding('class.single-line') @Input() public singleLine = true;
  @Input() public item: BaseTemplateModel;
  @Input() public isSelected: () => boolean;
  @Input() public searchQuery: () => string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

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
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.item);
    } else {
      this.popoverComponent.hide();
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
