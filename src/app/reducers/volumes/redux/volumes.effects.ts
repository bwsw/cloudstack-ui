import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as volumeActions from './volumes.actions';
import { Action } from '@ngrx/store';
import { VolumeService } from '../../../shared/services/volume.service';
import { Volume } from '../../../shared/models/volume.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { VolumeTagService } from '../../../shared/services/tags/volume-tag.service';
import { Utils } from '../../../shared/services/utils/utils.service';

@Injectable()
export class VolumesEffects {

  @Effect()
  loadVolumes$: Observable<Action> = this.actions$
    .ofType(volumeActions.LOAD_VOLUMES_REQUEST)
    .switchMap((action: volumeActions.LoadVolumesRequest) => {
      return this.volumeService.getList(action.payload)
        .map((volumes: Volume[]) => {
          return new volumeActions.LoadVolumesResponse(volumes);
        })
        .catch(() => Observable.of(new volumeActions.LoadVolumesResponse([])));
    });

  @Effect()
  createVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.CREATE_VOLUME)
    .switchMap((action: volumeActions.CreateVolume) => {
      return this.volumeService.create(action.payload)
        .map(createdVolume => new volumeActions.CreateSuccess(createdVolume))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.CreateError(error));
        });
    });

  @Effect()
  changeDescription$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_CHANGE_DESCRIPTION)
    .switchMap((action: volumeActions.ChangeDescription) => {
      return this.volumeTagService
        .setDescription(action.payload.volume, action.payload.description)
        .map(volume => new volumeActions.UpdateVolume(new Volume(volume)))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  attachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.ATTACH_VOLUME)
    .switchMap((action: volumeActions.AttachVolume) => {
      const params = {
        id: action.payload.volumeId,
        virtualMachineId: action.payload.virtualMachineId
      };
      return this.volumeService
        .attach(params)
        .map(volume => new volumeActions.UpdateVolume(new Volume(volume)))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  detachVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DETACH_VOLUME)
    .switchMap((action: volumeActions.DetachVolume) => {
      return this.volumeService
        .detach(action.payload)
        .map(volume => {
          //const updatedVolume = Object.assign({}, volume, { virtualMachineId: null });
          return new volumeActions.UpdateVolume(new Volume(volume));
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  resizeVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.RESIZE_VOLUME)
    .switchMap((action: volumeActions.ResizeVolume) => {
      return this.volumeService
        .resize(action.payload)
        .map(volume => {
          return new volumeActions.UpdateVolume(new Volume(volume));
        })
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect()
  deleteVolume$: Observable<Action> = this.actions$
    .ofType(volumeActions.DELETE_VOLUME)
    .switchMap((action: volumeActions.DeleteVolume) => {
      return this.volumeService.remove(action.payload)
        .map(() => new volumeActions.DeleteSuccess(action.payload))
        .catch((error: Error) => {
          return Observable.of(new volumeActions.VolumeUpdateError(error));
        });
    });

  @Effect({ dispatch: false })
  deleteVolumeSuccessNavigate$: Observable<Volume> = this.actions$
    .ofType(volumeActions.VOLUME_DELETE_SUCCESS)
    .map((action: volumeActions.DeleteSuccess) => action.payload)
    .filter((volume: Volume) => {
      return this.router.isActive(`/storage/${volume.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./storage'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect({ dispatch: false })
  createError$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_CREATE_ERROR)
    .do((action: volumeActions.CreateError) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(volumeActions.VOLUME_UPDATE_ERROR)
    .do((action: volumeActions.VolumeUpdateError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private dialogService: DialogService,
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService,
    private router: Router
  ) {
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
