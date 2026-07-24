import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddImage } from './form-add-image';

describe('FormAddImage', () => {
  let component: FormAddImage;
  let fixture: ComponentFixture<FormAddImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAddImage],
    }).compileComponents();

    fixture = TestBed.createComponent(FormAddImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
