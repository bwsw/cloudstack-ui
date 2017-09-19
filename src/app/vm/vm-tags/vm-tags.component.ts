import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Tag } from '../../shared/models';
import { TagService } from '../../shared/services/tags/common/tag.service';
import { TagsComponent } from '../../tags/tags.component';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent extends TagsComponent<VirtualMachine> implements OnInit {
  @Input() public entity: VirtualMachine;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
    private vmService: VmService,
    private activatedRoute: ActivatedRoute
  ) {
    super(dialogService, tagService);
    this.getEntity().subscribe(_ => this.entity = _);
  }

  public ngOnInit(): void {
    this.getEntity().subscribe(_ => {
      this.entity = _;

      this.tags$.next(this.entity.tags);

      // todo: remove unsubscribe after migration to ngrx
      this.tags$
        .takeUntil(this.unsubscribe$)
        .subscribe(tags => {
          if (tags) {
            this.entity.tags = tags;
            this.vmService.vmUpdateObservable.next(this.entity);
          }
        });
    });
  }

  protected get entityTags(): Observable<Array<Tag>> {
    return this.vmService.get(this.entity.id).map(_ => _.tags);
  }

  private getEntity(): Observable<VirtualMachine> {
    const params = this.activatedRoute.snapshot.parent.params;
    return this.vmService.getWithDetails(params.id);
  }
}
