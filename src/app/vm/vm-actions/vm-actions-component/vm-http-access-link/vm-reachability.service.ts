import { Observable } from 'rxjs';
import { VirtualMachine } from '../../..';
import { VmReachability } from './vm-reachability.enum';

export abstract class VmReachabilityService {
  abstract getReachibility(vm: VirtualMachine): Observable<VmReachability>;
}
