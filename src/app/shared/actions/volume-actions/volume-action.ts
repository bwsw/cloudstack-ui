import { Observable } from 'rxjs/Observable';
import { Volume } from '../../models/volume.model';


export interface VolumeAction {
  name: string;
  command: string;
  icon?: string;

  activate: (volume: Volume) => Observable<any>;
  hidden: (volume: Volume) => boolean;
}
