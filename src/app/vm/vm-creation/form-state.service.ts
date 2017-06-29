import { Injectable } from '@angular/core';
import { VmCreationState } from './data/vm-creation-state';
import { VmCreationData } from './data/vm-creation-data';
import { VmCreationField, VmCreationFields } from './vm-creation.component';


class FormState {
  public validity: VmCreationValidity;

  constructor(
    private state: VmCreationState,
    private data: VmCreationData,
  ) {
    this.validity = new VmCreationValidity();
  }
}

@Injectable()
export class FormStateService {
  public normalize(formState: FormState, changedField?: VmCreationField): FormState {
    if (!changedField) { return this.stateFromZone(formState); }

    switch (changedField) {
      case VmCreationFields.zone:
        return this.stateFromZone(formState);

      case VmCreationFields.serviceOffering:
        return this.stateFromServiceOffering(formState);

      case VmCreationFields.template:
        return this.stateFromTemplate(formState);

      case VmCreationFields.diskOffering:
        return this.stateFromDiskOffering(formState);

      case VmCreationFields.diskSize:
        return this.stateFromDiskSize(formState);

      default:
        return formState;
    }
  }

  public stateFromZone(formState: FormState): FormState {
    formState = this.stateFromServiceOffering(formState);
    formState = this.stateFromTemplate(formState);
    return formState;
  }

  public stateFromServiceOffering(formState: FormState): FormState {
    return formState;
  }

  public stateFromTemplate(formState: FormState): FormState {
    return formState;
  }

  public stateFromDiskOffering(formState: FormState): FormState {
    return formState;
  }

  public stateFromDiskSize(formState: FormState): FormState {
    return formState;
  }
}
