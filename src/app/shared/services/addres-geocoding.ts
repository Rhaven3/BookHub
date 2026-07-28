import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { AddressSuggestion } from '../interfaces/address-suggestion.interface';

/** Forme brute d'une "feature" retournée par l'API Adresse (api-adresse.data.gouv.fr) */
interface AddressApiFeature {
  properties: {
    label: string;
    name: string;
    postcode: string;
    city: string;
  };
}

interface AddressApiResponse {
  features: AddressApiFeature[];
}

@Injectable({
  providedIn: 'root',
})
export class AddressGeocodingService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://api-adresse.data.gouv.fr/search/';

  /** Nombre max de suggestions retournées par l'API */
  private readonly resultLimit = 5;

  /**
   * Recherche des adresses correspondant à la requête texte.
   * Ne déclenche pas d'appel si la requête est trop courte (< 3 caractères) —
   * évite des appels API inutiles pour des résultats de toute façon peu pertinents.
   */
  search(query: string): Observable<AddressSuggestion[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&limit=${this.resultLimit}`;

    return this.http.get<AddressApiResponse>(url).pipe(
      tap((res) => console.log('réponse brute API:', res)),
      map((response) => this.mapToSuggestions(response)),
      // En cas d'erreur réseau/API, on retourne une liste vide plutôt que
      // de casser le flux — l'utilisateur peut toujours saisir l'adresse à la main
      catchError(() => of([])),
    );
  }

  private mapToSuggestions(response: AddressApiResponse): AddressSuggestion[] {
    return response.features.map((feature) => ({
      label: feature.properties.label,
      street: feature.properties.name,
      postalCode: feature.properties.postcode,
      city: feature.properties.city,
      country: 'France',
    }));
  }
}
