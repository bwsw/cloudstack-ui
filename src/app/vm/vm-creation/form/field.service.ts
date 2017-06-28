import { Injectable } from '@angular/core';
import { BaseField } from './fields/base-field';
import { TextField } from './fields/text-field';
import { SelectField } from './fields/select-field';
import { AutocompleteField } from './fields/autocomplete-field';


@Injectable()
export class FieldService {
  public getFields(): Array<BaseField<any>> {
    let fields: Array<BaseField<any>> = [
      new TextField({
        key: 'name',
        label: 'Name',
        value: 'vm-1',
        required: true,
        order: 1
      }),
      new SelectField({
        key: 'zone',
        label: 'Zone',
        value: 'zone1',
        options: [
          { key: 'zone1', value: 'ZONE 1' },
          { key: 'zone2', value: 'ZONE 2' }
        ],
        order: 2
      }),
      new SelectField({
        key: 'serviceOffering',
        label: 'Service offering',
        value: 'offering1',
        options: [
          { key: 'offering1', value: 'OFFERING 1' },
          { key: 'offering2', value: 'OFFERING 2' }
        ],
        order: 3
      }),
      new SelectField({
        key: 'diskOffering',
        label: 'Disk offering',
        value: 'offering1',
        options: [
          { key: 'offering1', value: 'OFFERING 1' },
          { key: 'offering2', value: 'OFFERING 2' }
        ],
        order: 5
      }),
      new AutocompleteField({
        key: 'group',
        label: 'Group',
        options: ['GROUP 1', 'GROUP 2'],
        order: 6
      })
    ];

    return fields.sort((a, b) => a.order - b.order);
  }
}
