import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../services/utils/utils.service';

@Pipe({
  name: 'convertToMb',
})
export class ConvertToMbPipe implements PipeTransform {
  transform(bytes: number): any {
    const megabytes = Utils.convertBytesToMegabytes(bytes);
    return Math.round(megabytes);
  }
}
