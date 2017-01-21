import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VirtualMachine } from '../../vm/vm.model';

@Injectable()
export class VmUpdateService extends Subject<VirtualMachine> {}
