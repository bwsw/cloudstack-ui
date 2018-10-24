import { ServiceOffering } from '../../app/shared/models';

export const fixedComputeOffering: ServiceOffering = {
  id: '36de12ed-17f1-441f-903f-ab274832c318',
  name: 'Medium Instance',
  displaytext: 'Medium Instance',
  cpunumber: 1,
  cpuspeed: 1000,
  memory: 1024,
  created: '2018-08-31T01:50:04+0000',
  storagetype: 'shared',
  provisioningtype: 'thin',
  offerha: false,
  limitcpuuse: false,
  isvolatile: false,
  issystem: false,
  defaultuse: false,
  iscustomized: false,
};

export const customComputeOffering: ServiceOffering = {
  id: '9f55af11-99de-40b7-ab36-45c576296766',
  name: 'custom',
  displaytext: 'any',
  created: '2018-08-31T01:55:05+0000',
  storagetype: 'shared',
  provisioningtype: 'thin',
  offerha: false,
  limitcpuuse: false,
  isvolatile: false,
  domain: 'ROOT',
  issystem: false,
  defaultuse: false,
  iscustomized: true,
};
