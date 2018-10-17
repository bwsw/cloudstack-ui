import { Pipe, PipeTransform } from '@angular/core';
import { AffinityGroupType, AffinityGroupTypesMap } from '../models';


@Pipe({
  name: 'affinityGroupType'
})
export class AffinityGroupTypePipe implements PipeTransform {
  public transform(value: AffinityGroupType): string {
    return AffinityGroupTypesMap[value];
  }
}
