import {
  Component,
  Input
} from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import { VolumeCardItemComponent } from '../volume-item/card-item/volume-card-item.component';
import { VolumeRowItemComponent } from '../volume-item/row-item/volume-row-item.component';
import { ViewMode } from '../../shared/components/filter/filter-panel.component';


@Component({
  selector: 'cs-volume-list',
  templateUrl: 'volume-list.component.html'
})
export class VolumeListComponent {
  @Input() public volumes: Array<Volume>;
  @Input() public groupings: Array<any>;
  @Input() public query: string;
  @Input() public mode: ViewMode;
  public inputs;
  public outputs;

  public VolumeCardItemComponent = VolumeCardItemComponent;
  public VolumeRowItemComponent = VolumeRowItemComponent;

  constructor(public listService: ListService) {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: Volume) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectVolume.bind(this),
    };
  }

  public selectVolume(volume: Volume): void {
    this.listService.showDetails(volume.id);
  }
}
