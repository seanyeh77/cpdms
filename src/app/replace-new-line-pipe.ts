import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNewLinePipe'
})
export class ReplaceNewLinePipe implements PipeTransform {
  transform(value: string): string {
    return value.replaceAll(/\\r?\\n/g, ' ');
  }
}
