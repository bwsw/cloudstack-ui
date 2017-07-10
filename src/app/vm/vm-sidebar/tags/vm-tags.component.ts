import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { VirtualMachine } from '../../shared/vm.model';
import { TagCategoryCreationComponent } from './tag-category-creation-dialog/tag-category-creation.component';
import { TagCategory } from './tag-category/vm-tag-category.component';
import { VmTagCreationDialogComponent } from './tag-creation-dialog/vm-tag-creation-dialog.component';
import groupBy = require('lodash/groupBy');


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

  public addCategory(): void {
    this.dialogService.showCustomDialog({
      component: TagCategoryCreationComponent,
      classes: 'tag-category-creation-dialog',
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
        const tags = groupedTags[category].filter(tag => {
          const tagParts = tag.key.split('.');
          return !(tagParts.length === 2 && !tagParts[1]);
        });

        return {
          name: category,
          tags
        }
      });
  }
}
