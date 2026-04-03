import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from './prestamo';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'http://localhost:8080/api/prestamos';

  constructor(private http: HttpClient) {}

  // 🔹 Listar todos los préstamos
  listarPrestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  // 🔹 Listar préstamos por cliente
  listarPrestamosPorCliente(clienteId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // 🔹 Obtener préstamo por ID
  obtenerPrestamoPorId(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Solicitar préstamo
  solicitarPrestamo(datos: {
    clienteId: string;
    monto: string;
    plazoMeses: string;
    interes: string;
  }): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, datos);
  }

  // 🔹 Aprobar préstamo
  aprobarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  // 🔹 Rechazar préstamo
  rechazarPrestamo(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  // 🔹 Abonar préstamo
  abonarPrestamo(id: number, abono: string): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/abonar`, {
      abono: abono
    });
  }
}
