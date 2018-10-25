import {
  account,
  customComputeOffering,
  fixedComputeOffering,
  vm,
} from '../../../../testutils/data';
import { nonCustomizableProperties } from '../../../core/config/default-configuration';
import { ComputeOfferingViewModel } from '../../view-models';
import { Account } from '../../../shared/models';
import { CustomComputeOfferingParameters } from '../../../shared/models/config/index';
import {
  getComputeOfferingForVmCreation,
  getComputeOfferingForVmEditing,
} from './compute-offering-view-model.selector';

describe('GetComputeOfferingForVmCreationSelector', () => {
  it('isAvailableByResources should be true in fixed compute offering params which satisfy memory and cpu resources', () => {
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      account,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
  });

  it('should be false in fixed compute offering params which unsatisfied memory resources', () => {
    const limitedAccount: Account = {
      ...account,
      memoryavailable: String(fixedComputeOffering.memory - 10),
    };
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
  });

  it('should be false in fixed compute offering params which unsatisfied cpu resources', () => {
    const limitedAccount: Account = {
      ...account,
      cpuavailable: String(fixedComputeOffering.cpunumber - 1),
    };
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
  });

  it('should be true in custom compute offering params which satisfy memory and cpu resources', () => {
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      account,
      [customComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
  });

  it('should be false in custom compute offering params which unsatisfied memory resources', () => {
    const memoryavailable = String(
      nonCustomizableProperties.customComputeOfferingHardwareValues.memory - 10,
    );
    const limitedAccount: Account = { ...account, memoryavailable };
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [customComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
  });

  it('should be false in custom compute offering params which unsatisfied cpu resources', () => {
    const cpuavailable = String(
      nonCustomizableProperties.customComputeOfferingHardwareValues.cpunumber - 1,
    );
    const limitedAccount: Account = { ...account, cpuavailable };
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [customComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
  });

  it('must set values within restrictions and resources for custom compute offering', () => {
    /**
     *         Min    Value    Max    Resource
     * cpu     2       7       8        5        => Value = MaxRestrictions = 5
     * memory  512     4000    8192    2000      => Value = MaxRestrictions = 2000
     */
    const cpuavailable = '5';
    const memoryavailable = '2000';
    const limitedAccount: Account = { ...account, memoryavailable, cpuavailable };

    const customComputeOfferingParameters: CustomComputeOfferingParameters[] = [
      {
        offeringId: customComputeOffering.id,
        cpunumber: { min: 2, max: 8, value: 7 },
        cpuspeed: { min: 1000, max: 3000, value: 1500 },
        memory: { min: 512, max: 8192, value: 4000 },
      },
    ];

    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [customComputeOffering],
      customComputeOfferingParameters,
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.cpunumber).toBe(5);
    expect(computeOfferingViewModel.memory).toBe(2000);
    expect(computeOfferingViewModel.customOfferingRestrictions.cpunumber.max).toBe(5);
    expect(computeOfferingViewModel.customOfferingRestrictions.memory.max).toBe(2000);
  });

  it('must set default values within restrictions and resources for custom compute offering', () => {
    /**
     *         Min    Value    Max    Resource
     * cpu     2       7       8        5        => Value = MaxRestrictions = 5
     * memory  512     4000    4000    8000     => Value = MaxRestrictions = 4000
     */
    const cpuavailable = '5';
    const memoryavailable = '8000';
    const limitedAccount: Account = { ...account, memoryavailable, cpuavailable };

    const customComputeOfferingParameters: CustomComputeOfferingParameters[] = [
      {
        offeringId: customComputeOffering.id,
        cpunumber: { min: 2, max: 8, value: 7 },
        cpuspeed: { min: 1000, max: 3000, value: 1500 },
        memory: { min: 512, max: 4000, value: 4000 },
      },
    ];

    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmCreation.projector(
      limitedAccount,
      [customComputeOffering],
      customComputeOfferingParameters,
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
    );
    expect(computeOfferingViewModel.cpunumber).toBe(5);
    expect(computeOfferingViewModel.memory).toBe(4000);
    expect(computeOfferingViewModel.customOfferingRestrictions.cpunumber.max).toBe(5);
    expect(computeOfferingViewModel.customOfferingRestrictions.memory.max).toBe(4000);
  });
});

describe('GetComputeOfferingForVmEditingSelector', () => {
  it('isAvailableByResources should be true in fixed compute offering params which satisfy memory and cpu resources', () => {
    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmEditing.projector(
      account,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
      vm,
    );
    expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
  });

  it('isAvailableByResources should be true, cause satisfy resources plus used resources in editing vm', () => {
    const cpuavailable = '0';
    const memoryavailable = '512';
    const limitedAccount: Account = { ...account, memoryavailable, cpuavailable };
    const updatedVm = { ...vm, memory: '512', cpuNumber: 1 };

    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmEditing.projector(
      limitedAccount,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
      updatedVm,
    );

    expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
  });

  it('isAvailableByResources should be false, cause unsatisfy resources plus used resources in editing vm', () => {
    const cpuavailable = '0';
    const memoryavailable = '0';
    const limitedAccount: Account = { ...account, memoryavailable, cpuavailable };
    const updatedVm = { ...vm, memory: '512', cpuNumber: 1 };

    const [
      computeOfferingViewModel,
    ]: ComputeOfferingViewModel[] = getComputeOfferingForVmEditing.projector(
      limitedAccount,
      [fixedComputeOffering],
      [],
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      [],
      updatedVm,
    );

    expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
  });
});
