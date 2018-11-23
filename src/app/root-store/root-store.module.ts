import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';
import { reducer as navMenuReducer } from '../core/nav-menu/redux/nav-menu.reducers';
import { ConfigStoreModule } from './config';
import { CustomRouterStateSerializer } from './custom-router-state-serializer';
import { IdleEffects } from './idle-monitor';
import { LayoutStoreModule } from './layout/layout-store.module';
import { metaReducers } from './meta-reducers';
import { NotificationsEffects } from './notifications';
import { UserTagsStoreModule } from './server-data/user-tags';
import { VmSnapshotsStoreModule } from './server-data/vm-snapshots';

const reducers = {
  router: routerReducer,
  navMenu: navMenuReducer,
};

const EFFECTS = [IdleEffects, NotificationsEffects];

@NgModule({
  imports: [
    ConfigStoreModule,
    LayoutStoreModule,
    UserTagsStoreModule,
    VmSnapshotsStoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(EFFECTS),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 30 }),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }],
})
export class RootStoreModule {}
