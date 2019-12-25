import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { delay as observableDelay } from 'rxjs/operators';
import { VirtualMachine } from '../../..';
import { VmHttpAddressPipe } from '../vm-http-address.pipe';

import { POLL_PERIOD, VmHttpAccessLinkComponent } from './vm-http-access-link.component';
import { VmReachability } from './vm-reachability.enum';
import { VM_REACHABILITY_SERVICE } from './vm-reachability.service';

describe('VmHttpAccessLinkComponent', () => {
  let component: VmHttpAccessLinkComponent;
  let fixture: ComponentFixture<VmHttpAccessLinkComponent>;

  const mockAddressPipe = MockPipe(VmHttpAddressPipe, () => 'http://example.com');

  const vm = {};
  let reachabilityService;

  beforeEach(() => {
    reachabilityService = {
      getReachibility: jasmine.createSpy().and.returnValue(of(VmReachability.Reachable)),
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VmHttpAccessLinkComponent, mockAddressPipe],
      providers: [{ provide: VM_REACHABILITY_SERVICE, useValue: reachabilityService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmHttpAccessLinkComponent);
    component = fixture.componentInstance;
    component.vm = vm as VirtualMachine;
  });

  function ensureReachability(reachability: VmReachability, delay = 0) {
    const val = of(reachability);
    reachabilityService.getReachibility.and.returnValue(
      delay ? val.pipe(observableDelay(delay)) : val,
    );
  }

  function findSpinner(): HTMLElement | null {
    return fixture.nativeElement.querySelector('mat-spinner');
  }

  function findWarnIcon(): HTMLElement | null {
    return fixture.nativeElement.querySelector('mat-icon.mdi-alert');
  }

  it('should have Unknown reachability status by default', () => {
    fixture.detectChanges();
    expect(component.reachabilityState).toBe(component.Reachability.Unknown);
  });

  it('should have vm as required input', () => {
    component.vm = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should poll for reachability every 5sec', fakeAsync(() => {
    fixture.detectChanges();

    ensureReachability(VmReachability.Unreachable);
    tick(0);
    expect(reachabilityService.getReachibility).toHaveBeenCalledWith(vm);
    expect(reachabilityService.getReachibility).toHaveBeenCalledTimes(1);
    expect(component.reachabilityState).toBe(VmReachability.Unreachable);

    ensureReachability(VmReachability.Unreachable);
    tick(POLL_PERIOD);
    expect(reachabilityService.getReachibility).toHaveBeenCalledTimes(2);
    expect(component.reachabilityState).toBe(VmReachability.Unreachable);

    ensureReachability(VmReachability.ServiceUnresponsive);
    tick(POLL_PERIOD);
    expect(reachabilityService.getReachibility).toHaveBeenCalledTimes(3);
    expect(component.reachabilityState).toBe(VmReachability.ServiceUnresponsive);

    tick(POLL_PERIOD);
    // should not poll when ServiceUnresponsive or Reachable
    expect(reachabilityService.getReachibility).toHaveBeenCalledTimes(3);

    fixture.destroy();
  }));

  it('should show a spinner when status check is in progress', fakeAsync(() => {
    ensureReachability(VmReachability.Unreachable, 100);
    fixture.detectChanges();

    tick(0);
    fixture.detectChanges();
    expect(component.checkingStatus).toBe(true);
    expect(findSpinner()).not.toBe(null);

    tick(100);
    fixture.detectChanges();
    expect(component.checkingStatus).toBe(false);
    expect(findSpinner()).toBe(null);

    fixture.destroy();
  }));

  it('should show a warn sign when status service is unresponsive', fakeAsync(() => {
    fixture.detectChanges();

    ensureReachability(VmReachability.ServiceUnresponsive, 1);
    tick(0);
    fixture.detectChanges();
    expect(component.checkingStatus).toBe(true);
    expect(findWarnIcon()).toBeNull(); // warn sign should not be shows when loading

    tick(1);
    fixture.detectChanges();
    expect(findWarnIcon()).not.toBeNull();

    fixture.destroy();
  }));

  describe('address link', () => {
    function findLink() {
      return fixture.nativeElement.querySelector('a');
    }

    function findNotice() {
      return fixture.nativeElement.querySelector('span');
    }

    it('should not show anything when reachability is unknown', () => {
      fixture.detectChanges();
      expect(component.reachabilityState).toBe(VmReachability.Unknown);
      expect(findLink()).toBeNull();
      expect(findNotice()).toBeNull();
    });

    it('should show a notice when VM is unreachable', fakeAsync(() => {
      fixture.detectChanges();
      ensureReachability(VmReachability.Unreachable);
      tick(0);

      fixture.detectChanges();
      expect(findNotice()).not.toBeNull();
      expect(findLink()).toBeNull();

      fixture.destroy();
    }));

    it('should show the access link otherwise', fakeAsync(() => {
      fixture.detectChanges();

      ensureReachability(VmReachability.Reachable);
      tick(0);
      fixture.detectChanges();
      expect(findLink()).not.toBeNull();
      expect(findNotice()).toBeNull();

      ensureReachability(VmReachability.ServiceUnresponsive);
      tick(POLL_PERIOD);
      fixture.detectChanges();
      expect(findLink()).not.toBeNull();
      expect(findNotice()).toBeNull();

      fixture.destroy();
    }));
  });
});
