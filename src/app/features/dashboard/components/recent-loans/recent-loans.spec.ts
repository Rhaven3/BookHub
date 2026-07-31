import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentLoans } from './recent-loans';

describe('RecentLoans', () => {
  let component: RecentLoans;
  let fixture: ComponentFixture<RecentLoans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentLoans],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentLoans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
