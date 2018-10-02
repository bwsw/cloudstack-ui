import { getComputeOfferingViewModel } from './compute-offering-view-model.selector';
import { customComputeOffering, fixedComputeOffering } from '../../../../testutils/data';
import { account } from '../../../../testutils/data/accounts';
import { nonCustomizableProperties } from '../../../core/config/default-configuration';
import { ComputeOfferingViewModel } from '../../view-models';
import { Account } from '../../../shared/models';
import { CustomComputeOfferingParameters } from '../../../shared/models/config/custom-compute-offering-parameters.interface';

fdescribe('ComputeOfferingViewModelSelector', () => {
  describe('isAvailableByResources', () => {
    it ('should be true in fixed compute offering params which satisfy memory and cpu resources', () => {
      const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
        [fixedComputeOffering],
        account,
        [],
        nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
        nonCustomizableProperties.customComputeOfferingHardwareValues,
        []
      );
      expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
    });

    describe('should be false in fixed compute offering params which unsatisfied', () => {
      it('memory resources', () => {
        const limitedAccount: Account = { ...account, memoryavailable: String(fixedComputeOffering.memory - 10) };
        const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
          [fixedComputeOffering],
          limitedAccount,
          [],
          nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
          nonCustomizableProperties.customComputeOfferingHardwareValues,
          []
        );
        expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
      });

      it('cpu resources', () => {
        const limitedAccount: Account = { ...account, cpuavailable: String(fixedComputeOffering.cpunumber - 1) };
        const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
          [fixedComputeOffering],
          limitedAccount,
          [],
          nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
          nonCustomizableProperties.customComputeOfferingHardwareValues,
          []
        );
        expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
      });
    });

    it('should be true in custom compute offering params which satisfy memory and cpu resources', () => {
      const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
        [customComputeOffering],
        account,
        [],
        nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
        nonCustomizableProperties.customComputeOfferingHardwareValues,
        []
      );
      expect(computeOfferingViewModel.isAvailableByResources).toEqual(true);
    });

    describe('should be false in custom compute offering params which unsatisfied', () => {
      it('memory resources', () => {
        const memoryavailable = String(nonCustomizableProperties.customComputeOfferingHardwareValues.memory - 10);
        const limitedAccount: Account = { ...account, memoryavailable };
        const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
          [customComputeOffering],
          limitedAccount,
          [],
          nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
          nonCustomizableProperties.customComputeOfferingHardwareValues,
          []
        );
        expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
      });

      it('cpu resources', () => {
        const cpuavailable = String(nonCustomizableProperties.customComputeOfferingHardwareValues.cpunumber - 1);
        const limitedAccount: Account = { ...account, cpuavailable };
        const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
          [customComputeOffering],
          limitedAccount,
          [],
          nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
          nonCustomizableProperties.customComputeOfferingHardwareValues,
          []
        );
        expect(computeOfferingViewModel.isAvailableByResources).toEqual(false);
      });
    });
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
        memory: { min: 512, max: 8192, value: 4000 }
      }
    ];

    const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
      [customComputeOffering],
      limitedAccount,
      customComputeOfferingParameters,
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      []
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
        memory: { min: 512, max: 4000, value: 4000 }
      }
    ];

    const [computeOfferingViewModel]: ComputeOfferingViewModel[] = getComputeOfferingViewModel.projector(
      [customComputeOffering],
      limitedAccount,
      customComputeOfferingParameters,
      nonCustomizableProperties.defaultCustomComputeOfferingRestrictions,
      nonCustomizableProperties.customComputeOfferingHardwareValues,
      []
    );
    expect(computeOfferingViewModel.cpunumber).toBe(5);
    expect(computeOfferingViewModel.memory).toBe(4000);
    expect(computeOfferingViewModel.customOfferingRestrictions.cpunumber.max).toBe(5);
    expect(computeOfferingViewModel.customOfferingRestrictions.memory.max).toBe(4000);
  });


  // it('isAvailableByResources in custom compute offering params which satisfy resource should be true', () => {
  //   const customComputeOfferingParameters = [
  //     {
  //       'offeringId': '36de12ed-17f1-441f-903f-ab274832c318',
  //       'cpunumber': {
  //         'min': 2,
  //         'max': 8,
  //         'value': 4
  //       },
  //       'cpuspeed': {
  //         'min': 1000,
  //         'max': 3000,
  //         'value': 1500
  //       },
  //       'memory': {
  //         'min': 512,
  //         'max': 8192,
  //         'value': 512
  //       }
  //     }
  //   ];
  //
  //   const computeOfferingViewModel = { ...fixedComputeOffering, isAvailableByResources: true };
  //   getComputeOfferingViewModel.projector(
  //     [fixedComputeOffering], account, customComputeOfferingParameters, null, null, []
  //   ).toEqual([computeOfferingViewModel])
  // })
});
