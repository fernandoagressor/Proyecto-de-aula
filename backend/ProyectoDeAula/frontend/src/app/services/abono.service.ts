// Permite marcar la clase como un servicio inyectable
import { Injectable } from '@angular/core';

// HttpClient permite hacer peticiones HTTP (GET, POST, PUT, DELETE)
import { HttpClient } from '@angular/common/http';

// Observable es el tipo de dato que maneja respuestas asíncronas
import { Observable } from 'rxjs';

// Importa el modelo Abono
import { Abono } from './abono';


// Decorador del servicio
@Injectable({

  // Hace que el servicio esté disponible en toda la aplicación
  providedIn: 'root'
})
export class AbonoService {

  // URL base del backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/abonos';

  // Constructor con inyección de HttpClient
  constructor(private http: HttpClient) {}

  // Método para obtener TODOS los abonos
  listarAbonos(): Observable<Abono[]> {

    // Hace una petición GET al backend
    // URL: http://localhost:8080/api/abonos
    return this.http.get<Abono[]>(this.apiUrl);
  }

  // Método para obtener abonos de un préstamo específico
  listarAbonosPorPrestamo(prestamoId: number): Observable<Abono[]> {

    // Hace GET con parámetro dinámico
    // Ejemplo: /api/abonos/prestamo/5
    return this.http.get<Abono[]>(`${this.apiUrl}/prestamo/${prestamoId}`);
  }

  // Método para obtener solo abonos pendientes
  listarPendientes(): Observable<Abono[]> {

    // Llama al endpoint de pendientes
    // URL: /api/abonos/pendientes
    return this.http.get<Abono[]>(`${this.apiUrl}/pendientes`);
  }
}
