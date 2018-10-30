import { AbstractControl, ValidationErrors } from '@angular/forms';

import { icmpV4Types, icmpV6Types } from '../../../shared/icmp/icmp-types';
import { IPVersion } from '../../sg.model';
import { CidrUtils } from '../../../shared/utils/cidr-utils';

export function icmpCodeValidator(cidr: AbstractControl, icmpType: AbstractControl) {
  return (control: AbstractControl): ValidationErrors | null => {
    const code = +control.value;
    const type = +icmpType.value;
    const types =
      CidrUtils.getCidrIpVersion(cidr.value) === IPVersion.ipv4 ? icmpV4Types : icmpV6Types;
    const typeObject = types.find(value => value.type === type);
    if (!typeObject) {
      return null;
    }
    const index = typeObject.codes.findIndex(value => value === code);
    return index > -1 ? null : { icmpCodeValidator: { value: control.value } };
  };
}
