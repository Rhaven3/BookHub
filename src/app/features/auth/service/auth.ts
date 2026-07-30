import { HttpClient } from '@angular/common/http';
import {
  Observable,
  Subscription,
  catchError,
  finalize,
  map,
  of,
  shareReplay,
  tap,
  timer,
} from 'rxjs';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../shared/interfaces/apiResponse';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../auth.interface';
import { ENVIRONMENT } from '../../../environments/environment';
import { AdminUser } from '../../admin/admin.interface';
import { NotificationService } from '../../../core/layout/header/notification/service/notification-service';

/** temps avant le refresh Auto du token */
const REFRESH_MARGIN_MS = 30_000;

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router)
  private notificationService = inject(NotificationService);
  //Base url pour les appels API
  private baseUrl = ENVIRONMENT.apiUrl;

  // État interne (privé, modifiable uniquement depuis ce service)
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<CurrentUser | null>(null);

  // Cache l'appel HTTP de refresh en cours, pour éviter que plusieurs
  // appels concurrents (ex: plusieurs requêtes 401 en parallèle) ne
  // déclenchent chacun leur propre refresh
  private refreshInProgress$: Observable<AuthResponse> | null = null;

  // Référence à l'abonnement du timer de refresh automatique,
  // pour pouvoir l'annuler (ex: lors d'un logout ou d'un nouveau login)
  private refreshTimer: Subscription | null = null;

  // Versions publiques en lecture seule (le composant ne peut pas faire .set() dessus)
  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();

  // Signaux dérivés, recalculés automatiquement quand token/user changent
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');

  /** Connecte l'utilisateur et initialise la session (token + planification du refresh) */
  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, dto, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.setSession(response);
          // on lance la connexion WebSocket
          this.notificationService.connect(response.accessToken);

          // et on charge l'historique des non-lues via REST
          this.notificationService.getAllMeNotification().subscribe((notifs) => {
            this.notificationService.setInitialNotifications(notifs);
          });
        }),
      );
  }

  register(dto: RegisterRequest): Observable<AdminUser> {
    return this.http
      .post<ApiResponse<AdminUser>>(`${this.baseUrl}/auth/register`, dto)
      .pipe(map((response) => response.data));
  }

  /**
   * Rafraîchit le token via le cookie de refresh (httpOnly côté serveur).
   * Si un refresh est déjà en cours, on retourne le même Observable
   * au lieu d'en déclencher un nouveau (évite les appels dupliqués).
   */
  refresh(): Observable<AuthResponse> {
    if (!this.refreshInProgress$) {
      this.refreshInProgress$ = this.http
        .post<AuthResponse>(`${this.baseUrl}/auth/refresh`, {}, { withCredentials: true })
        .pipe(
          tap((response) => this.setSession(response)),
          // Une fois terminé (succès ou erreur), on libère le cache
          // pour permettre un futur refresh
          finalize(() => (this.refreshInProgress$ = null)),
          // Partage le résultat entre tous les abonnés qui arrivent
          // pendant que la requête est en cours
          shareReplay(1),
        );
    }
    return this.refreshInProgress$;
  }

  /** Tente de restaurer une session via le cookie de refresh au démarrage de l'app ; ne lève jamais d'erreur. */
  tryRestoreSession(): Observable<void> {
    return this.refresh().pipe(
      map(() => void 0),
      // Si le refresh échoue (pas de cookie valide, expiré...),
      // on nettoie l'état local sans planter l'app
      catchError(() => {
        this.clearLocalSession();
        return of(void 0);
      }),
    );
  }

  /** Déconnecte l'utilisateur côté serveur puis nettoie la session locale */
  logout(): void {
    this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => this.clearSession(),
      // Même en cas d'erreur serveur, on nettoie quand même la session locale
      error: () => this.clearSession(),
    });
    this.notificationService.disconnect();
  }

  /** Permet de set les nouvelles informations du user lors d'un EDIT */
  setUser(user: CurrentUser): void {
    this.userSignal.set(user);
  }

  /** Met à jour l'état interne (token, user) et planifie le prochain refresh */
  private setSession(response: AuthResponse): void {
    this.tokenSignal.set(response.accessToken);
    this.userSignal.set({ ...response.user });
    this.scheduleRefresh(response.expiresAt);
  }

  /**
   * Programme un refresh automatique juste avant l'expiration du token
   * (avec une marge de sécurité de REFRESH_MARGIN_MS).
   * Si un timer précédent existe déjà, on l'annule avant d'en créer un nouveau.
   */
  private scheduleRefresh(expiresAt: number): void {
    this.refreshTimer?.unsubscribe();
    const delay = Math.max(expiresAt - Date.now() - REFRESH_MARGIN_MS, 0);
    this.refreshTimer = timer(delay).subscribe(() => {
      // Si le refresh automatique échoue, on considère la session perdue
      this.refresh().subscribe({ error: () => this.logout() });
    });
  }

  /** Réinitialise l'état local (signaux + timer) sans appel réseau ni navigation */
  private clearLocalSession(): void {
    this.refreshTimer?.unsubscribe();
    this.refreshTimer = null;
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  /** Nettoie la session locale puis redirige vers la page de login */
  private clearSession(): void {
    this.clearLocalSession();
    this.router.navigate(['/auth/login']);
  }
}
