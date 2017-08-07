import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { TagService } from './tags/tag.service';
import { InstanceGroup } from '../models';

@Injectable()
export class InstanceGroupService {
  public groupsUpdates: Subject<void>;

  constructor(private tagService: TagService) {
    this.groupsUpdates = new Subject<void>();
  }

  public add(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    vm.instanceGroup = group;
    this.groupsUpdates.next();
    return this.tagService.update(vm, 'UserVm', 'cs.vm.group', group && group.name)
      .catch(() => Observable.of(vm));
  }
}
