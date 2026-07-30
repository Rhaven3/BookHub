import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBook } from './detail-book';

describe('DetailBook', () => {
  let component: DetailBook;
  let fixture: ComponentFixture<DetailBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailBook],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
