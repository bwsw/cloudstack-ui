import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { TagService } from './tag.service';
import { InstanceGroup } from '../models/instance-group.model';

@Injectable()
export class InstanceGroupService {
  public groupsUpdates: Subject<void>;

  constructor(private tagService: TagService) {
    this.groupsUpdates = new Subject<void>();
  }

  public add(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    vm.instanceGroup = group;
    this.groupsUpdates.next();
    return this.tagService.update(vm, 'UserVm', 'group', group.name);
  }
}
