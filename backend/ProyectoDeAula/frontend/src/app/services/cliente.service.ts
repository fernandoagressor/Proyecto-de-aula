// Permite marcar la clase como servicio inyectable en Angular
import { Injectable } from '@angular/core';

// HttpClient permite hacer peticiones HTTP (GET, POST, PUT, DELETE)
import { HttpClient } from '@angular/common/http';

// Observable maneja respuestas asíncronas
import { Observable } from 'rxjs';


// Decorador del servicio
@Injectable({

  // Hace que el servicio esté disponible en toda la aplicación
  providedIn: 'root'
})
export class ClienteService {

  // URL base del backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/clientes';

  // Constructor: Angular inyecta HttpClient automáticamente
  constructor(private http: HttpClient) {}

  // Método para obtener todos los clientes
  listarClientes(): Observable<any[]> {

    // Hace una petición GET al backend
    // URL: http://localhost:8080/api/clientes
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para obtener un cliente por ID
  obtenerClientePorId(id: number): Observable<any> {

    // GET con parámetro dinámico
    // Ejemplo: /api/clientes/5
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un cliente
  crearCliente(cliente: any): Observable<any> {

    // POST envía datos al backend
    // Body: { nombre, cedula, telefono, direccion }
    return this.http.post<any>(this.apiUrl, cliente);
  }

  // Método para actualizar un cliente existente
  actualizarCliente(id: number, cliente: any): Observable<any> {

    // PUT envía datos actualizados
    // URL: /api/clientes/5
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  // Método para eliminar un cliente
  eliminarCliente(id: number): Observable<any> {

    // DELETE elimina en el backend
    // URL: /api/clientes/5
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
