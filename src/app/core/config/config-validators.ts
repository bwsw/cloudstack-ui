import * as curryRight from 'lodash/curryRight';
import * as overEvery from 'lodash/overEvery';
import * as isFinite from 'lodash/isFinite';
import * as isString from 'lodash/isString';
import * as lte from 'lodash/lte';
import * as gte from 'lodash/gte';

import { ConfigInterface } from './config-interface';

type Validators<T> = {
  readonly [P in keyof T]: (value: T[P]) => boolean;
}

const lessOrEqual = (value: number) => curryRight(lte)(value);
const greaterOrEqual = (value: number) =>  curryRight(gte)(value);
const validators = (...args) =>  overEvery(args);
const oneOf = <T>(validValues: T[]) => (value: T) => validValues.includes(value);

export const configValidators: Validators<Partial<ConfigInterface>> = {
  // General
  defaultDomain: validators(isString),
  sessionRefreshInterval: validators(isFinite, greaterOrEqual(0)),
  // User app settings
  defaultFirstDayOfWeek: validators(isFinite, greaterOrEqual(0), lessOrEqual(1)),
  defaultInterfaceLanguage: validators(isString, oneOf(['en', 'ru'])),
  defaultTimeFormat: validators(isString, oneOf(['hour12', 'hour24', 'auto'])),
  defaultThemeName: validators(isString, oneOf(['blue-red', 'indigo-pink'])),
  sessionTimeout: validators(isFinite, greaterOrEqual(0))
};
