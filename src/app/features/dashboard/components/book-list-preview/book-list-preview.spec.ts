import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListPreview } from './book-list-preview';

describe('BookListPreview', () => {
  let component: BookListPreview;
  let fixture: ComponentFixture<BookListPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookListPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(BookListPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
