import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pluralize',
})
export class PluralizePipe implements PipeTransform {
    transform(value: number, singular: string, plural: string): string {
        return value === 0 || value === 1 ? singular : plural;
    }
}
