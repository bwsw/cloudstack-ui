import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';


export enum Mode {
  assign,
  create,
  remove
}

@Component({
  selector: 'cs-create-update-delete-dialog',
  templateUrl: 'create-update-delete-dialog.component.html',
  styleUrls: ['create-update-delete-dialog.component.scss']
})
export class CreateUpdateDeleteDialogComponent implements OnInit {
  @Input() public defaultValue: string;
  @Input() public options: Array<string>;

  @Input() public enableAssign = true;
  @Input() public enableCreate = true;
  @Input() public enableRemove = true;

  @Input() public assignLabel: string;
  @Input() public createLabel: string;
  @Input() public removeLabel: string;

  @Input() public maxLength: number;

  @Input() public selectPlaceholder: string;
  @Input() public textFieldPlaceholder: string;

  @Input() public title: string;

  @Output() public onAssigned: EventEmitter<string>;
  @Output() public onCancel: EventEmitter<void>;
  @Output() public onCreated: EventEmitter<string>;
  @Output() public onRemoved: EventEmitter<void>;
  @ViewChild(MatInput) public textField: MatInput;

  public loading: boolean;
  public newValue: string;

  private _mode: Mode;
  public modes = Mode;

  constructor() {
    this.onAssigned = new EventEmitter<string>();
    this.onCancel = new EventEmitter<void>();
    this.onCreated = new EventEmitter<string>();
    this.onRemoved = new EventEmitter<void>();
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
    this.onCancel.emit();
  }

  public submit(): void {
    switch (this.mode) {
      case Mode.assign:
        this.onAssigned.emit(this.newValue);
        break;
      case Mode.create:
        this.onCreated.emit(this.newValue);
        break;
      case Mode.remove:
        this.onRemoved.emit();
        break;
      default: break;
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
      default: break;
    }
  }

  private setDefaultMode(): void {
    const defaultMode = this.options.length ? Mode.assign : Mode.create;
    this.setMode(defaultMode);
  }
}
