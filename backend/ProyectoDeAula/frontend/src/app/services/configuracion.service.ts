import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracionSistema } from './configuracion';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private apiUrl = 'http://localhost:8080/api/configuracion';

  constructor(private http: HttpClient) {}

  obtenerConfiguracion(): Observable<ConfiguracionSistema> {
    return this.http.get<ConfiguracionSistema>(this.apiUrl);
  }

  actualizarTasa(tasaInteres: string): Observable<ConfiguracionSistema> {
    return this.http.put<ConfiguracionSistema>(`${this.apiUrl}/tasa`, {
      tasaInteres: tasaInteres
    });
  }
}
