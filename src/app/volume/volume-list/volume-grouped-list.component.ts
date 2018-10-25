import { Component } from '@angular/core';
import { GroupedListComponent } from '../../shared/components/grouped-list/grouped-list.component';
import { volumeTypeNames } from '../../shared/models';

@Component({
  selector: 'cs-volume-grouped-list',
  template: `
    <ng-container *ngFor="let child of tree">
      <div class="grouped-section" *ngIf="child.name; else leaf">
        <h4>{{ child.name | translate }}</h4>
        <cs-volume-grouped-list
          [component]="component"
          [groupings]="groupings"
          [level]="level + 1"
          [list]="child.items"
          [dynamicInputs]="dynamicInputs"
          [dynamicOutputs]="dynamicOutputs"
        ></cs-volume-grouped-list>
      </div>
      <ng-template #leaf>
        <mat-list>
          <ndc-dynamic
            *ngFor="let item of child.items"
            [ndcDynamicComponent]="component"
            [ndcDynamicInputs]="leafInputs(item)"
            [ndcDynamicOutputs]="dynamicOutputs"
          ></ndc-dynamic>
        </mat-list>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['../../shared/components/grouped-list/grouped-list.component.scss'],
})
export class VolumeGroupedListComponent extends GroupedListComponent {
  protected sortGroups(group1, group2) {
    return group1.name === volumeTypeNames['ROOT']
      ? -1
      : group1.name === volumeTypeNames['DATADISK']
        ? 1
        : group1.name.localeCompare(group2.name);
  }
}
