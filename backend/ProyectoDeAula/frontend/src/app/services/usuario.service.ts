// Permite marcar la clase como un servicio inyectable en Angular
import { Injectable } from '@angular/core';

// HttpClient permite hacer peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';

// Observable maneja respuestas asíncronas
import { Observable } from 'rxjs';


// Decorador del servicio
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class UsuarioService {

  // URL base del backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/usuarios';

  // Constructor: Angular inyecta HttpClient automáticamente
  constructor(private http: HttpClient) {}

  // Método para obtener todos los usuarios
  listarUsuarios(): Observable<any[]> {

    // GET → /api/usuarios
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo usuario
  crearUsuario(usuario: any): Observable<any> {

    // POST → /api/usuarios
    // Envía el objeto usuario al backend
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // Método para actualizar un usuario existente
  actualizarUsuario(id: number, usuario: any): Observable<any> {

    // PUT → /api/usuarios/{id}
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {

    // DELETE → /api/usuarios/{id}
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Método para iniciar sesión (login)
  login(datos: { nombre: string; password: string }): Observable<any> {

    // POST → /api/usuarios/login
    // Envía nombre y contraseña
    return this.http.post<any>(`${this.apiUrl}/login`, datos);
  }
}
