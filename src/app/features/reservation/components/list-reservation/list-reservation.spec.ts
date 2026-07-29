import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReservation } from './list-reservation';

describe('ListReservation', () => {
  let component: ListReservation;
  let fixture: ComponentFixture<ListReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListReservation],
    }).compileComponents();

    fixture = TestBed.createComponent(ListReservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
