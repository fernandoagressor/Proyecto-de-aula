import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = "http://localhost:8080/api/clientes";
  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(this.apiUrl);
  }
  crearCliente(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`,cliente);
  }
}
