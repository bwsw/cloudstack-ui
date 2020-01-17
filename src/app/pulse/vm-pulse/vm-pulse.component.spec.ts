import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { IntervalsResp, PulseService } from '../pulse.service';
import { PulseParamsPersistence } from './pulse-params-persistence';
import { VmPulseComponent } from './vm-pulse.component';

describe('VmPulseComponent', () => {
  let component: VmPulseComponent;
  let fixture: ComponentFixture<VmPulseComponent>;

  const vmId = 'vmId';
  const permittedIntervals: IntervalsResp = {
    shifts: ['m', 'h', 'd'],
    scales: [
      { '15m': { range: '15m', aggregations: ['1m', '5m'] } },
      { '1h': { range: '1h', aggregations: ['1m', '5m', '15m'] } },
      { '1d': { range: '1d', aggregations: ['30m', '1h'] } },
      { '1w': { range: '1w', aggregations: ['1h', '4h'] } },
      { '30d': { range: '30d', aggregations: ['4h', '1d'] } },
    ],
  };

  let pulseService;
  let persistence;

  beforeEach(async(() => {
    pulseService = {
      getPermittedIntervals: jasmine.createSpy().and.returnValue(of(permittedIntervals)),
    };

    persistence = {
      readParams: jasmine.createSpy(),
      writeParams: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      declarations: [VmPulseComponent, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        {
          provide: MAT_DIALOG_DATA,
          useValue: vmId,
        },
        {
          provide: PulseService,
          useValue: pulseService,
        },
        {
          provide: PulseParamsPersistence,
          useValue: persistence,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmPulseComponent);
    component = fixture.componentInstance;
  });

  it('should read params from the storage', () => {
    persistence.readParams.and.returnValue({
      shift: 'd',
      aggregations: ['15m', '1h'],
      scaleRange: '1h',
      shiftAmount: 1,
    });

    fixture.detectChanges(); // results in ngOnInit call
    expect(persistence.readParams).toHaveBeenCalled();
    expect(component.selectedShift).toBe('d');
    expect(component.selectedAggregations).toEqual(['15m', '1h']);
    expect(component.selectedScale.range).toBe('1h');
    expect(component.shiftAmount).toBe(1);
  });

  it('should provide a default value for shiftAmount', () => {
    persistence.readParams.and.returnValue({
      shiftAmount: undefined,
    });

    fixture.detectChanges(); // results in ngOnInit call
    expect(component.shiftAmount).toBe(0);
  });

  describe('storage updates', () => {
    beforeEach(() => {
      persistence.readParams.and.returnValue({});
      fixture.detectChanges();
    });

    it('should update shift', () => {
      component.selectedShift = 'm';
      expect(persistence.writeParams).toHaveBeenCalledWith(
        jasmine.objectContaining({
          shift: 'm',
        }),
      );
    });

    it('should update scale range', () => {
      component.selectedScale = { range: '15m', aggregations: [] };
      expect(persistence.writeParams).toHaveBeenCalledWith(
        jasmine.objectContaining({
          scaleRange: '15m',
        }),
      );
    });

    it('should update shift amount', () => {
      component.shiftAmount = 2;
      expect(persistence.writeParams).toHaveBeenCalledWith(
        jasmine.objectContaining({
          shiftAmount: 2,
        }),
      );
    });

    it('should update aggregations', () => {
      component.selectedAggregations = ['1h', '1w'];
      expect(persistence.writeParams).toHaveBeenCalledWith(
        jasmine.objectContaining({
          aggregations: ['1h', '1w'],
        }),
      );
    });
  });
});
