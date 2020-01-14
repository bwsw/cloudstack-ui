import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { MemoryStorageService } from '../../shared/services/memory-storage.service';
import { StorageService } from '../../shared/services/storage.service';
import { IntervalsResp, PulseService } from '../pulse.service';
import { pulseParameters, VmPulseComponent } from './vm-pulse.component';

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
  let storage: StorageService;

  beforeEach(async(() => {
    pulseService = {
      getPermittedIntervals: jasmine.createSpy().and.returnValue(of(permittedIntervals)),
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
          provide: LocalStorageService,
          useClass: MemoryStorageService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    storage = TestBed.get(LocalStorageService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmPulseComponent);
    component = fixture.componentInstance;
  });

  it('should read params from the storage', () => {
    storage.write(pulseParameters.Shift, 'd');
    storage.write(pulseParameters.Aggregations, '15m,1h');
    storage.write(pulseParameters.ScaleRange, '1h');
    storage.write(pulseParameters.ShiftAmount, '1');

    const readSpy = spyOn(storage, 'read').and.callThrough();

    fixture.detectChanges(); // results in ngOnInit call
    expect(readSpy).toHaveBeenCalled();
    expect(component.selectedShift).toBe('d');
    expect(component.selectedAggregations).toEqual(['15m', '1h']);
    expect(component.selectedScale.range).toBe('1h');
    expect(component.shiftAmount).toBe(1);
  });

  describe('storage updates', () => {
    let writeSpy: jasmine.Spy;

    beforeEach(() => {
      writeSpy = spyOn(storage, 'write');
      fixture.detectChanges();
    });

    it('should update shift', () => {
      component.selectedShift = 'm';
      expect(writeSpy).toHaveBeenCalledWith(pulseParameters.Shift, 'm');
    });

    it('should update scale range', () => {
      component.selectedScale = { range: '15m', aggregations: [] };
      expect(writeSpy).toHaveBeenCalledWith(pulseParameters.ScaleRange, '15m');
    });

    it('should update shift amount', () => {
      component.shiftAmount = 2;
      expect(writeSpy).toHaveBeenCalledWith(pulseParameters.ShiftAmount, '2');
    });

    it('should update aggregations', () => {
      component.selectedAggregations = ['1h', '1w'];
      expect(writeSpy).toHaveBeenCalledWith(pulseParameters.Aggregations, '1h,1w');
    });
  });
});
