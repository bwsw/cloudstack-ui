import { Pipe, PipeTransform } from '@angular/core';
import { AffinityGroupType, affinityGroupTypesMap } from '../models';

@Pipe({
  // tslint:disable-next-line
  name: 'affinityGroupType',
})
export class AffinityGroupTypePipe implements PipeTransform {
  public transform(value: AffinityGroupType): string {
    return affinityGroupTypesMap[value];
  }
}
