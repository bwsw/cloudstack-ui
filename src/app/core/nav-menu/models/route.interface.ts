import { Subroute } from './subroute.interface';

export interface Route {
  id: string;
  text: string;
  path: string;
  icon: string;
  subroutes: Subroute[];
}
