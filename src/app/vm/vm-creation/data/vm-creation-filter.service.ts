import { FormGroup } from '@angular/forms';
import { VmCreationData } from './vm-creation-data';


export class VmCreationFilterService {
  public filter(data: VmCreationData, form: FormGroup): VmCreationData {
    if (form.controls.zone.value.name === 'US1.HighIO') {
      data.serviceOfferings = [data.serviceOfferings[0]];
    }
    return data;
  }
}
