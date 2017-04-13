import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';
import { AuthService } from '../../shared/services/auth.service';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';


@Component({
  selector: 'cs-template',
  templateUrl: 'template.component.html',
  styleUrls: ['template.component.scss']
})
export class TemplateComponent {
  @Input() public template: BaseTemplateModel;
  @Input() public isSelected: boolean;
  @Input() public singleLine = true;
  @Input() public searchQuery: string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  constructor(private authService: AuthService) {}

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.template);
    } else {
      this.popoverComponent.hide();
    }
  }

  public get ready(): boolean {
    return this.template.isReady;
  }

  public get isSelf(): boolean {
    return this.authService.username === this.template.account;
  }

  public removeTemplate(): void {
    this.deleteTemplate.next(this.template);
  }
}
