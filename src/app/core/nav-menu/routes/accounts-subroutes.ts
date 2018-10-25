import { Subroute } from '../models';

export const accountsSubroutes: Subroute[] = [
  {
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    path: '/accounts',
    icon: 'mdi-account-supervisor',
    routeId: 'accounts',
  },
  {
    text: 'NAVIGATION_SIDEBAR.ACTIVITY_LOG',
    path: '/events',
    icon: 'mdi-calendar-text',
    routeId: 'accounts',
  },
  {
    text: 'NAVIGATION_SIDEBAR.SETTINGS',
    path: '/settings',
    icon: 'mdi-settings',
    routeId: 'accounts',
  },
];
