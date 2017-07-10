import { MdlDialogReference } from '@angular-mdl/core';
import { Component, Inject } from '@angular/core';
import { ResourceTypes } from '../../../../shared/models';
import { TagService } from '../../../../shared/services';
import { VirtualMachine } from '../../../shared/vm.model';


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
    @Inject('virtualMachine') private vm: VirtualMachine,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

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
