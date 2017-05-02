import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MdlTextFieldComponent } from 'angular2-mdl';
import { TranslateService } from '@ngx-translate/core';
import { AbstractInlineEditComponent } from './abstract-inline-edit.component';


@Component({
  selector: 'cs-inline-edit',
  templateUrl: 'inline-edit.component.html',
  styleUrls: ['inline-edit.scss', 'inline-edit.component.scss']
})
export class InlineEditComponent extends AbstractInlineEditComponent implements OnInit {
  @Input() public rows: number;
  @Input() public maxrows: number;
  @Input() public maxLength: number;

  @ViewChild(MdlTextFieldComponent) public textFieldComponent: MdlTextFieldComponent;

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected translateService: TranslateService
  ) {
    super(changeDetectorRef);
    this.contentPlaceholder = 'CLICK_TO_EDIT';
    this.inputPlaceholder = 'ENTER_TEXT';
  }

  public edit(): void {
    super.edit();
    this.textFieldComponent.setFocus();
  }

  public updateTextFieldText(newText: string): void {
    this.textFieldText = newText;

    if (this.maxLength && this.textFieldText.length > this.maxLength) {
      this.textFieldText = this.textFieldText.substr(0, this.maxLength);
      this.changeDetectorRef.detectChanges();
      this.textFieldComponent.writeValue(this.textFieldText);
    }
  }
}
