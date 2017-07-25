import { Injectable } from '@angular/core';
import {
  CustomServiceOfferingService
} from '../../../service-offering/custom-service-offering/custom-service-offering.service';
import { ServiceOfferingService, Utils } from '../../../shared/services';
import { VmCreationData } from '../data/vm-creation-data';
import { VmCreationState } from '../data/vm-creation-state';
import { VmCreationFormState } from '../vm-creation.component';
import cloneDeep = require('lodash/cloneDeep');


@Injectable()
export class VmCreationFormNormalizationService {
  constructor(
    private customServiceOfferingService: CustomServiceOfferingService,
    private serviceOfferingService: ServiceOfferingService
  ) {}

  public normalize(formState: VmCreationFormState): VmCreationFormState {
    return this.filterZones(this.clone(formState));
  }

  private clone(formState: VmCreationFormState): VmCreationFormState {
    const modifiedState = Object.assign({}, formState);
    const data = Object.assign({}, formState.data);
    const state = Object.assign({}, formState.state);
    modifiedState.data = data;
    modifiedState.state = state;
    Object.setPrototypeOf(modifiedState.data, VmCreationData.prototype);
    Object.setPrototypeOf(modifiedState.state, VmCreationState.prototype);
    return modifiedState;
  }

  private filterZones(formState: VmCreationFormState): VmCreationFormState {
    return this.getStateFromZone(formState);
  }

  private getStateFromZone(formState: VmCreationFormState): VmCreationFormState {
    const modifiedFormState = this.filterServiceOfferings(formState);
    return this.filterTemplates(modifiedFormState);
  }

  private filterServiceOfferings(formState: VmCreationFormState): VmCreationFormState {
    formState.data.serviceOfferings = this.serviceOfferingService
      .getAvailableByResourcesSync(
        formState.data.serviceOfferings,
        formState.data.configurationData.offeringAvailability,
        formState.data.configurationData.customOfferingRestrictions,
        formState.data.resourceUsage,
        formState.state.zone
      );

    formState = this.initializeCustomServiceOfferings(formState);

    const offeringStillAvailable = !!formState
      .data.serviceOfferings.find(offering => {
        return formState.state.serviceOffering.id === offering.id;
      });

    if (!offeringStillAvailable) {
      formState.state.serviceOffering = formState.data.getDefaultServiceOffering(formState.state.zone);
    }

    formState.state.serviceOffering = formState.data.serviceOfferings.find(_ => {
      return _.id === formState.state.serviceOffering.id;
    });

    return formState;
  }

  private initializeCustomServiceOfferings(formState: VmCreationFormState): VmCreationFormState {
    formState.data.serviceOfferings = formState.data.serviceOfferings.map(offering => {
      if (!offering.isCustomized) {
        return offering;
      }

      return this.customServiceOfferingService.getCustomOfferingWithSetParamsSync(
        offering,
        formState.data.getCustomOfferingParams(formState.state.zone),
        formState.data.configurationData.customOfferingRestrictions[formState.state.zone.id],
        formState.data.resourceUsage
      );
    })
      .filter(_ => _);

    return formState;
  }

  private filterTemplates(formState: VmCreationFormState): VmCreationFormState {
    const filteredTemplates = formState.data.templates.filter(template => {
      const templateFits = template.sizeInGB < formState.data.rootDiskSizeLimit;
      const templateInZone = template.zoneId === formState.state.zone.id;
      return template.isReady && templateFits && templateInZone;
    });

    const filteredIsos = formState.data.isos.filter(iso => {
      const isoFits = iso.sizeInGB < formState.data.rootDiskSizeLimit;
      const isoInZone = iso.zoneId === formState.state.zone.id;
      return iso.isReady && isoFits && isoInZone && iso.bootable;
    });

    formState.data.templates = filteredTemplates;
    formState.data.isos  = filteredIsos;

    const templateStillAvailable = !!formState
      .data.installationSources.find(template => {
        return formState.state.template.id === template.id;
      });

    if (!templateStillAvailable) {
      formState.state.template = formState.data.defaultTemplate;
    }
    return this.getStateFromTemplate(formState);
  }

  private getStateFromTemplate(formState: VmCreationFormState): VmCreationFormState {
    return this.filterDiskOfferings(formState);
  }

  private filterDiskOfferings(formState: VmCreationFormState): VmCreationFormState {
    if (formState.state.diskOfferingsAreAllowed) {
      formState.data.diskOfferings = formState.data.diskOfferings.filter(diskOffering => {
        const diskOfferingFits =
          diskOffering.diskSize < formState.data.rootDiskSizeLimit ||
          diskOffering.isCustomized;

        const selectedTemplateFits =
          diskOffering.diskSize > formState.state.template.sizeInGB ||
          diskOffering.isCustomized;

        return selectedTemplateFits && diskOfferingFits;
      });
    }

    const diskOfferingStillAvailable = !!formState
      .data.diskOfferings.find(offering => {
        return formState.state.diskOffering.id === offering.id;
      });

    if (!diskOfferingStillAvailable) {
      formState.state.diskOffering = formState.data.diskOfferings[0];
    }
    return this.getStateFromDiskOffering(formState);
  }

  private getStateFromDiskOffering(formState: VmCreationFormState): VmCreationFormState {
    return this.filterDiskSize(formState);
  }

  private filterDiskSize(formState: VmCreationFormState): VmCreationFormState {
    if (!formState.state.showRootDiskResize) {
      return formState;
    }

    const defaultDiskSize = 1;
    const size = Math.ceil(Utils.convertToGB(formState.state.template.size)) || defaultDiskSize;
    // e.g. 20000000000 B converts to 20 GB; 200000000 B -> 0.2 GB -> 1 GB; 0 B -> 1 GB
    formState.state.rootDiskSize = size;
    formState.state.rootDiskSizeMin = size;

    return formState;
  }
}
