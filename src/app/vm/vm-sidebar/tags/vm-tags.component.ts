import { Component, Input, NgZone, OnInit } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { TagCategory } from './tag-category/vm-tag-category.component';
import groupBy = require('lodash/groupBy');
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { VmTagCreationDialogComponent } from './tag-creation-dialog/vm-tag-creation-dialog.component';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html',
  styleUrls: ['vm-tags.component.scss']
})
export class VmTagsComponent implements OnInit {
  @Input() public vm: VirtualMachine;

  public categories: Array<TagCategory>;

  constructor(private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.categories = this.getCategories();
  }

  public addTag(): void {
    this.dialogService.showCustomDialog({
      component: VmTagCreationDialogComponent,
      classes: 'vm-tag-creation-dialog',
      providers: [
        { provide: 'categories', useValue: this.categories },
        { provide: 'virtualMachine', useValue: this.vm }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe();
  }

  private getCategories(): Array<TagCategory> {
    const groupedTags = groupBy(this.vm.tags, 'categoryName');

    return Object.keys(groupedTags)
      .map(category => {
        return {
          name: category,
          tags: groupedTags[category]
        }
      });
  }
}
