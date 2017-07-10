import { Component, Inject } from '@angular/core';
import { ResourceTypes } from '../../../../shared/models';
import { TagService } from '../../../../shared/services';
import { VirtualMachine } from '../../../shared/vm.model';
import { TagCategory } from '../tag-category/vm-tag-category.component';
import { MdlDialogReference } from '../../../../dialog/dialog-module';


@Component({
  selector: 'cs-vm-tag-creation',
  templateUrl: 'vm-tag-creation-dialog.component.html',
  styleUrls: ['vm-tag-creation-dialog.component.scss']
})
export class VmTagCreationDialogComponent {
  public loading: boolean;

  public category: string;
  public key: string;
  public value: string;

  constructor(
    @Inject('categories') public categories: Array<TagCategory>,
    @Inject('virtualMachine') private vm: VirtualMachine,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

  public get categoryNames(): Array<string> {
    return this.categories.map(_ => _.name);
  }

  public onCreate(): void {
    this.loading = true;

    this.tagService.create({
      resourceIds: this.vm.id,
      resourceType: ResourceTypes.VM,
      'tags[0].key': this.key,
      'tags[0].value': this.value
    })
      .finally(() => this.dialog.hide())
      .subscribe();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
