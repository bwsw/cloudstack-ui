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
  @ViewChild(MdlTextFieldComponent) public textFieldComponent: MdlTextFieldComponent;

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected translateService: TranslateService
  ) {
    super(changeDetectorRef);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.translateService.get(['CLICK_TO_EDIT', 'ENTER_TEXT'])
      .subscribe(translations => {
        if (!this.contentPlaceholder) {
          this.contentPlaceholder = translations['CLICK_TO_EDIT'];
        }
        if (!this.inputPlaceholder) {
          this.inputPlaceholder = translations['ENTER_TEXT'];
        }
      });
  }

  public edit(): void {
    super.edit();
    this.textFieldComponent.setFocus();
  }
}
