import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrestamoEmpleado {
  id?: number;
  empleado: string;
  cedula: string;
  cargo: string;
  monto: number;
  saldoPendiente?: number;
  estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'PAGADO';
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrestamoEmpleadoService {

  private apiUrl = 'http://localhost:8080/api/prestamos-empleados';

  constructor(private http: HttpClient) {}

  listar(): Observable<PrestamoEmpleado[]> {
    return this.http.get<PrestamoEmpleado[]>(this.apiUrl);
  }

  crear(prestamo: PrestamoEmpleado): Observable<PrestamoEmpleado> {
    return this.http.post<PrestamoEmpleado>(this.apiUrl, prestamo);
  }

  actualizar(id: number, prestamo: PrestamoEmpleado): Observable<PrestamoEmpleado> {
    return this.http.put<PrestamoEmpleado>(`${this.apiUrl}/${id}`, prestamo);
  }

  aprobar(id: number): Observable<PrestamoEmpleado> {
    return this.http.put<PrestamoEmpleado>(`${this.apiUrl}/${id}/aprobar`, {});
  }

  rechazar(id: number): Observable<PrestamoEmpleado> {
    return this.http.put<PrestamoEmpleado>(`${this.apiUrl}/${id}/rechazar`, {});
  }

  marcarPagado(id: number): Observable<PrestamoEmpleado> {
    return this.http.put<PrestamoEmpleado>(`${this.apiUrl}/${id}/pagado`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
