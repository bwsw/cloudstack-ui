import { Pipe, PipeTransform } from '@angular/core';
import { VirtualMachine } from '../..';
import { HttpAccessService } from '../../services';

@Pipe({
  name: 'vmHttpAddress',
})
export class VmHttpAddressPipe implements PipeTransform {
  constructor(private httpAccess: HttpAccessService) {}

  transform(value: VirtualMachine): string {
    return this.httpAccess.getAddress(value);
  }
}
