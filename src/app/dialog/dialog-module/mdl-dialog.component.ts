import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { MdlDialogService, MdlDialogReference } from './mdl-dialog.service';
import { IMdlDialogConfiguration } from './mdl-dialog-configuration';
import { toBoolean } from '@angular-mdl/core/components/common/boolean-property';


@Component({
  // tslint:disable-next-line
  selector: 'mdl-dialog',
  template: `
    <div *dialogTemplate>
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class MdlDialogComponent {
  @Input() public config: IMdlDialogConfiguration;
  @Output() public showEmitter: EventEmitter<MdlDialogReference> = new EventEmitter<MdlDialogReference>();
  @Output() public hideEmitter: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(TemplateRef) public template: TemplateRef<any>;

  private _modal: boolean;
  @Input()
  get modal(): boolean { return this._modal; }
  set modal(value) { this._modal = toBoolean(value); }

  private isShown = false;
  private dialogRef: MdlDialogReference = null;

  constructor(private dialogService: MdlDialogService) {}


  public show(): Observable<MdlDialogReference> {
    if (this.isShown) {
      throw new Error('Only one instance of an embedded mdl-dialog can exist!');
    }
    this.isShown = true;

    let mergedConfig: IMdlDialogConfiguration = this.config || {};

    mergedConfig.isModal = typeof this.modal !== 'undefined' ? this.modal : mergedConfig.isModal;
    if (typeof mergedConfig.isModal === 'undefined') {
      mergedConfig.isModal = true;
    }

    let result: Subject<any> = new Subject();

    let p = this.dialogService.showDialogTemplate(this.template, mergedConfig);
    p.subscribe( (dialogRef: MdlDialogReference) => {

      this.dialogRef = dialogRef;

      this.dialogRef.onVisible().subscribe( () => {
        this.showEmitter.emit(dialogRef);

        result.next(dialogRef);
        result.complete();

      });

      this.dialogRef.onHide().subscribe( () => {
        this.hideEmitter.emit(null);
        this.dialogRef = null;
        this.isShown = false;
      });

    });
    return result.asObservable();
  }

  public close(): void {
    if (this.dialogRef) {
      this.dialogRef.hide();
    }
  }
}
