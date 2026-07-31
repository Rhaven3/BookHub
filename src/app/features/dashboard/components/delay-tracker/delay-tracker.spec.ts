import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayTracker } from './delay-tracker';

describe('DelayTracker', () => {
  let component: DelayTracker;
  let fixture: ComponentFixture<DelayTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayTracker],
    }).compileComponents();

    fixture = TestBed.createComponent(DelayTracker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
