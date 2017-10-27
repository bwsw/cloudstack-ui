import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

export enum ViewMode {
  BOX,
  LIST
}

@Component({
  selector: 'cs-filter',
  templateUrl: 'filter-panel.component.html',
  styleUrls: ['filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {
  @Input() key: string;
  @Output() onModeChange = new EventEmitter();

  public mode = ViewMode.BOX;

  constructor(private storage: LocalStorageService) { }

  ngOnInit() {
    const value = parseInt(this.storage.read(this.key));
    this.mode = value ? ViewMode.LIST : ViewMode.BOX;
    this.onModeChange.emit(this.mode);
  }

  changeMode() {
    this.mode = this.mode === 0 ? 1 : 0;
    this.storage.write(this.key, this.mode.toString());
    this.onModeChange.emit(this.mode);
  }

}
