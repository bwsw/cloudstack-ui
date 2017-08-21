import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { Tag } from '../../shared/models';
import { TagService } from '../../shared/services/tag.service';
import { TagsComponent } from '../../tags/tags.component';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent extends TagsComponent<VirtualMachine> implements OnInit {
  @Input() public entity: VirtualMachine;

  constructor(
    protected dialogsService: DialogsService,
    protected tagService: TagService,
    private vmService: VmService
  ) {
    super(dialogsService, tagService);
  }

  public ngOnInit(): void {
    // todo: remove unsubscribe after migration to ngrx
    super.ngOnInit();
    this.tags$
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.vmService.vmUpdateObservable.next(this.entity));
  }

  protected get entityTags(): Observable<Array<Tag>> {
    return this.vmService.get(this.entity.id).map(_ => _.tags);
  }
}
