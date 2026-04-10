import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from './prestamo';
import { Abono } from './abono';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'http://localhost:8080/api/prestamos';

  constructor(private http: HttpClient) {}

  listarPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  listarPorCliente(clienteId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  obtenerPrestamoPorId(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  solicitarPrestamo(datos: {
    clienteId: string;
    monto: string;
    plazoMeses: string;
  }): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, datos);
  }

  aprobarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  abonarPrestamo(id: number, abono: string): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/${id}/abonar`, {
      abono: Number(abono)
    });
  }

  aprobarAbono(abonoId: number): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/aprobar`, {});
  }

  rechazarAbono(abonoId: number): Observable<Abono> {
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/rechazar`, {});
  }
}
