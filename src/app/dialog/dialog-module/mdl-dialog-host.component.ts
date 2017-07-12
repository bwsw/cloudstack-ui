import {
  AfterViewChecked,
  Component,
  ComponentRef,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';

import { MdlButtonComponent } from '@angular-mdl/core';
import { Animations } from '@angular-mdl/core/components/common/animations';

import { InternalMdlDialogReference } from './internal-dialog-reference';
import { IMdlDialogConfiguration, IOpenCloseRect } from './mdl-dialog-configuration';
import { MDL_CONFIGUARTION, MIN_DIALOG_Z_INDEX } from './mdl-dialog.service';


const enterTransitionDuration = 300;
const leaveTransitionDuration = 250;

const enterTransitionEasingCurve = 'cubic-bezier(0.0, 0.0, 0.2, 1)';
const leaveTransitionEasingCurve = 'cubic-bezier(0.0, 0.0, 0.2, 1)';

@Component({
  // tslint:disable-next-line
  selector: 'mdl-dialog-host-component',
  templateUrl: 'mdl-dialog-host.component.html',
  styleUrls: ['mdl-dialog-host.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MdlDialogHostComponent implements OnInit, AfterViewChecked {
  @HostBinding('class.mdl-dialog') public mdlDialog = true;
  @HostBinding('class.open') public visible = false;
  @HostBinding('style.zIndex') public zIndex = MIN_DIALOG_Z_INDEX + 1;

  @ViewChild('dialogTarget', {read: ViewContainerRef}) public dialogTarget: ElementRef;
  @ViewChild('dialogHostWrapper') public dialogHostWrapper: ElementRef;


  private showAnimationStartStyle: {[key: string]: string} = {
    top: '38%',
    opacity: '0'
  };

  private showStyle: {[key: string]: string} = {
    top: '50%',
    opacity: '1'
  };

  private hideAnimationEndStyle: {[key: string]: string} = {
    top: '63%',
    opacity: '0'
  };

  constructor(
    private animations: Animations,
    private elementRef: ElementRef,
    private internalDialogRef: InternalMdlDialogReference,
    private renderer: Renderer2,
    @Inject(forwardRef(() => MDL_CONFIGUARTION)) private config: IMdlDialogConfiguration
  ) {}

  public ngOnInit(): void {
    this.applyStyle(this.config.styles || {});
    this.applyClasses(this.config.classes ? this.config.classes : '');
    this.addResizeListener();
  }

  public ngAfterViewChecked(): void {
    this.updateDialogPosition();
  }

  public show(): void {
    this.visible = true;
    setTimeout( () => {
      this.internalDialogRef.visible();
    });

    if (this.isAnimateEnabled()) {
      if (this.config.openFrom || this.config.closeTo) {
        this.showStyle['transform'] = 'translate(0, -50%) scale(1.0)';

        const targetClientRect = this.elementRef.nativeElement.getBoundingClientRect();

        const openFromRect = this.getClientRect(this.config.openFrom);
        const closeToRect = this.config.closeTo ? this.getClientRect(this.config.closeTo) : openFromRect;

        const centerTarget = this.getCenterInScreen(targetClientRect);
        const centerFrom = this.getCenterInScreen(openFromRect);
        const centerTo = this.getCenterInScreen(closeToRect);

        const translationFrom = {
          x: Math.round(centerFrom.cx - centerTarget.cx),
          y: Math.round(centerFrom.cy - centerTarget.cy),
          scaleX: Math.round(100 * Math.min(0.25, openFromRect.width / targetClientRect.width)) / 100,
          scaleY: Math.round(100 * Math.min(0.25, openFromRect.height / targetClientRect.height)) / 100
        };

        this.showAnimationStartStyle = {
          top: `${targetClientRect.top}px`,
          opacity: '0',
          transform: `translate(${translationFrom.x}px,`
          + `${translationFrom.y}px) scale(${translationFrom.scaleX},`
          + `${translationFrom.scaleY})`
        };

        const translationTo = {
          x: Math.round(centerTo.cx - centerTarget.cx),
          y: Math.round(centerTo.cy - centerTarget.cy),
          scaleX: Math.round(100 * Math.min(0.25, closeToRect.width / targetClientRect.width)) / 100,
          scaleY: Math.round(100 * Math.min(0.25, closeToRect.height / targetClientRect.height)) / 100
        };

        this.hideAnimationEndStyle = {
          top: `${targetClientRect.top}px`,
          opacity: '0',
          transform: `translate(${translationTo.x}px,`
          + `${translationTo.y}px) scale(${translationTo.scaleX},`
          + `${translationTo.scaleY})`
        };
      }

      const animation: any = this.animations.animate(
        this.elementRef.nativeElement,
        [
          this.showAnimationStartStyle,
          this.showStyle
        ],
        this.config.enterTransitionDuration || enterTransitionDuration,
        this.config.enterTransitionEasingCurve || enterTransitionEasingCurve);

      animation.play();
    }
  }

  public hide(selfComponentRef: ComponentRef<MdlDialogHostComponent>): void {
    if (this.isAnimateEnabled()) {

      const animation: any = this.animations.animate(
        this.elementRef.nativeElement,
        [
          this.showStyle,
          this.hideAnimationEndStyle
        ],
        this.config.leaveTransitionDuration || leaveTransitionDuration,
        this.config.leaveTransitionEasingCurve || leaveTransitionEasingCurve);

      animation.onDone( () => {
        selfComponentRef.destroy();
      });

      animation.play();

    } else {
      selfComponentRef.destroy();
    }
  }

  @HostListener('window:resize')
  private addResizeListener(): void {
    this.updateDialogPosition();
  }

  private updateDialogPosition(): void {
    const dialogHost = this.elementRef.nativeElement;
    let margin = (window.innerHeight - dialogHost.clientHeight) / 2;
    margin = Math.floor(margin / 5) * 5; // floor down to 5px to prevent rounding errors
    margin = margin < 0 ? 0 : margin;

    this.renderer.setStyle(dialogHost, 'margin-top', margin + 'px');
    this.renderer.setStyle(dialogHost, 'margin-bottom', margin + 'px');
  }

  private applyStyle(styles: {[key: string]: string}): void {
    for (const style in styles) {
      if (styles.hasOwnProperty(style)) {
        this.renderer.setStyle(this.elementRef.nativeElement, style, styles[style]);
      }
    }
  }

  private applyClasses(classes: string): void {
    classes
      .split(' ')
      .filter(cssClass => !!cssClass)
      .forEach(cssClass => {
        return this.renderer.addClass(this.elementRef.nativeElement, cssClass);
      });
  }

  private isAnimateEnabled(): boolean {
    if (typeof this.config.animate === 'undefined') {
      return true;
    }
    return this.config.animate;
  }

  private getClientRect(input): IOpenCloseRect {

    if (input instanceof MdlButtonComponent) {
      const elRef = (input as MdlButtonComponent).elementRef;
      const rect: ClientRect = elRef.nativeElement.getBoundingClientRect();
      return this.createOpenCloseRect(rect);
    } else if (input instanceof MouseEvent) {
      const evt: MouseEvent = input as MouseEvent;
      const htmlElement = (evt.target || evt['testtarget']) as HTMLElement;
      const rect: ClientRect = htmlElement.getBoundingClientRect();
      return this.createOpenCloseRect(rect);
    }
    return input as IOpenCloseRect;
  }

  private createOpenCloseRect(rect: ClientRect): IOpenCloseRect {
    return {
      height: rect.top - rect.bottom,
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left
    };
  }

  private getCenterInScreen(rect: IOpenCloseRect): any {
    return {
      cx: Math.round(rect.left + (rect.width / 2)),
      cy: Math.round(rect.top + (rect.height / 2))
    };
  }
}
