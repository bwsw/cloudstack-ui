import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';

import { InsufficientResourcesComponent } from './insufficient-resources.component';

describe('InsufficientResourcesComponent', () => {
  let component: InsufficientResourcesComponent;
  let fixture: ComponentFixture<InsufficientResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsufficientResourcesComponent, MockTranslatePipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientResourcesComponent);
    component = fixture.componentInstance;
  });

  function setResources(resources: string[]) {
    component.insufficientResources = resources;
    fixture.detectChanges();
  }

  it('should handle instances not available', () => {
    setResources(['instances']);
    expect(fixture.nativeElement.textContent).toContain(
      'VM_PAGE.VM_CREATION.NO_AVAILABLE_INSTANCES',
    );
  });

  it('should handle max instances not available', () => {
    setResources(['max_instances']);
    expect(fixture.nativeElement.textContent).toContain('VM_PAGE.VM_CREATION.NO_MAX_INSTANCES');
  });

  it('should list other resources', () => {
    setResources(['volumes', 'cpus']);
    expect(fixture.nativeElement.textContent).toContain('VM_PAGE.VM_CREATION.YOU_RAN_OUT_OF');
    expect(fixture.nativeElement.textContent).toContain('VM_PAGE.VM_CREATION.VOLUMES');
    expect(fixture.nativeElement.textContent).toContain('VM_PAGE.VM_CREATION.CPUS');
  });
});
