import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditForm } from './user-edit-form';

describe('UserEditForm', () => {
  let component: UserEditForm;
  let fixture: ComponentFixture<UserEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
