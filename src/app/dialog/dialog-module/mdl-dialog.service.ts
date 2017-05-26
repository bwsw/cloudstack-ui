import { MdlDialogOutletService } from '@angular-mdl/core';
import {
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injectable,
  InjectionToken,
  Provider,
  ReflectiveInjector,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { InternalMdlDialogReference } from './internal-dialog-reference';
import {
  IMdlCustomDialogConfiguration,
  IMdlDialogConfiguration,
  IMdlSimpleDialogConfiguration
} from './mdl-dialog-configuration';
import { MdlDialogHostComponent } from './mdl-dialog-host.component';

import { MdlSimpleDialogComponent } from './mdl-simple-dialog.component';


export const MDL_CONFIGUARTION = new InjectionToken<IMdlDialogConfiguration>('MDL_CONFIGUARTION');
export const MIN_DIALOG_Z_INDEX = 100000;

export class MdlDialogReference {
  constructor(private internaleRef: InternalMdlDialogReference) {
    internaleRef.dialogRef = this;
  }

  public hide(data?: any): void {
    this.internaleRef.hide(data);
  }

  public onHide(): Observable<any> {
    return this.internaleRef.onHide();
  }

  public onVisible(): Observable<void> {
    return this.internaleRef.onVisible();
  }
}

@Injectable()
export class MdlDialogService {
  public onDialogsOpenChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  private openDialogs: Array<InternalMdlDialogReference> = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private mdlDialogOutletService: MdlDialogOutletService
  ) {

    this.mdlDialogOutletService.backdropClickEmitter.subscribe( () => {
      this.onBackdropClick();
    });
  }

  public alert(alertMessage: string, okText = 'Ok', title?: string): Observable<void> {
    const result: Subject<any> = new Subject();

    this.showDialog({
      title: title,
      message: alertMessage,
      actions: [
        { handler: () => {
          result.next(null);
          result.complete();
        }, text: okText}
      ],
      isModal: true
    });

    return result;
  }

  public confirm(
    question: string,
    declineText = 'Cancel',
    confirmText = 'Ok',
    title?: string): Observable<void> {

    const result: Subject<any> = new Subject();

    this.showDialog({
      title: title,
      message: question,
      actions: [
        {
          handler: () => {
            result.next(null);
            result.complete();
          }, text: confirmText
        },
        {
          handler: () => {
            result.error(null);

          }, text: declineText, isClosingAction: true
        }
      ],
      isModal: true
    });

    return result.asObservable();
  }

  public showDialog(config: IMdlSimpleDialogConfiguration): Observable<MdlDialogReference> {
    if (config.actions.length === 0 ) {
      throw new Error('a dialog must have at least one action');
    }

    const internalDialogRef = new InternalMdlDialogReference(config);

    const providers = [
      { provide: MdlDialogReference, useValue: new MdlDialogReference(internalDialogRef) },
      { provide: MDL_CONFIGUARTION, useValue: config}
    ];

    const hostComponentRef = this.createHostDialog(internalDialogRef, config);

    this.createComponentInstance(
      hostComponentRef.instance.dialogTarget,
      providers,
      MdlSimpleDialogComponent
    );

    return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
  }

  public showCustomDialog(config: IMdlCustomDialogConfiguration): Observable<MdlDialogReference> {
    const internalDialogRef = new InternalMdlDialogReference(config);

    const providers: Array<Provider> = [
      { provide: MdlDialogReference, useValue: new MdlDialogReference(internalDialogRef) }
    ];

    if (config.providers) {
      providers.push(...config.providers);
    }

    const hostComponentRef = this.createHostDialog(internalDialogRef, config);

    this.createComponentInstance(hostComponentRef.instance.dialogTarget, providers, config.component);

    return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
  }

  public showDialogTemplate(
    template: TemplateRef<any>,
    config: IMdlDialogConfiguration
  ): Observable<MdlDialogReference> {
    const internalDialogRef = new InternalMdlDialogReference(config);

    const hostComponentRef = this.createHostDialog(internalDialogRef, config);

    hostComponentRef.instance.dialogTarget.createEmbeddedView(template);

    return this.showHostDialog(internalDialogRef.dialogRef, hostComponentRef);
  }

  public hideAllDialogs(): void {
    this.openDialogs.forEach(dialog => dialog.hide());
  }

  private showHostDialog(
    dialogRef: MdlDialogReference,
    hostComponentRef: ComponentRef<MdlDialogHostComponent>
  ): Observable<any> {
    const result: Subject<any> = new Subject();

    setTimeout(() => {
      result.next(dialogRef);
      result.complete();
      hostComponentRef.instance.show();
    });

    return result.asObservable();
  }

  private createHostDialog(
    internalDialogRef: InternalMdlDialogReference,
    dialogConfig: IMdlDialogConfiguration
  ): ComponentRef<any> {
    const viewContainerRef = this.mdlDialogOutletService.viewContainerRef;

    if (!viewContainerRef) {
      throw new Error('You did not provide a ViewContainerRef. ' +
        'Please see https://github.com/mseemann/angular2-mdl/wiki/How-to-use-the-MdlDialogService');
    }

    let providers: Array<Provider> = [
      { provide: MDL_CONFIGUARTION, useValue: dialogConfig },
      { provide: InternalMdlDialogReference, useValue: internalDialogRef}
    ];

    let hostDialogComponent = this.createComponentInstance(viewContainerRef, providers, MdlDialogHostComponent);

    internalDialogRef.hostDialogComponentRef  = hostDialogComponent;
    internalDialogRef.isModal                 = dialogConfig.isModal;

    internalDialogRef.closeCallback = () => {
      this.popDialog(internalDialogRef);
      hostDialogComponent.instance.hide(hostDialogComponent);
    };
    this.pushDialog(internalDialogRef);

    return hostDialogComponent;
  }

  private pushDialog(dialogRef: InternalMdlDialogReference): void {
    if (this.openDialogs.length === 0) {
      this.onDialogsOpenChanged.emit(true);
    }

    this.openDialogs.push(dialogRef);
    this.orderDialogStack();
  }

  private popDialog(dialogRef: InternalMdlDialogReference): void {
    this.openDialogs.splice(this.openDialogs.indexOf(dialogRef), 1);
    this.orderDialogStack();

    if (this.openDialogs.length === 0) { // last dialog being closed
      this.onDialogsOpenChanged.emit(false);
    }
  }

  private orderDialogStack(): void {
    let zIndex = MIN_DIALOG_Z_INDEX + 1;

    this.openDialogs.forEach( (iDialogRef) => {
      iDialogRef.hostDialog.zIndex = zIndex;
      zIndex += 2;
    });

    this.mdlDialogOutletService.hideBackdrop();

    let topMostModalDialog: InternalMdlDialogReference = this.getTopMostInternalDialogRef();
    if (topMostModalDialog) {
      this.mdlDialogOutletService.showBackdropWithZIndex(topMostModalDialog.hostDialog.zIndex - 1);
    }
  }

  private getTopMostInternalDialogRef(): InternalMdlDialogReference {
    let topMostModalDialog: InternalMdlDialogReference = null;

    for (let i = (this.openDialogs.length - 1); i >= 0; i--) {
      if (this.openDialogs[i].isModal) {
        topMostModalDialog = this.openDialogs[i];
        break;
      }
    }
    return topMostModalDialog;
  }

  private onBackdropClick(): void {
    let topMostModalDialog: InternalMdlDialogReference = this.getTopMostInternalDialogRef();
    if (topMostModalDialog.config.clickOutsideToClose) {
      topMostModalDialog.hide();
    }
  }

  private createComponentInstance <T> (
    viewContainerRef: ViewContainerRef,
    providers: Array<Provider>,
    component: Type<T>
  ): ComponentRef<any> {
    let cFactory            = this.componentFactoryResolver.resolveComponentFactory(component);

    let resolvedProviders   = ReflectiveInjector.resolve(providers);
    let parentInjector      = viewContainerRef.parentInjector;
    let childInjector       = ReflectiveInjector.fromResolvedProviders(resolvedProviders, parentInjector);

    return viewContainerRef.createComponent(cFactory, viewContainerRef.length, childInjector);
  }
}
