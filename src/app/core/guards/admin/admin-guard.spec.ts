import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin-guard';
import { Auth } from '../../features/auth/service/auth';
import { signal } from '@angular/core';

describe('adminGuard', () => {
  let mockAuth: Partial<Auth>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Auth, useValue: mockAuth },
      ],
    });
  });

  it("autorise l'accès si l'utilisateur est admin", () => {
    mockAuth = { isAdmin: signal(true) };
    TestBed.overrideProvider(Auth, { useValue: mockAuth });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it("refuse l'accès et redirige si l'utilisateur n'est pas admin", () => {
    mockAuth = { isAdmin: signal(false) };
    TestBed.overrideProvider(Auth, { useValue: mockAuth });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/image']);
  });
});
