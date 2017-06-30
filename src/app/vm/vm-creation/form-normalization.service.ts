import { Injectable } from '@angular/core';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { Utils } from '../../shared/services/utils.service';
import { FormState, VmCreationField, VmCreationFields } from './vm-creation.component';


@Injectable()
export class FormNormalizationService {
  constructor(private serviceOfferingFilterService: ServiceOfferingFilterService) {}

  public normalize(formState: FormState, changedField?: VmCreationField): FormState {
    if (!changedField) { return this.getStateFromZone(formState); }

    switch (changedField) {
      case VmCreationFields.zone:
        return this.getStateFromZone(formState);

      case VmCreationFields.template:
        return this.getStateFromTemplate(formState);

      case VmCreationFields.diskOffering:
        return this.getStateFromDiskOffering(formState);

      default:
        return formState;
    }
  }

  public getStateFromZone(formState: FormState): FormState {
    let modifiedFormState = this.filterServiceOfferings(formState);
    modifiedFormState = this.filterTemplates(modifiedFormState);
    return modifiedFormState;
  }

  public filterServiceOfferings(formState: FormState): FormState {
    let modifiedFormState = Object.assign({}, formState);
    modifiedFormState.data.serviceOfferings = this.serviceOfferingFilterService
      .getAvailableByZoneAndResourcesSync(
        formState.data.serviceOfferings,
        formState.data.configurationData.offeringAvailability,
        formState.data.configurationData.customOfferingRestrictions,
        formState.data.resourceUsage,
        formState.state.zone
      );

    modifiedFormState.state.serviceOffering = modifiedFormState.data.serviceOfferings[0];
    return modifiedFormState;
  }

  public filterTemplates(formState: FormState): FormState {
    const templateFits = formState.state.template.sizeInGB < formState.data.rootDiskSizeLimit;
    return this.getStateFromTemplate(formState);
  }

  public getStateFromTemplate(formState: FormState): FormState {
    return this.filterDiskOfferings(formState);
  }

  public filterDiskOfferings(formState: FormState): FormState {
    let modifiedFormState = Object.assign({}, formState);
    if (formState.state.diskOfferingsAreAllowed) {
      modifiedFormState.data.diskOfferings = formState.data.diskOfferings.filter(diskOffering => {
        const selectedTemplateFits = diskOffering.diskSize > formState.state.template.sizeInGB;
        const diskOfferingFits = diskOffering.diskSize < formState.data.rootDiskSizeLimit;
        return selectedTemplateFits && diskOfferingFits;
      });
    }

    modifiedFormState.state.diskOffering = modifiedFormState.data.diskOfferings[0];
    return this.getStateFromDiskOffering(modifiedFormState);
  }

  public getStateFromDiskOffering(formState: FormState): FormState {
    return this.filterDiskSize(formState);
  }

  public filterDiskSize(formState: FormState): FormState {
    let modifiedFormState = Object.assign({}, formState);
    if (!formState.state.showRootDiskResize) { return formState; }

    const newSize = formState.state.template.size ? Utils.convertToGB(formState.state.template.size) : 1;
    modifiedFormState.state.rootDiskSize = newSize;
    modifiedFormState.state.rootDiskSizeMin = newSize;

    return modifiedFormState;
  }
}
