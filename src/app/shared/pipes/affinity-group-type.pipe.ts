import { Pipe, PipeTransform } from '@angular/core';
import { AffinityGroupType, affinityGroupTypesMap } from '../models';

@Pipe({
  name: 'csAffinityGroupType',
})
export class AffinityGroupTypePipe implements PipeTransform {
  public transform(value: AffinityGroupType): string {
    return affinityGroupTypesMap[value];
  }
}
