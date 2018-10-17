import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';

export enum Mode {
  assign,
  create,
  remove,
}

@Component({
  selector: 'cs-create-update-delete-dialog',
  templateUrl: 'create-update-delete-dialog.component.html',
  styleUrls: ['create-update-delete-dialog.component.scss'],
})
export class CreateUpdateDeleteDialogComponent implements OnInit {
  @Input()
  public defaultValue: string;
  @Input()
  public options: string[];

  @Input()
  public enableAssign = true;
  @Input()
  public enableCreate = true;
  @Input()
  public enableRemove = true;

  @Input()
  public assignLabel: string;
  @Input()
  public createLabel: string;
  @Input()
  public removeLabel: string;

  @Input()
  public maxLength: number;

  @Input()
  public selectPlaceholder: string;
  @Input()
  public textFieldPlaceholder: string;

  @Input()
  public title: string;

  @Output()
  public assigned: EventEmitter<string>;
  @Output()
  public canceled: EventEmitter<void>;
  @Output()
  public created: EventEmitter<string>;
  @Output()
  public removed: EventEmitter<void>;
  @ViewChild(MatInput)
  public textField: MatInput;

  public loading: boolean;
  public newValue: string;

  public modes = Mode;
  // tslint:disable-next-line:variable-name
  private _mode: Mode;

  constructor() {
    this.assigned = new EventEmitter<string>();
    this.canceled = new EventEmitter<void>();
    this.created = new EventEmitter<string>();
    this.removed = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this.setDefaultMode();
  }

  public get valueChanged(): boolean {
    const groupWasEmpty = !this.defaultValue && !!this.newValue;
    const groupChanged = this.defaultValue !== this.newValue;
    return groupWasEmpty || groupChanged;
  }

  public get mode(): Mode {
    return this._mode;
  }

  public setMode(mode: Mode) {
    if (this.mode !== mode) {
      this._mode = mode;
      this.setDefaultValue();
    }
  }

  public cancel(): void {
    this.canceled.emit();
  }

  public submit(): void {
    switch (this.mode) {
      case Mode.assign:
        this.assigned.emit(this.newValue);
        break;
      case Mode.create:
        this.created.emit(this.newValue);
        break;
      case Mode.remove:
        this.removed.emit();
        break;
      default:
        break;
    }
  }

  private setDefaultValue(): void {
    switch (this.mode) {
      case Mode.assign:
        this.newValue = this.defaultValue || this.options[0];
        break;
      case Mode.create:
        this.newValue = undefined;
        setTimeout(() => this.textField.focus());
        break;
      default:
        break;
    }
  }

  private setDefaultMode(): void {
    const defaultMode = this.options.length ? Mode.assign : Mode.create;
    this.setMode(defaultMode);
  }
}
