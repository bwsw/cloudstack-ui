import { Injectable } from '@angular/core';
import { BaseField } from './fields/base-field';
import { TextField } from './fields/text-field';
import { SelectField } from './fields/select-field';
import { AutocompleteField } from './fields/autocomplete-field';
import { VmCreationData } from '../data/vm-creation-data';
import { FormGroup } from '@angular/forms';


@Injectable()
export class FieldService {
  public getFields(data: VmCreationData, form?: FormGroup): Array<BaseField<any>> {
    const state = data.getInitialState();
    let fields: Array<BaseField<any>> = [
      new TextField({
        key: 'name',
        label: 'Name',
        value: state.displayName,
        required: true,
        order: 1
      }),
      new SelectField({
        key: 'zone',
        label: 'Zone',
        value: state.zone,
        options: form && data.zones.map(zone => ({ key: zone, value: zone.name })),
        order: 2
      }),
      new SelectField({
        key: 'serviceOffering',
        label: 'Service offering',
        value: state.serviceOffering,
        options: form && data.serviceOfferings.map(offering => ({ key: offering, value: offering.name })),
        order: 3
      }),
      new SelectField({
        key: 'diskOffering',
        label: 'Disk offering',
        value: state.diskOffering,
        options: data.diskOfferings.map(offering => ({ key: offering, value: offering.name })),
        order: 5
      }),
      new AutocompleteField({
        key: 'group',
        label: 'Group',
        options: data.instanceGroups.map(group => group.name),
        value: '',
        order: 6
      })
    ];

    fields = fields.map(field => {
      if (form && form.controls && form.controls[field.key] && form.controls[field.key].value) {
        field.value = form.controls[field.key].value;
      }
      return field;
    });
    return fields.sort((a, b) => a.order - b.order);
  }
}
