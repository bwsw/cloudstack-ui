import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedCardListComponent } from './grouped-card-list.component';

describe('CsGroupedCardListComponent', () => {
  let component: GroupedCardListComponent;
  let fixture: ComponentFixture<GroupedCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
