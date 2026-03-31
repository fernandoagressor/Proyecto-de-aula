import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';


export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }
  crearUsuario(usuario: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl, usuario);

  }
  eliminarUsuario(id : number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
