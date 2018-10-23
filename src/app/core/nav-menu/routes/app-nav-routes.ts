import { Route } from '../models';
import { virtualMachinesSubroutes } from './virtual-machines-subroutes';
import { accountsSubroutes } from './accounts-subroutes';

export const appNavRoutes: Route[] = [
  {
    id: 'virtual-machines',
    text: 'NAVIGATION_SIDEBAR.VMS',
    path: '/instances',
    icon: 'mdi-cloud',
    subroutes: virtualMachinesSubroutes,
  },
  {
    id: 'accounts',
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    path: '/accounts',
    icon: 'mdi-account-supervisor',
    subroutes: accountsSubroutes,
  },
];
