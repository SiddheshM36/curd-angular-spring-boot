import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl: string = "https://ztr264r579.execute-api.us-east-1.amazonaws.com/dev";
  private accessToken: string | null = null;
  private idToken: string | null = null;

  constructor(private _httpClient: HttpClient) {
    this.extractTokenFromUrl();
  }

  // ✅ Extract ACCESS TOKEN and ID TOKEN from URL fragment after Cognito login
  private extractTokenFromUrl(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substr(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken) {
        this.accessToken = accessToken;
        console.log('✅ Access Token:', this.accessToken);
        localStorage.setItem('access_token', accessToken);
      } else {
        console.warn('⚠️ No access_token found in URL fragment.');
      }

      if (idToken) {
        this.idToken = idToken;
        console.log('✅ ID Token:', this.idToken);
        localStorage.setItem('id_token', idToken);
      } else {
        console.warn('⚠️ No id_token found in URL fragment.');
      }

      // Clean URL (remove token fragment)
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    else {
        // Load from localStorage on refresh
        this.accessToken = localStorage.getItem('access_token');
        this.idToken = localStorage.getItem('id_token');
      }

  }

  // Getters for debugging
  getAccessToken(): string | null {
    return this.accessToken;
  }

  getIdToken(): string | null {
    return this.idToken;
  }

  // Attach Authorization header to requests using ID token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getIdToken();
    if (!token) {
      console.warn('⚠️ No id_token available for Authorization header!');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // CRUD API calls
  fetchAllEmployees(): Observable<Employee[]> {
    this.extractTokenFromUrl();
    return this._httpClient.get<Employee[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createEmployee(data: Employee): Observable<Employee> {
    this.extractTokenFromUrl();
    return this._httpClient.post<Employee>(this.baseUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateEmployee(data: Employee): Observable<Employee> {
    this.extractTokenFromUrl();
    return this._httpClient.put<Employee>(`${this.baseUrl}/${data.id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

   deleteEmployee(id: number): Observable<Employee> {
    this.extractTokenFromUrl();
    return this._httpClient.delete<Employee>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

}
