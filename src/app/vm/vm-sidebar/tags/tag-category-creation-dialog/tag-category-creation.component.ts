import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from '../../../../dialog/dialog-module';
import { ResourceTypes } from '../../../../shared/models';
import { TagService } from '../../../../shared/services';
import { VirtualMachine } from '../../../shared/vm.model';
import { TagCategory } from '../tag-category/vm-tag-category.component';


const categoryTagValue = 'CS_CATEGORY';

@Component({
  selector: 'cs-tag-category-creation',
  templateUrl: 'tag-category-creation.component.html',
  styleUrls: ['tag-category-creation.component.scss']
})
export class TagCategoryCreationComponent {
  public loading: boolean;

  public categoryName: string;

  constructor(
    @Inject('categories') private categories: Array<TagCategory>,
    @Inject('virtualMachine') private vm: VirtualMachine,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

  public get categoryAlreadyExists(): boolean {
    return !!this.categories.find(category => {
      return category.name === this.categoryName
    });
  }

  public onCreate(): void {
    const categoryTagName = this.categoryName + '.';
    this.loading = true;

    this.tagService.create({
      resourceIds: this.vm.id,
      resourceType: ResourceTypes.VM,
      'tags[0].key': categoryTagName,
      'tags[0].value': categoryTagValue
    })
      .subscribe(
        () => this.dialog.hide(this.categoryName),
        () => this.dialog.hide()
      );
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
