import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayListPage } from './delay-list-page';

describe('DelayListPage', () => {
  let component: DelayListPage;
  let fixture: ComponentFixture<DelayListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelayListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DelayListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
