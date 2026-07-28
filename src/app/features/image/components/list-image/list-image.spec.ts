import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImage } from './list-image';

describe('ListImage', () => {
  let component: ListImage;
  let fixture: ComponentFixture<ListImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListImage],
    }).compileComponents();

    fixture = TestBed.createComponent(ListImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
