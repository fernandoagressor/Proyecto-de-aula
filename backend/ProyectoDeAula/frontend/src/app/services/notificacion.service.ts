import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  icono: string;
  titulo: string;
  mensaje: string;
  rolDestino: string;
  leida: boolean;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private apiUrl = 'http://localhost:8080/api/notificaciones';

  constructor(private http: HttpClient) {}

  listarPorRol(rol: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/rol/${rol}`);
  }

  contarNoLeidas(rol: string): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.apiUrl}/rol/${rol}/no-leidas`);
  }

  marcarComoLeidas(rol: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rol/${rol}/marcar-leidas`, {});
  }
}
