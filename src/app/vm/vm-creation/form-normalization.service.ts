import { Injectable } from '@angular/core';
import { ServiceOfferingFilterService, Utils } from '../../shared/services';
import { VmCreationField, VmCreationFields } from './vm-creation-fields';
import { VmCreationFormState } from './vm-creation.component';
import cloneDeep = require('lodash/cloneDeep');


@Injectable()
export class VmCreationFormNormalizationService {
  constructor(private serviceOfferingFilterService: ServiceOfferingFilterService) {}

  public normalize(formState: VmCreationFormState, changedField?: VmCreationField): VmCreationFormState {
    if (!changedField) { return this.filterZones(formState); }

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

  private filterZones(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = this.cloneState(formState);
    modifiedFormState.state.zone = formState.data.zones[0];
    return modifiedFormState;
  }

  private getStateFromZone(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = this.filterServiceOfferings(formState);

    return this.filterTemplates(modifiedFormState);
  }

  private filterServiceOfferings(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = this.cloneState(formState);

    modifiedFormState.data.serviceOfferings = this.serviceOfferingFilterService
      .getAvailableByResourcesSync(
        formState.data.serviceOfferings,
        formState.data.configurationData.offeringAvailability,
        formState.data.configurationData.customOfferingRestrictions,
        formState.data.resourceUsage,
        formState.state.zone
      );

    modifiedFormState.state.serviceOffering = modifiedFormState.data.serviceOfferings[0];
    return modifiedFormState;
  }

  private filterTemplates(formState: VmCreationFormState): VmCreationFormState {
    const modifiedState = this.cloneState(formState);

    const filteredTemplates = formState.data.templates.filter(template => {
      return template.sizeInGB < formState.data.rootDiskSizeLimit;
    });

    const filteredIsos = formState.data.isos.filter(iso => {
      return iso.sizeInGB < formState.data.rootDiskSizeLimit;
    });

    modifiedState.data.templates = filteredTemplates;
    modifiedState.data.isos  = filteredIsos;
    modifiedState.state.template = modifiedState.data.defaultTemplate;
    return this.getStateFromTemplate(modifiedState);
  }

  private getStateFromTemplate(formState: VmCreationFormState): VmCreationFormState {
    return this.filterDiskOfferings(formState);
  }

  private filterDiskOfferings(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = this.cloneState(formState);

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

  private getStateFromDiskOffering(formState: VmCreationFormState): VmCreationFormState {
    return this.filterDiskSize(formState);
  }

  private filterDiskSize(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = Object.assign({}, formState);

    if (!formState.state.showRootDiskResize) { return formState; }

    const newSize = formState.state.template.size ? Utils.convertToGB(formState.state.template.size) : 1;
    modifiedFormState.state.rootDiskSize = newSize;
    modifiedFormState.state.rootDiskSizeMin = newSize;

    return modifiedFormState;
  }

  private cloneState(formState: VmCreationFormState): VmCreationFormState {
    return cloneDeep(formState);
  }
}
