import { Component } from '@angular/core';
import { GroupedListComponent } from '../../shared/components/grouped-list/grouped-list.component';

@Component({
  selector: 'cs-volume-grouped-list',
  templateUrl: '../../shared/components/grouped-list/grouped-list.component.html',
  styleUrls: ['../../shared/components/grouped-list/grouped-list.component.scss']
})
export class VolumeGroupedListComponent extends GroupedListComponent {
  protected sortGroups(group1, group2) {
    return group1.name === 'VOLUME_TYPE.ROOT' ? -1 : 1;
  }
}
