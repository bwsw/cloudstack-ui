import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { NavMenuService } from './nav-menu.service';
import { TestStore } from '../../../testutils/ngrx-test-store';
import { appNavRoutes } from './routes';

describe('NavMenuService', () => {
  let service: NavMenuService;
  let store: TestStore<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavMenuService,
        { provide: Store, useClass: TestStore }
      ]
    });
    service = TestBed.get(NavMenuService);
    store = TestBed.get(Store);
  });

  it('should return an array of routes', () => {
    service.getRoutes().subscribe(routes => {
      expect(routes).toBe(appNavRoutes);
    });
  });

  // it('should return the route regardless of the selected subroute', () => {
  //   const expectedRoute = appNavRoutes.find(route => route.id === 'virtual-machines');
  //   const validUrls = [
  //     '/templates?viewMode=Template',
  //     '/storage',
  //     '/instances',
  //     '/security-group?viewMode=templates&orphan=false',
  //     '/snapshots?date=2018-10-17'
  //   ];
  //   const invalidUrls = [
  //     '/accounts',
  //     '/events?date=2018-10-17'
  //   ];
  //   validUrls.forEach(url => {
  //     store.setState(url);
  //     service.getCurrentRoute().subscribe(route => {
  //       expect(route.id).toBe(expectedRoute.id)
  //     })
  //   });
  //
  //   invalidUrls.forEach(url => {
  //     store.setState(url);
  //     service.getCurrentRoute().subscribe(route => {
  //       expect(route.id).not.toBe(expectedRoute.id)
  //     })
  //   });
  // });

  it('should return subroutes of the virtual-machines route based on URL', () => {
    const url = '/templates/template/884adbea-ae67-4aba-86c0-c4f794c5343b/details?viewMode=Template';
    store.setState(url);
    const expectedRoute = appNavRoutes.find(route => route.id === 'virtual-machines');
    service.getSubroutes().subscribe(subroutes => {
      expect(subroutes).toBe(expectedRoute.subroutes);
    })
  });

  it('should return subroutes of the accounts route based on URL', () => {
    const url = '/events?date=2018-10-10&levels=WARN';
    store.setState(url);
    const expectedRoute = appNavRoutes.find(route => route.id === 'accounts');
    service.getSubroutes().subscribe(subroutes => {
      expect(subroutes).toBe(expectedRoute.subroutes);
    })
  });
});
