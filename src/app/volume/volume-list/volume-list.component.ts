import { Component, Input } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import { VolumeCardItemComponent } from '../volume-item/card-item/volume-card-item.component';
import { VolumeRowItemComponent } from '../volume-item/row-item/volume-row-item.component';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';

@Component({
  selector: 'cs-volume-list',
  templateUrl: 'volume-list.component.html',
})
export class VolumeListComponent {
  @Input()
  public volumes: Volume[];
  @Input()
  public groupings: any[];
  @Input()
  public query: string;
  @Input()
  public mode: ViewMode;
  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: Volume) => this.listService.isSelected(item.id),
    };

    this.outputs = {
      onClick: this.selectVolume.bind(this),
    };
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? VolumeCardItemComponent : VolumeRowItemComponent;
  }

  public selectVolume(volume: Volume): void {
    this.listService.showDetails(volume.id);
  }
}
