import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'csBasepath',
})
export class BasePathPipe implements PipeTransform {
  public transform(value: string): string {
    return value.split('/').pop();
  }
}
