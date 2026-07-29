import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFilter } from './book-filter';

describe('BookFilter', () => {
  let component: BookFilter;
  let fixture: ComponentFixture<BookFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
