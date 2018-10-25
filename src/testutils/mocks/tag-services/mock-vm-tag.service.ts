import { Observable, of } from 'rxjs';

import { VirtualMachine } from '../../../app/vm/shared/vm.model';
import { Color } from '../../../app/shared/models/color.model';
import { InstanceGroup } from '../../../app/shared/models/instance-group.model';

export class MockVmTagService {
  public getColor(vm: VirtualMachine): Observable<Color> {
    return of(new Color());
  }

  public getColorSync(vm: VirtualMachine): Color {
    return new Color();
  }

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    return of(vm);
  }

  public getDescription(vm: VirtualMachine): Observable<string> {
    return of('');
  }

  public setDescription(vm: VirtualMachine, description: string): Observable<VirtualMachine> {
    return of(vm);
  }

  public getGroup(vm: VirtualMachine): Observable<InstanceGroup> {
    return of(new InstanceGroup(''));
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return of(vm);
  }
}
