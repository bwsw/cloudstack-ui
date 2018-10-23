import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { icmpV4Types, icmpV6Types } from '../../../shared/icmp/icmp-types';
import { IPVersion } from '../../sg.model';
import { CidrUtils } from '../../../shared/utils/cidr-utils';

export function icmpTypeValidator(cidr: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const type = +control.value;
    const types =
      CidrUtils.getCidrIpVersion(cidr.value) === IPVersion.ipv4 ? icmpV4Types : icmpV6Types;
    const index = types.findIndex(value => value.type === type);
    return index > -1 ? null : { icmpTypeValidator: { value: control.value } };
  };
}
