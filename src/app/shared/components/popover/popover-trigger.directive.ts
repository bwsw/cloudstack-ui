import {
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { PopoverComponent } from './popover.component';

/**
 * This directive is used in conjunction with cs-popover component:
 *    <button [csPopoverTrigger]="popover"></button>
 *    <cs-popover #popover></cs-popover>
 *
 * It handles opening and closing the popover.
 */
@Directive({
  selector: '[csPopoverTrigger]',
})
export class PopoverTriggerDirective implements AfterViewInit, OnDestroy {
  @Input()
  public csPopoverTrigger: PopoverComponent;
  @Input()
  public popoverPositionX: HorizontalConnectionPos;
  @Input()
  public popoverPositionY: VerticalConnectionPos;
  @Output()
  public popoverOpened = new EventEmitter<void>();
  @Output()
  public popoverClosed = new EventEmitter<void>();

  private portal: TemplatePortal<any>;
  private overlayRef: OverlayRef | null = null;
  // tslint:disable-next-line:variable-name
  private _open = false;

  constructor(
    private overlay: Overlay,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  public ngAfterViewInit(): void {
    if (!this.csPopoverTrigger) {
      throw new Error(`csPopoverTrigger: you need to pass a PopoverComponent instance.

      Example:
        <button [csPopoverTrigger]="popover"></button>
        <cs-popover #popover></cs-popover>
      `);
    }
  }

  public ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  @HostListener('click')
  public handleClick() {
    if (this._open) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event: MouseEvent) {
    const clickTarget = event.target as HTMLElement;
    const el = this.element.nativeElement;

    if (
      this._open &&
      clickTarget !== el &&
      !el.contains(clickTarget) &&
      !!this.overlayRef &&
      !this.overlayRef.overlayElement.contains(clickTarget)
    ) {
      this.closePopover();
    }
  }

  public get open(): boolean {
    return this._open;
  }

  public openPopover() {
    if (!this._open) {
      this.createOverlay().attach(this.portal);
      this._open = true;
      this.popoverOpened.emit();
    }
  }

  public closePopover() {
    if (this.overlayRef && this._open) {
      this.overlayRef.detach();
      this._open = false;
      this.popoverClosed.emit();
    }
  }

  private createOverlay(): OverlayRef {
    if (!this.overlayRef) {
      this.portal = new TemplatePortal(this.csPopoverTrigger.templateRef, this.viewContainerRef);

      const config = new OverlayConfig();
      config.positionStrategy = this.getPositionStrategy();
      config.scrollStrategy = this.overlay.scrollStrategies.reposition();

      this.overlayRef = this.overlay.create(config);
    }

    return this.overlayRef;
  }

  private getPositionStrategy(): PositionStrategy {
    const overlayX = this.popoverPositionX || 'center';
    const overlayY = this.popoverPositionY || 'top';

    const fallbackOverlayX = overlayX === 'start' ? 'end' : overlayX === 'end' ? 'start' : 'center';
    const fallbackOverlayY =
      overlayY === 'top' ? 'bottom' : overlayY === 'bottom' ? 'top' : 'center';

    return (
      this.overlay
        .position()
        // todo
        // tslint:disable-next-line:deprecation
        .connectedTo(
          this.element,
          {
            originX: 'center',
            originY: 'bottom',
          },
          {
            overlayX,
            overlayY,
          },
        )
        .withFallbackPosition(
          {
            originX: 'center',
            originY: 'top',
          },
          {
            overlayX: fallbackOverlayX,
            overlayY: fallbackOverlayY,
          },
        )
    );
  }
}
