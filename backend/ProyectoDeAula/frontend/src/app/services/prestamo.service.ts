// Permite marcar la clase como servicio inyectable
import { Injectable } from '@angular/core';

// Permite hacer peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';

// Observable maneja respuestas asíncronas
import { Observable } from 'rxjs';

// Importa modelo Prestamo
import { Prestamo } from './prestamo';

// Importa modelo Abono
import { Abono } from './abono';


// Decorador del servicio
@Injectable({
  providedIn: 'root' // Disponible en toda la app
})
export class PrestamoService {

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/prestamos';

  // Constructor: Angular inyecta HttpClient
  constructor(private http: HttpClient) {}

  // Obtener TODOS los préstamos
  listarPrestamos(): Observable<Prestamo[]> {

    // GET → /api/prestamos
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  // Obtener préstamos de un cliente específico
  listarPorCliente(clienteId: number): Observable<Prestamo[]> {

    // GET → /api/prestamos/cliente/5
    return this.http.get<Prestamo[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  // Obtener un préstamo por ID
  obtenerPrestamoPorId(id: number): Observable<Prestamo> {

    // GET → /api/prestamos/1
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  // Solicitar un nuevo préstamo
  solicitarPrestamo(datos: {
    clienteId: string;
    monto: string;
    plazoMeses: string;
  }): Observable<Prestamo> {

    // POST → /api/prestamos/solicitar
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, datos);
  }

  // Aprobar un préstamo
  aprobarPrestamo(id: number): Observable<Prestamo> {

    // PUT → /api/prestamos/{id}/aprobar
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  // Rechazar un préstamo
  rechazarPrestamo(id: number): Observable<Prestamo> {

    // PUT → /api/prestamos/{id}/rechazar
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  // Abonar a un préstamo
  abonarPrestamo(id: number, abono: string): Observable<Abono> {

    // PUT → /api/prestamos/{id}/abonar
    // Convierte el string a número antes de enviarlo
    return this.http.put<Abono>(`${this.apiUrl}/${id}/abonar`, {

      // Body enviado al backend
      abono: Number(abono)
    });
  }

  // Aprobar un abono (admin)
  aprobarAbono(abonoId: number): Observable<Abono> {

    // PUT → /api/prestamos/abonos/{id}/aprobar
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/aprobar`, {});
  }

  // Rechazar un abono (admin)
  rechazarAbono(abonoId: number): Observable<Abono> {

    // PUT → /api/prestamos/abonos/{id}/rechazar
    return this.http.put<Abono>(`${this.apiUrl}/abonos/${abonoId}/rechazar`, {});
  }
}
