import {
  Pipe,
  PipeTransform
} from '@angular/core';
import {
  Volume,
  VolumeType
} from '../models/volume.model';

@Pipe({name: 'volumesSort'})
export class VolumeSortPipe implements PipeTransform {

  transform(volumes: Volume[], args: any): Volume[]{
    return volumes.sort((a: Volume, b) => {
      const aIsRoot = a.type === VolumeType.ROOT;
      const bIsRoot = b.type === VolumeType.ROOT;
      if (aIsRoot && !bIsRoot) {
        return -1;
      }
      if (!aIsRoot && bIsRoot) {
        return 1;
      }
      return 0;
    });
  }
}
