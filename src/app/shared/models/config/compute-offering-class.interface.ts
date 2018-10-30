export interface ComputeOfferingClass {
  id: string;
  name: object;
  description: object;
  computeOfferings: string[];
}

export const defaultComputeOfferingClass = {
  id: 'common',
  name: {},
  description: {},
  computeOfferings: [],
};
