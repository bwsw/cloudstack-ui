import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

export enum ViewMode {
  BOX,
  LIST,
}

@Component({
  selector: 'cs-view-mode-switch',
  templateUrl: 'view-mode-switch.component.html',
  styleUrls: ['view-mode-switch.component.scss'],
})
export class ViewModeSwitchComponent implements OnInit {
  @Input()
  key: string;
  @Output()
  modeChanged = new EventEmitter();

  public mode = ViewMode.BOX;

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
    const value = parseInt(this.storage.read(this.key), 10);
    this.mode = value ? ViewMode.LIST : ViewMode.BOX;
    this.modeChanged.emit(this.mode);
  }

  changeMode() {
    this.mode = this.mode === ViewMode.BOX ? ViewMode.LIST : ViewMode.BOX;
    this.storage.write(this.key, this.mode.toString());
    this.modeChanged.emit(this.mode);
  }
}
