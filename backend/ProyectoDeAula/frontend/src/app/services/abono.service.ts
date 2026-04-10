import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Abono } from './abono';

@Injectable({
  providedIn: 'root'
})
export class AbonoService {

  private apiUrl = 'http://localhost:8080/api/abonos';

  constructor(private http: HttpClient) {}

  listarAbonos(): Observable<Abono[]> {
    return this.http.get<Abono[]>(this.apiUrl);
  }

  listarAbonosPorPrestamo(prestamoId: number): Observable<Abono[]> {
    return this.http.get<Abono[]>(`${this.apiUrl}/prestamo/${prestamoId}`);
  }

  listarPendientes(): Observable<Abono[]> {
    return this.http.get<Abono[]>(`${this.apiUrl}/pendientes`);
  }
}
