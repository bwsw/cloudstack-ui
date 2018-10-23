import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PopoverModule } from './index';
import { PopoverTriggerDirective } from './popover-trigger.directive';

@Component({
  selector: 'cs-test',
  template: `
    <button
      [csPopoverTrigger]="popover"
      (popoverOpened)="openEvents = openEvents + 1"
      (popoverClosed)="closeEvents = closeEvents + 1"
    ></button>
    <cs-popover #popover><div data-id="popover-content">test</div></cs-popover>
  `,
})
class TestComponent {
  @ViewChild(PopoverTriggerDirective)
  public popover: PopoverTriggerDirective;
  public openEvents = 0;
  public closeEvents = 0;
}

@Component({
  selector: 'cs-test-error',
  template: '<button csPopoverTrigger></button>',
})
class TestErrorComponent {}

describe('PopoverTriggerDirective', () => {
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PopoverModule],
      declarations: [TestComponent, TestErrorComponent],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            overlayContainerElement.classList.add('cdk-overlay-container');
            document.body.appendChild(overlayContainerElement);

            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => document.body.removeChild(overlayContainerElement));

  it('should throw if no PopoverComponent is passed', () => {
    const f = TestBed.createComponent(TestErrorComponent);
    expect(() => f.detectChanges()).toThrow();
  });

  it('should open the popover when clicking the trigger', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(component.popover.open).toBe(true);
    expect(
      fixture.debugElement
        .query(By.css('div[data-id="popover-content"]'))
        .nativeElement.textContent.trim(),
    ).toBe('test');
    expect(
      overlayContainerElement.querySelector('div[data-id="popover-content"]').textContent.trim(),
    ).toBe('test');
  });

  it('should close the popover when it is open and the trigger is clicked again', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(component.popover.open).toBe(true);

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();

    expect(component.popover.open).toBe(false);
  });

  it('should close the popover when clicking outside of the trigger', () => {
    fixture.detectChanges();

    component.popover.openPopover();
    fixture.detectChanges();
    expect(component.popover.open).toBe(true);

    document.body.click();
    fixture.detectChanges();
    expect(component.popover.open).toBe(false);
    expect(document.body.querySelector('div[data-id="popover-content"]')).toBe(null);
  });

  it('should emit open and close events', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.openEvents).toBe(0);
    expect(component.closeEvents).toBe(0);

    component.popover.openPopover();
    expect(component.openEvents).toBe(1);
    expect(component.closeEvents).toBe(0);
    component.popover.closePopover();
    expect(component.closeEvents).toBe(1);
  }));
});
