import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export enum ViewMode {
  LIST,
  BOX
}

@Component({
  selector: 'cs-filter',
  templateUrl: 'filter-panel.component.html',
  styleUrls: ['filter-panel.component.scss']
})
export class FilterPanelComponent {
  @Input() mode = ViewMode.BOX;
  @Output() onModeChange = new EventEmitter();

  changeMode() {
    this.mode = this.mode === 0 ? 1 : 0;
    this.onModeChange.emit(this.mode);
  }

}
