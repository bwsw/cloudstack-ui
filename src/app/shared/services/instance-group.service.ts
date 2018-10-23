import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VirtualMachine } from '../../vm/shared/vm.model';
import { InstanceGroup } from '../models';
import { VmTagService } from './tags/vm-tag.service';

@Injectable()
export class InstanceGroupService {
  public groupsUpdates: Subject<void>;

  constructor(private vmTagService: VmTagService) {
    this.groupsUpdates = new Subject<void>();
  }

  public add(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    const newVm = { ...vm, instanceGroup: group };
    this.groupsUpdates.next();
    return this.vmTagService.setGroup(newVm, group).pipe(catchError(() => of(vm)));
  }
}
