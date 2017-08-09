import { VirtualMachine } from '../../../app/vm/shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { Color } from '../../../app/shared/models/color.model';
import { InstanceGroup } from '../../../app/shared/models/instance-group.model';


export class MockVmTagService {
  public getColor(vm: VirtualMachine): Observable<Color> {
    return Observable.of(new Color());
  }

  public getColorSync(vm: VirtualMachine): Color {
    return new Color();
  }

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    return Observable.of(vm);
  }

  public getDescription(vm: VirtualMachine): Observable<string> {
    return Observable.of('');
  }

  public setDescription(vm: VirtualMachine, description: string): Observable<VirtualMachine> {
    return Observable.of(vm);
  }

  public getGroup(vm: VirtualMachine): Observable<InstanceGroup> {
    return Observable.of(new InstanceGroup(''));
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return Observable.of(vm);
  }
}
