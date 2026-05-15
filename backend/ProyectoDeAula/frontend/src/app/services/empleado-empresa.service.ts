import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoEmpresaService {

  private apiUrl = 'http://localhost:8080/api/empleados-empresa';

  constructor(private http: HttpClient) {}

  listarPorEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/empresa/${empresaId}`
    );
  }

  crearEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empleado);
  }

  actualizarEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      empleado
    );
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }
}
