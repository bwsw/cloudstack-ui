import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MdlButtonComponent, MdlDialogReference } from 'angular2-mdl';
import { ParametrizedTranslation } from './dialog.service';


export interface CustomSimpleDialogConfig {
  message: string | ParametrizedTranslation;
  title?: string;
  width?: string;
  clickOutsideToClose?: boolean;
}

@Component({
  selector: 'cs-custom-confirm',
  templateUrl: 'custom-confirm.component.html',
  styleUrls: ['custom-simple-dialog.scss']
})
export abstract class CustomSimpleComponent implements OnInit {
  @ViewChild(MdlButtonComponent) private focusButton: MdlButtonComponent;

  constructor(
    @Inject('config') public config: CustomSimpleDialogConfig,
    protected dialog: MdlDialogReference
  ) {}

  public ngOnInit(): void {
    this.dialog.onVisible()
      .subscribe(() => {
        this.focusButton.elementRef.nativeElement.focus();
      });
  }

  public get messageIsParametrized(): boolean {
    return typeof this.config.message !== 'string';
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    this.dialog.hide();
  }
}
