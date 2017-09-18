import { Component, Input } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import { VolumeItemComponent } from '../volume-item/volume-item.component';


@Component({
  selector: 'cs-volume-list',
  templateUrl: 'volume-list.component.html'
})
export class VolumeListComponent {
  @Input() public volumes: Array<Volume>;
  @Input() public groupings: Array<any>;
  @Input() public query: string;
  public inputs;
  public outputs;

  public VolumeItemComponent = VolumeItemComponent;

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
