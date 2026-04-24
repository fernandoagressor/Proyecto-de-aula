// Permite declarar la clase como un servicio de Angular
import { Injectable } from '@angular/core';

// HttpClient permite hacer peticiones HTTP al backend (GET, PUT, etc.)
import { HttpClient } from '@angular/common/http';

// Observable representa la respuesta asíncrona del servidor
import { Observable } from 'rxjs';

// Importa la estructura (interface) de ConfiguracionSistema
import { ConfiguracionSistema } from './configuracion';


// Decorador que registra el servicio en toda la aplicación
@Injectable({
  providedIn: 'root' // Disponible globalmente sin importar el módulo
})
export class ConfiguracionService {

  // URL base del backend (Spring Boot)
  private apiUrl = 'http://localhost:8080/api/configuracion';

  // Constructor: Angular inyecta automáticamente HttpClient
  constructor(private http: HttpClient) {}

  // Método para obtener la configuración actual (la tasa)
  obtenerConfiguracion(): Observable<ConfiguracionSistema> {

    // Hace una petición GET al backend
    // Endpoint: /api/configuracion
    return this.http.get<ConfiguracionSistema>(this.apiUrl);
  }

  // Método para actualizar la tasa de interés
  actualizarTasa(tasaInteres: string): Observable<ConfiguracionSistema> {

    // Hace una petición PUT al backend
    // Endpoint: /api/configuracion/tasa
    // Envía un objeto JSON con la tasa
    return this.http.put<ConfiguracionSistema>(`${this.apiUrl}/tasa`, {

      // Body del request (lo que viaja al backend)
      tasaInteres: tasaInteres
    });
  }
}
