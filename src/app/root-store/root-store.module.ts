import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  routerReducer,
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers } from './meta-reducers';
import { environment } from '../../environments/environment';
import { CustomRouterStateSerializer } from './custom-router-state-serializer';

import { IdleEffects } from './idle-monitor';
import { NotificationsEffects } from './notifications';

import { ConfigStoreModule } from './config';
import { LayoutStoreModule } from './layout/layout-store.module';
import { UserTagsStoreModule } from './server-data/user-tags';
import { reducer as navMenuReducer } from '../core/nav-menu/redux/nav-menu.reducers';

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
