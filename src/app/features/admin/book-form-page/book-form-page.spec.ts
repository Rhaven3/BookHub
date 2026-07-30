import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormPage } from './book-form-page';

describe('BookFormPage', () => {
  let component: BookFormPage;
  let fixture: ComponentFixture<BookFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
