import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiBar } from './kpi-bar';

describe('KpiBar', () => {
  let component: KpiBar;
  let fixture: ComponentFixture<KpiBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiBar],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
